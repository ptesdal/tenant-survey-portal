'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setMessage(`File "${file.name}" selected. Parsing...`);

    try {
      // 🔁 Lazy load pdfjs-dist *in the browser only*
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');

      const reader = new FileReader();
      reader.onload = async function () {
        const typedarray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();

        const rawText = textContent.items.map((item) => item.str).join(' ');
        setMessage(`Parsed text: ${rawText.slice(0, 200)}...`);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setMessage('Error parsing PDF. Please try a different file.');
    }
  };

  return (
    <div>
      <h2>Upload a PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {message && <p>{message}</p>}
    </div>
  );
}
