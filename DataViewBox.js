export default class DataViewBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  raiseHover = (event) => {
    const hoverEvent = new Event('hover');
    hoverEvent.relativeOffset = Number(event.currentTarget.dataset.offset);
    hoverEvent.absoluteOffset = this.dataView.byteOffset + Number(event.currentTarget.dataset.offset);
    hoverEvent.details = this.details[Number(event.currentTarget.dataset.offset)];
    this.dispatchEvent(hoverEvent);
  };

  get dataView() {
    return this._dataView;
  }

  set dataView(/** @type {DataView} */ dataView) {
    this._dataView = dataView;
    this.render();
  }

  async render() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = import.meta.url.replace(/.js$/, '.css');
    this.shadowRoot.append(link);

    const columnCount = 16;
    const rowCount = Math.floor(this._dataView.byteLength / columnCount);

    let lineDiv;
    let lineCount = 0;
    while (!lineDiv || (this.getAttribute('no-virtualization') !== null ? lineCount < rowCount : lineDiv.offsetTop < this.offsetHeight)) {
      lineDiv = document.createElement('div');

      for (let index = 0; index < columnCount; index++) {
        const cellHexSpan = document.createElement('span');
        cellHexSpan.className = 'cellHexSpan';
        cellHexSpan.addEventListener('mouseover', this.raiseHover);
        lineDiv.append(cellHexSpan);

        const cellDecSpan = document.createElement('span');
        cellDecSpan.className = 'cellDecSpan';
        cellDecSpan.addEventListener('mouseover', this.raiseHover);
        lineDiv.append(cellDecSpan);

        const cellAsciiSpan = document.createElement('span');
        cellAsciiSpan.className = 'cellAsciiSpan';
        cellAsciiSpan.addEventListener('mouseover', this.raiseHover);
        lineDiv.append(cellAsciiSpan);
      }

      this.shadowRoot.append(lineDiv);
      lineCount++;

      // Wait for the element to be added to the DOM so `offsetTop` is up-to-date
      await new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    this.lineHeight = lineDiv.clientHeight;
    this.lineCount = lineCount;

    this.update();

    if (this.getAttribute('no-virtualization') === null) {
      this.addEventListener('scroll', this.update);
    }
  }

  update() {
    const columnCount = 16;
    const rowCount = Math.floor(this._dataView.byteLength / columnCount);

    const offsetCount = Math.floor(this._dataView.byteOffset / columnCount);
    const hiddenCount = this.getAttribute('no-virtualization') !== null ? 0 : Math.floor(this.scrollTop / this.lineHeight);

    // TODO: Add or remove rows as needed if the viewport changed (so that resize handler can use `render` too)
    // TODO: Reorder rows in groups as they come off screen instead of updating contents of all
    for (let index = 0; index < this.lineCount; index++) {
      const lineIndex = hiddenCount + index;

      for (let subindex = 0; subindex < columnCount; subindex++) {
        const byte = this._dataView.getUint8(lineIndex * columnCount + subindex);

        let color;
        let title;
        let onClick;
        if (this.details && this.details[lineIndex * columnCount + subindex]) {
          color = this.details[lineIndex * columnCount + subindex].color;
          title = this.details[lineIndex * columnCount + subindex].title;
          onClick = this.details[lineIndex * columnCount + subindex].onClick;
        }

        const cellHexSpan = this.shadowRoot.children[index + 1].children[subindex * 3];
        cellHexSpan.classList.toggle('zero', byte === 0);
        cellHexSpan.classList.toggle('leading-zero', byte < 16);
        cellHexSpan.title = title;
        cellHexSpan.style.background = color;
        cellHexSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellHexSpan.textContent = byte.toString(16);
        cellHexSpan.addEventListener('click', onClick);

        const cellDecSpan = this.shadowRoot.children[index + 1].children[subindex * 3 + 1];
        cellDecSpan.classList.toggle('zero', byte === 0);
        cellDecSpan.title = title;
        cellDecSpan.style.background = color;
        cellDecSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellDecSpan.textContent = byte;
        cellDecSpan.addEventListener('click', onClick);

        const cellAsciiSpan = this.shadowRoot.children[index + 1].children[subindex * 3 + 2];
        cellAsciiSpan.classList.toggle('empty', byte < 32 || byte > 126);
        cellAsciiSpan.title = title;
        cellAsciiSpan.style.background = color;
        cellAsciiSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellAsciiSpan.textContent = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ' ';
        cellAsciiSpan.textContent = cellAsciiSpan.textContent === ' ' ? '_' : cellAsciiSpan.textContent;
        cellAsciiSpan.addEventListener('click', onClick);
      }
    }

    const idealHeight = rowCount * this.lineHeight;
    const padHeight = idealHeight - this.lineCount * this.lineHeight;
    const headHeight = Math.min(this.scrollTop, padHeight);
    const footHeight = padHeight - headHeight;

    this.style.paddingTop = headHeight + 'px';
    this.style.paddingBottom = footHeight + 'px';
  }
}

customElements.define('th-dataviewbox', DataViewBox);
