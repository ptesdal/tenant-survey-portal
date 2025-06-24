import { getDocument } from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

export async function parsePdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = getDocument({ data: arrayBuffer, worker: pdfjsWorker });
  const pdf = await loadingTask.promise;

  const maxPages = pdf.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}
