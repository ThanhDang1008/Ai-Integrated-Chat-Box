import { pdfjs } from "react-pdf";

// Path to the pdf.worker.min.mjs file
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfToSingleImgToBlob = async (file) => {
  const blobUrl = URL.createObjectURL(file);
  const loadingTask = pdfjs.getDocument(blobUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // Calculate the total canvas height and maximum width
  let totalHeight = 0;
  let maxWidth = 0;
  const pageCanvases = [];


   const scaleFactor = 1.0; // Higher value for better quality (2.0 chất lượng ảnh tốt hơn)

  for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: scaleFactor });
    totalHeight += viewport.height;
    maxWidth = Math.max(maxWidth, viewport.width);

    // Create a canvas for each page
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    pageCanvases.push(canvas);
  }

  // Create a final canvas with the total height and maximum width
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = maxWidth;
  finalCanvas.height = totalHeight;
  const finalContext = finalCanvas.getContext("2d");

  // Draw each page canvas onto the final canvas
  let yOffset = 0;
  pageCanvases.forEach((canvas) => {
    finalContext.drawImage(canvas, 0, yOffset);
    yOffset += canvas.height;
  });

  // Convert the final canvas to a blob
  const blob = await new Promise((resolve) =>
    finalCanvas.toBlob(resolve, "image/png")
  );

  return blob;
};

export default PdfToSingleImgToBlob;
