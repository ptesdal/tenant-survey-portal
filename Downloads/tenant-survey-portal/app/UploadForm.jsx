'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

export default function UploadForm() {
  const [fileName, setFileName] = useState('');
  const [parsedText, setParsedText] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map(item => item.str).join(' ');
          fullText += `\n\nPage ${i}:\n${text}`;
        }

        setParsedText(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Only PDF files are supported for now.');
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && <p>Selected file: <strong>{fileName}</strong></p>}
      {parsedText && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          <h3>Parsed PDF Text:</h3>
          <p>{parsedText}</p>
        </div>
      )}
    </div>
  );
}

