'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      alert(`File "${file.name}" selected. Ready for parsing in next step.`);
      // You’ll add actual file handling later
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2 font-medium">Upload Excel or PDF:</label>
      <input type="file" accept=".xlsx,.xls,.pdf" onChange={handleFileChange} className="mb-4" />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Upload
      </button>
    </form>
  );
}
