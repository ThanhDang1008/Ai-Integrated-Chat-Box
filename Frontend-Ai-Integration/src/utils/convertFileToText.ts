import axios from "axios";
import pdfToText from "./pdfToText";
import mammoth from "mammoth";
import { read, utils } from "xlsx";

export const convertFileToText = async ({
  url,
  typefile,
}: {
  url: string;
  typefile: string;
}) => {
  if (["pdf", "PDF", "application/pdf"].includes(typefile)) {
    const pdf_Text = async () => {
      try {
        const response = await axios.get(url, { responseType: "blob" });
        const file = response.data;
        const data = await pdfToText(file);
        console.log("text pdf: ", data);
        return data.text.trim();
      } catch (error) {
        console.error(`Error fetching or processing file ${typefile}: `, error);
        return "";
      }
    };
    return await pdf_Text();
  }
  if (["txt", "TXT", "text/plain"].includes(typefile)) {
    const txt_text = async () => {
      try {
        const response = await axios.get(url);
        console.log("text txt: ", response.data);
        return response.data.trim();
      } catch (error) {
        console.error(`Error fetching or processingfile ${typefile}: `, error);
        return "";
      }
    };
    return await txt_text();
  }
  if (
    [
      "doc",
      "DOC",
      "docx",
      "DOCX",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(typefile)
  ) {
    const doc_text = async () => {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });
        const result = await mammoth.extractRawText({
          arrayBuffer: response.data,
        });
        console.log("text doc: ", result.value.trim());
        return result.value.trim();
      } catch (error) {
        console.error(`Error fetching or processing file ${typefile}: `, error);
        return "";
      }
    };
    return await doc_text();
  }
  if (
    [
      "xlsx",
      "XLSX",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(typefile)
  ) {
    const xlsx_text = async () => {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });

        const arrayBuffer = response.data;
        const workbook = read(arrayBuffer, { type: "array" });
        let textContent = "";
        //console.log("workbook: ", workbook);

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(sheet, { header: 1 });
          sheetData.forEach((row: any) => {
            textContent += row.join("\t") + "\n";
          });
        });
        console.log("xlsx text: ", textContent.trim());
        return textContent.trim();
      } catch (error) {
        console.error(`Error fetching or processing file ${typefile}: `, error);
        return "";
      }
    };
    return await xlsx_text();
  }
};
