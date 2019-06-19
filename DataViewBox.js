class DataViewBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
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

      const lineNumberSpan = document.createElement('span');
      lineNumberSpan.className = 'lineNumberSpan';
      lineNumberSpan.textContent = ++lineCount;
      lineDiv.append(lineNumberSpan);

      for (let index = 0; index < columnCount; index++) {
        const cellHexSpan = document.createElement('span');
        cellHexSpan.className = 'cellHexSpan';
        lineDiv.append(cellHexSpan);

        const cellDecSpan = document.createElement('span');
        cellDecSpan.className = 'cellDecSpan';
        lineDiv.append(cellDecSpan);

        const cellAsciiSpan = document.createElement('span');
        cellAsciiSpan.className = 'cellAsciiSpan';
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

    const hiddenCount = Math.floor(this.scrollTop / this.lineHeight);

    // TODO: Add or remove rows as needed if the viewport changed (so that resize handler can use `render` too)
    // TODO: Reorder rows in groups as they come off screen instead of updating contents of all
    for (let index = 0; index < this.lineCount; index++) {
      const lineIndex = hiddenCount + index;

      // Update the line number span
      const lineNumberSpan = this.shadow.children[index].children[0];
      lineNumberSpan.textContent = lineIndex + 1;

      // Update the cell spans
      for (let subindex = 0; subindex < columnCount; subindex++) {
        const byte = this.dataView.getUint8(lineIndex * columnCount + subindex);

        const cellHexSpan = this.shadow.children[index].children[1 + subindex * 3];
        cellHexSpan.classList.toggle('zero', byte === 0);
        cellHexSpan.classList.toggle('leading-zero', byte < 16);
        cellHexSpan.textContent = byte.toString(16);

        const cellDecSpan = this.shadow.children[index].children[1 + subindex * 3 + 1];
        cellDecSpan.classList.toggle('zero', byte === 0);
        cellDecSpan.textContent = byte;

        const cellAsciiSpan = this.shadow.children[index].children[1 + subindex * 3 + 2];
        cellAsciiSpan.textContent = byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '';
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
