import { mdToPdf } from "md-to-pdf";
import fs from "fs";
import path from "path";

const md_To_Pdf = async (markdown) => {
  const pdf = await mdToPdf(
    {
        content: markdown,
    },
    {
      document_title: "Conversation messages",
      pdf_options: {
        format: "A4",
        margin: "15mm",
        headerTemplate: `
              <style>
        section {
          margin: 0 auto;
          font-family: system-ui;
          font-size: 11px;
        }
          .title {
              font-weight: bold;
              color: #333;
          }
          .date {
              color: #333;
          }
      </style>
      <section>
        <span class="title"></span>
        <span class="date"></span>
      </section>
            `,
        footerTemplate: `
              <style>
          section {
              margin: 0 auto;
              font-family: system-ui;
              font-size: 11px;
          }
          .pageNumber {
              color: #333;
          }
          .totalPages {
              color: #333;
          }
      </style>
             <section>
        <div>
          Page <span class="pageNumber"></span>
          of <span class="totalPages"></span>
        </div>
      </section>
            `,
      },
    }
  ).catch((error) => {
    console.log("error mdToPdf: ", error);
  });
  //console.log("check pdf ", pdf);
  const fileName = `conversation-messages-${Date.now()}.pdf`;
  //const filePath = path.join(__dirname, `../../public/downloads/${fileName}`);
  const filePath = "./src/public/downloads/" + fileName;
  //console.log("check filePath ", filePath);
  fs.writeFileSync(filePath, pdf.content);
  return fileName;
};

export default md_To_Pdf;
