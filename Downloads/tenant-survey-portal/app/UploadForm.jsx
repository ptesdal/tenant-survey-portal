'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(' ') + '\n\n';
      }

      setStatus('PDF parsed successfully. See console for output.');
      console.log('PDF TEXT:', text);
    };

    fileReader.readAsArrayBuffer(selectedFile);
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
