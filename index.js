customElements.define('th-dataviewbox', DataViewBox);

window.addEventListener('load', () => {
  const arrayBuffer = new ArrayBuffer(1000);
  const byteArray = new Uint8Array(arrayBuffer);
  byteArray[0] = 1;
  byteArray[1 + 16 * 1] = 2;
  byteArray[2 + 16 * 2] = 3;
  byteArray[3 + 16 * 3] = 65;

  const dataView = new DataView(arrayBuffer);
  document.getElementById('dataViewBox').styleSrc = 'DataViewBox.css';
  document.getElementById('dataViewBox').dataView = dataView;
});
