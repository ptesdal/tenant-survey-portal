'use client';

import { useState } from 'react';
import { parsePdfFile } from './utils/parsePdf';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [parsedText, setParsedText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    setParsedText('');
    setError('');
  };

  const handleParse = async () => {
    if (!file) return;

    try {
      const text = await parsePdfFile(file);
      setParsedText(text);
    } catch (err) {
      console.error(err);
      setError('Failed to parse PDF.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Tenant Survey Upload</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleParse} disabled={!file} style={{ marginLeft: '1rem' }}>
        Parse PDF
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {parsedText && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <h3>Parsed Output:</h3>
          <p>{parsedText}</p>
        </div>
      )}
    </div>
  );
}

