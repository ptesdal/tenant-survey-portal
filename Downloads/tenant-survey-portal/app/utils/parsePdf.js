import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/webpack';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function parsePdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(' ');
    fullText += strings + '\n';
  }

  return fullText;
}
