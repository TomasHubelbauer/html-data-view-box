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

    const lineNumberSpan = document.createElement('span');
    lineNumberSpan.className = 'lineNumberSpan';
    lineNumberSpan.textContent = ++lineCount;
    lineDiv.append(lineNumberSpan);

    for (let index = 0; index < columnCount; index++) {
      const cellSpan = document.createElement('span');
      cellSpan.className = 'cellSpan';
      cellSpan.textContent = 'TODO';
      lineDiv.append(cellSpan);
    }

    boxDiv.append(lineDiv);
  }

  function render() {
    const hiddenCount = Math.floor(boxDiv.scrollTop / lineDiv.clientHeight);

    // TODO: Add or remove rows as needed if the viewport changed (so that resize handler can use `render` too)
    // TODO: Reorder rows in groups as they come off screen instead of updating contents of all
    for (let index = 0; index < lineCount; index++) {
      const lineIndex = hiddenCount + index;

      // Update the line number span
      boxDiv.children[index].children[0].textContent = lineIndex + 1;

      // Update the cell spans
      for (let subindex = 0; subindex < columnCount; subindex++) {
        let hex = dataView.getUint8(lineIndex * columnCount + subindex).toString(16);
        boxDiv.children[index].children[subindex + 1 /* Skip line number span */].textContent = hex.length === 1 ? '0' + hex : hex;
      }
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
