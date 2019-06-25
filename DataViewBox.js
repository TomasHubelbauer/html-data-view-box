class DataViewBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.raiseHover = (event) => {
      const hoverEvent = new Event('hover');
      hoverEvent.relativeOffset = Number(event.currentTarget.dataset.offset);
      hoverEvent.absoluteOffset = this.dataView.byteOffset + Number(event.currentTarget.dataset.offset);
      hoverEvent.details = this.details[Number(event.currentTarget.dataset.offset)];
      this.dispatchEvent(hoverEvent);
    };
  }

  connectedCallback() {
    // Note that at this point the layout information is not available yet so we cannot render yet
    // The `dataView` field doesn't have a value yet either as it gains it in the `load` handler of `window`
    // https://stackoverflow.com/q/56648928/2715716
    //setTimeout(() => this.render(), 0);
  }

  get dataView() {
    return this._dataView;
  }

  set dataView(/** @type{DataView} */ dataView) {
    this._dataView = dataView;
    this.render();
  }

  render() {
    const columnCount = 16;
    const rowCount = Math.floor(this.dataView.byteLength / columnCount);

    let lineDiv;
    let lineCount = 0;
    while (!lineDiv || (this.getAttribute('no-virtualization') ? lineCount < rowCount : lineDiv.offsetTop < this.offsetHeight)) {
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

      this.shadow.append(lineDiv);
    }

    this.lineHeight = lineDiv.clientHeight;
    this.lineCount = lineCount;

    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = this.styleSrc;
    this.shadow.append(styleLink);

    this.update();

    // Ignore scroll handing if the virtualization is disabled
    if (!this.getAttribute('no-virtualization')) {
      // TODO: Move this back to the constructor when the attribute is removed
      // as currently we need to wait for the element to mount to read its value
      this.addEventListener('scroll', this.update);
    }
  }

  update() {
    const columnCount = 16;
    const rowCount = Math.floor(this.dataView.byteLength / columnCount);

    const offsetCount = Math.floor(this.dataView.byteOffset / columnCount);
    const hiddenCount = this.getAttribute('no-virtualization') ? 0 : Math.floor(this.scrollTop / this.lineHeight);

    // TODO: Add or remove rows as needed if the viewport changed (so that resize handler can use `render` too)
    // TODO: Reorder rows in groups as they come off screen instead of updating contents of all
    for (let index = 0; index < this.lineCount; index++) {
      const lineIndex = hiddenCount + index;

      for (let subindex = 0; subindex < columnCount; subindex++) {
        const byte = this.dataView.getUint8(lineIndex * columnCount + subindex);

        let color;
        let title;
        let onClick;
        if (this.details && this.details[lineIndex * columnCount + subindex]) {
          color = this.details[lineIndex * columnCount + subindex].color;
          title = this.details[lineIndex * columnCount + subindex].title;
          onClick = this.details[lineIndex * columnCount + subindex].onClick;
        }

        const cellHexSpan = this.shadow.children[index].children[subindex * 3];
        cellHexSpan.classList.toggle('zero', byte === 0);
        cellHexSpan.classList.toggle('leading-zero', byte < 16);
        cellHexSpan.title = title;
        cellHexSpan.style.background = color;
        cellHexSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellHexSpan.textContent = byte.toString(16);
        cellHexSpan.onclick = onClick;

        const cellDecSpan = this.shadow.children[index].children[subindex * 3 + 1];
        cellDecSpan.classList.toggle('zero', byte === 0);
        cellDecSpan.title = title;
        cellDecSpan.style.background = color;
        cellDecSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellDecSpan.textContent = byte;
        cellDecSpan.onclick = onClick;

        const cellAsciiSpan = this.shadow.children[index].children[subindex * 3 + 2];
        cellAsciiSpan.classList.toggle('empty', byte < 32 || byte > 126);
        cellAsciiSpan.title = title;
        cellAsciiSpan.style.background = color;
        cellAsciiSpan.dataset.offset = lineIndex * columnCount + subindex;
        cellAsciiSpan.textContent = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ' ';
        cellAsciiSpan.textContent = cellAsciiSpan.textContent === ' ' ? '_' : cellAsciiSpan.textContent;
        cellAsciiSpan.onclick = onClick;
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
