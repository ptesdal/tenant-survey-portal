'use client';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function UploadForm() {
  const [fileName, setFileName] = useState('');
  const [textContent, setTextContent] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).join(' ');
        fullText += strings + '\n\n';
      }

      setTextContent(fullText);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Upload a PDF</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {fileName && (
        <div className="mt-4">
          <h3 className="font-semibold">File: {fileName}</h3>
          <pre className="mt-2 whitespace-pre-wrap">{textContent}</pre>
        </div>
      )}
    </div>
  );
}
