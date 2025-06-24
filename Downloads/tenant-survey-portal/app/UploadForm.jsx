'use client';

import { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

GlobalWorkerOptions.workerSrc = workerSrc;

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setStatus(`File "${file.name}" selected. Ready for parsing.`);
  };

  const handleParse = async () => {
    if (!selectedFile) {
      setStatus('Please select a PDF file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await getDocument({ data: typedArray }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        fullText += strings.join(' ') + '\n\n';
      }

      console.log('Parsed PDF text:', fullText);
      setStatus('Parsing complete. Check console for results.');
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload a Tenant Survey PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleParse} style={{ marginLeft: '1rem' }}>
        Parse PDF
      </button>
      <p>{status}</p>
    </div>
  );
}


