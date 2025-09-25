// import { pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { pdfjs } from "react-pdf";
// Path to the pdf.worker.min.mjs file
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts text content from a PDF file.
 * @param {File | Blob | MediaSource} file - The PDF file to extract text from.
 * @returns {Promise<{text: string,numPages: number}>} A promise that resolves with the extracted text content.
 */
const pdfToText = async (file) => {
  // Create a blob URL for the PDF file
  const blobUrl = URL.createObjectURL(file);

  // Load the PDF file
  const loadingTask = pdfjs.getDocument(blobUrl);

  let extractedText = "";
  let hadParsingError = false;
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  try {
    // Iterate through each page and extract text
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      //console.log("textContent", textContent);
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      extractedText += pageText;
    }
  } catch (error) {
    hadParsingError = true;
    console.error("Error extracting text from PDF:", error);
  }

  // Clean up the blob URL
  URL.revokeObjectURL(blobUrl);

  // Free memory from loading task
  loadingTask.destroy();

  if (!hadParsingError) {
    return {
      text: extractedText,
      numPages,
    };
  }
};

export default pdfToText;
