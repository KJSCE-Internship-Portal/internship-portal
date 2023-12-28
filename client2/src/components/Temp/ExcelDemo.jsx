import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as XLSX from 'xlsx';

const ExcelDemo = () => {
  const [pastedData, setPastedData] = useState('');
  const [isCopied, setCopied] = useState(false);

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    setPastedData(pastedText);
    const jsonData = parsePastedData(pastedText);
    if (jsonData) {
      console.log('Parsed Data:', jsonData);
    }
  };

  const parsePastedData = (pastedText) => {
    var jsonData = [];
    const rows = pastedText.split('\n').map((row) => {
      if (row!=""){
        jsonData.push(row.split('\t'));
      }
      return row.split('\t')

    });

    
    
    console.log(jsonData);
    return jsonData;
  };


  return (
    <div>
      <CopyToClipboard text={pastedData} onCopy={() => setCopied(true)}>
        <button>Paste Excel Data</button>
      </CopyToClipboard>
      {isCopied && <div>Copied!</div>}
      <pre>{JSON.stringify(parsePastedData(pastedData), null, 2)}</pre>
      <div
        style={{ border: '1px solid #ccc', padding: '10px', minHeight: '100px', maxWidth: '100%', overflowX: 'auto', whiteSpace: 'pre-wrap' }}
        contentEditable={false}
        onPaste={handlePaste}
      >
        {pastedData}
      </div>
    </div>
  );
};

export default ExcelDemo;
