import DataViewBox from './DataViewBox.js';

const arrayBuffer = new ArrayBuffer(1000);
const byteArray = new Uint8Array(arrayBuffer);
const details = [];
byteArray[0] = 65;
details[0] = { color: '#f1f1f1', title: 'Number sixty-five, the ASCII letter capital A', onClick: () => alert('This is an A') };
byteArray[1] = 65;
details[1] = { color: '#f1f1f1', title: 'Number sixty-five, the ASCII letter capital A' };
details[2] = { color: '#f1f1f1', title: 'Empty' };
byteArray[1 + 16 * 1] = 2;
details[1 + 16 * 1] = { color: 'transparent', title: 'Number two' };
byteArray[2 + 16 * 2] = 3;
details[2 + 16 * 2] = { color: 'transparent', title: 'Number three' };
byteArray[3 + 16 * 3] = 4;
details[3 + 16 * 3] = { color: 'transparent', title: 'Number four' };

const dataViewBox = document.querySelector('th-dataviewbox');
const detailsDiv = document.querySelector('#detailsDiv');

const dataView = new DataView(arrayBuffer);
dataViewBox.details = details;
dataViewBox.dataView = dataView;

dataViewBox.addEventListener('hover', event => {
  detailsDiv.textContent = event.relativeOffset + '/' + event.absoluteOffset;
  detailsDiv.style.background = 'none';

  if (event.details) {
    detailsDiv.textContent += ': ' + event.details.title;
    detailsDiv.style.background = event.details.color;
  }
});
