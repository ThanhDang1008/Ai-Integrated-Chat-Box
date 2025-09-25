
import { pdfjs } from "react-pdf";
import Tesseract from "tesseract.js";

// Path to the pdf.worker.min.mjs file
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts text from images in a PDF file using OCR and converts it to Markdown format.
 * @param {File | Blob | MediaSource} file - The PDF file to extract text from.
 * @returns {Promise<{markdown: string, numPages: number, error?: string}>} A promise that resolves with the extracted text in Markdown format.
 */
const pdfToMarkdownWithOCR = async (file) => {
  // Create a blob URL for the PDF file
  const blobUrl = URL.createObjectURL(file);

  try {
    // Load the PDF file
    const loadingTask = pdfjs.getDocument(blobUrl);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    let markdownContent = "";

    // Iterate through each page and extract images
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Perform OCR on the canvas image using Vietnamese language
      const { data: { text } } = await Tesseract.recognize(canvas, 'vie', {
        logger: (m) => console.log(m), // Optional: Logs OCR process
      });

      // Convert the extracted text to Markdown
      const pageMarkdown = convertTextToMarkdown(text);
      markdownContent += `\n\n# Page ${pageNumber}\n\n${pageMarkdown}`;
    }

    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);

    return {
      markdown: markdownContent,
      numPages,
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return {
      markdown: "",
      numPages: 0,
      error: error.message,
    };
  }
};

/**
 * Converts plain text to a simple Markdown format.
 * @param {string} text - The text to convert.
 * @returns {string} The converted text in Markdown format.
 */
const convertTextToMarkdown = (text) => {
  // Example conversion: Add simple Markdown formatting like headings, bold, etc.
  // This function can be expanded based on specific needs and text patterns.

  // Convert multiple line breaks to Markdown paragraph breaks
  let markdown = text.replace(/\n{2,}/g, "\n\n");

  // Example: Convert certain patterns to Markdown syntax
  // For example, you could convert all-caps words to headers
  markdown = markdown.replace(/^([A-Z ]{3,})$/gm, "## $1");

  // You could also add more specific rules based on the structure of the extracted text

  return markdown;
};

export default pdfToMarkdownWithOCR;
