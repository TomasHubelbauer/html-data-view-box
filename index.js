customElements.define('th-dataviewbox', DataViewBox);

window.addEventListener('load', () => {
  const arrayBuffer = new ArrayBuffer(1000);
  const byteArray = new Uint8Array(arrayBuffer);
  const details = [];
  byteArray[0] = 65;
  details[0] = { color: '#f1f1f1', title: 'Number sixty-five, the ASCII letter capital A' };
  byteArray[1] = 65;
  details[1] = { color: '#f1f1f1', title: 'Number sixty-five, the ASCII letter capital A' };
  details[2] = { color: '#f1f1f1', title: 'Empty' };
  byteArray[1 + 16 * 1] = 2;
  details[1 + 16 * 1] = { color: 'transparent', title: 'Number two' };
  byteArray[2 + 16 * 2] = 3;
  details[2 + 16 * 2] = { color: 'transparent', title: 'Number three' };
  byteArray[3 + 16 * 3] = 4;
  details[3 + 16 * 3] = { color: 'transparent', title: 'Number four' };

  const dataView = new DataView(arrayBuffer);
  document.getElementById('dataViewBox').styleSrc = 'DataViewBox.css';
  document.getElementById('dataViewBox').details = details;
  document.getElementById('dataViewBox').dataView = dataView;

  document.getElementById('dataViewBox').addEventListener('hover', event => {
    document.getElementById('detailsDiv').textContent = event.relativeOffset + '/' + event.absoluteOffset;
    document.getElementById('detailsDiv').style.background = 'none';

    if (event.details) {
      document.getElementById('detailsDiv').textContent += ': ' + event.details.title;
      document.getElementById('detailsDiv').style.background = event.details.color;
    }
  });
});
