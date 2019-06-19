customElements.define('th-dataviewbox', DataViewBox);

window.addEventListener('load', () => {
  const arrayBuffer = new ArrayBuffer(1000);
  const byteArray = new Uint8Array(arrayBuffer);
  const labels = [];
  byteArray[0] = 65;
  labels[0] = '#777777 Number sixty-five, the ASCII letter capital A';
  byteArray[1] = 65;
  labels[1] = '#777777 Number sixty-five, the ASCII letter capital A';
  labels[2] = '#777777 Empty';
  byteArray[1 + 16 * 1] = 2;
  labels[1 + 16 * 1] = 'Number two';
  byteArray[2 + 16 * 2] = 3;
  labels[2 + 16 * 2] = 'Number three';
  byteArray[3 + 16 * 3] = 4;
  labels[3 + 16 * 3] = 'Number four';

  const dataView = new DataView(arrayBuffer);
  document.getElementById('dataViewBox').styleSrc = 'DataViewBox.css';
  document.getElementById('dataViewBox').labels = labels;
  document.getElementById('dataViewBox').addEventListener('hover', event => document.title = `${event.relativeOffset}/${event.absoluteOffset}: ${event.title}`);
  document.getElementById('dataViewBox').dataView = dataView;
});
