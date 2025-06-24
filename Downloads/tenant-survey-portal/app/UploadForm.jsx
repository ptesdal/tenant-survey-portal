'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export default function UploadForm() {
  const [fileName, setFileName] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(' ');
      fullText += strings + '\n';
    }

    setTextContent(fullText);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload a Tenant Survey</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && <p><strong>File:</strong> {fileName}</p>}
      {textContent && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{textContent}</pre>
        </div>
      )}
    </div>
  );
}

