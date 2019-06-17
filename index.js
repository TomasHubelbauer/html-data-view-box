window.addEventListener('load', () => {
  const arrayBuffer = new ArrayBuffer(1000);
  const byteArray = new Uint8Array(arrayBuffer);
  byteArray[0] = 1;
  byteArray[1 + 16 * 1] = 2;
  byteArray[2 + 16 * 2] = 3;

  const dataView = new DataView(arrayBuffer);

  const columnCount = 16;
  const rowCount = Math.floor(dataView.byteLength / columnCount);

  const boxDiv = document.getElementById('boxDiv');

  let lineDiv;
  let lineCount = 0;
  while (!lineDiv || lineDiv.offsetTop < boxDiv.offsetHeight) {
    lineDiv = document.createElement('div');
    lineDiv.textContent = lineCount++;
    boxDiv.append(lineDiv);
  }

  function render() {
    const hiddenCount = Math.floor(boxDiv.scrollTop / lineDiv.clientHeight);

    // TODO: Add or remove rows as needed if the viewport changed (so that resize handler can use `render` too)
    for (let index = 0; index < lineCount; index++) {
      const lineNumber = hiddenCount + index;
      let line = '';
      for (let subindex = 0; subindex < columnCount; subindex++) {
        line += dataView.getUint8(lineNumber * columnCount + subindex) + ' ';
      }

      boxDiv.children[index].textContent = `${lineNumber}: ${line}`;
    }

    const idealHeight = rowCount * lineDiv.clientHeight;
    const padHeight = idealHeight - lineCount * lineDiv.clientHeight;
    const headHeight = Math.min(boxDiv.scrollTop, padHeight);
    const footHeight = padHeight - headHeight;

    boxDiv.style.paddingTop = headHeight + 'px';
    boxDiv.style.paddingBottom = footHeight + 'px';
  }

  boxDiv.addEventListener('scroll', render);
  render();
});
