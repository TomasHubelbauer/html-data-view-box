window.addEventListener('load', () => {
  const arrayBuffer = new ArrayBuffer(1000);
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
    const fullLines = (boxDiv.clientHeight / lineDiv.clientHeight);
    console.log('full lines', fullLines);

    const totalHeight = Math.ceil(boxDiv.offsetHeight / lineCount) * rowCount;
    console.log('total height', totalHeight);

    //headPadDiv.style.height = `${boxDiv.scrollTop}px`;
    //footPadDiv.style.height = `${totalHeight - boxDiv.offsetHeight - boxDiv.scrollTop}px`;
    console.log('scroll height', boxDiv.scrollHeight);

    console.log(lineCount, columnCount, rowCount, totalHeight, boxDiv.scrollHeight, boxDiv.offsetHeight, boxDiv.clientHeight, headPadDiv.style.height, footPadDiv.style.height);
  }

  //boxDiv.addEventListener('scroll', render);

  render();
  // boxDiv.scrollTo(0, 0);
  // render();
  // boxDiv.scrollTo(0, 1);
  // render();
  // boxDiv.scrollTo(0, 2);
  // render();
  // boxDiv.scrollTo(0, 3);
  // render();
  // boxDiv.scrollTo(0, 4);
  // render();
});
