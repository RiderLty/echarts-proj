import React from 'react';
import * as XLSX from 'xlsx';


function XlsxReader({onDataRead}) {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      onDataRead && onDataRead(jsonData)
    };

    reader.onerror = (e) => {
      console.error('文件读取错误：', e.target.error);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
    </div>
  );
}

export default XlsxReader;