import { Document, Page } from "react-pdf";
import React, { useState, useRef } from "react";
import "./pdf_preview.scss";

//"${import.meta.env.VITE_BACKEND_URL}/api/v1/file/file-1720719339607-369946787.pdf"
/**
 * @param {Object} props - The component props.
 * @param {string | ArrayBuffer | Blob | Source | null} props.file - The file to be rendered as a PDF preview.
 */
function PdfPreview(props) {
  const { file, width } = props;
  const [numPages, setNumPages] = useState(null);
  const pagesRef = useRef([]);
  const [movePage, setMovePage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleScrollToPage = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    if (movePage > 0 && movePage <= numPages) {
      pagesRef.current[movePage - 1].scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <div
        style={{
          width: width ? width : "100%",
        }}
      >
        <input
          type="number"
          value={movePage}
          onChange={(e) => {
            setMovePage(e.target.value);
          }}
          placeholder="Go to page"
          min={1}
          max={numPages}
        />
        <button onClick={(e) => handleScrollToPage(e)}>Go</button>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <div
            style={{
              height: "500px",
              overflowY: "scroll",
              padding: "3%",
              backgroundColor: "rgb(87 87 87)",
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <>
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.8}
                  width={250}
                  canvasRef={(ref) => {
                    pagesRef.current.push(ref);
                  }}
                />
                <div
                  style={{
                    color: "darkgrey",
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "0.8rem",
                  }}
                >
                  Page {index + 1} of {numPages}
                </div>
              </>
            ))}
          </div>
        </Document>
      </div>
    </>
  );
}

export default PdfPreview;
