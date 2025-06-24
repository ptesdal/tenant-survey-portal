// app/utils/parsePdf.js
import { getDocument } from 'pdfjs-dist/legacy/build/pdf'; // 👈 browser-compatible entry

export async function parsePdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();
  return textContent.items.map(item => item.str).join(' ');
}

