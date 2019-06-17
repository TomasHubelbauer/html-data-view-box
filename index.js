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

  const headPadDiv = document.createElement('div');
  boxDiv.append(headPadDiv);

  let lineDiv;
  let lineCount = 0;
  while (!lineDiv || lineDiv.offsetTop < boxDiv.offsetHeight) {
    lineDiv = document.createElement('div');
    lineDiv.textContent = lineCount++;
    boxDiv.append(lineDiv);
  }

  const footPadDiv = document.createElement('div');
  boxDiv.append(footPadDiv);

  function render() {
    // Ignore scroll events created when scrolling programatically (interferes with this logic)
    boxDiv.removeEventListener('scroll', render);

    const hiddenCount = Math.floor(boxDiv.scrollTop / lineDiv.clientHeight);

    for (let index = 0; index < lineCount; index++) {
      const lineNumber = hiddenCount + index;
      let line = '';
      for (let subindex = 0; subindex < columnCount; subindex++) {
        line += dataView.getUint8(lineNumber * columnCount + subindex) + ' ';
      }

      boxDiv.children[index + 1 /* Pad */].textContent = `${lineNumber}: ${line}`;
    }

    const idealHeight = rowCount * lineDiv.clientHeight;

    const padHeight = idealHeight - lineCount * lineDiv.clientHeight;
    const headHeight = Math.min(boxDiv.scrollTop, padHeight);
    const footHeight = padHeight - headHeight;

    headPadDiv.style.height = headHeight + 'px';
    footPadDiv.style.height = footHeight + 'px';

    // Restore listening to scroll events initated by the user
    boxDiv.addEventListener('scroll', render);
  }

  boxDiv.addEventListener('scroll', render);

  render();
});
