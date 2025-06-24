'use client';

import React, { useState } from 'react';
import { parsePdfFile } from './utils/parsePdf';

export default function UploadForm() {
  const [parsedText, setParsedText] = useState('');
  const [filename, setFilename] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFilename(file.name);

    try {
      const text = await parsePdfFile(file);
      setParsedText(text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setParsedText('Failed to parse PDF.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload a Tenant Survey PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {filename && <p><strong>File:</strong> {filename}</p>}
      {parsedText && (
        <div>
          <h3>Parsed Text:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
            {parsedText}
          </pre>
        </div>
      )}
    </div>
  );
}
