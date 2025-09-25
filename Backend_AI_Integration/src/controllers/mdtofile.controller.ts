import path from "path";
import md_To_Docx from "../shared/utils/markdown/convertToDocx";
import md_To_Pdf from "../shared/utils/markdown/convertToPdf";
import md_To_Txt from "../shared/utils/markdown/convertToTxt";

import { Request, Response } from "express";

const mdToFile = async (req:Request, res:Response) => {
  const { markdown, typefile } = req.body;
  //console.log("check content ", content);
  try {
    let fileName = "";
    if (typefile === "pdf") {
      fileName = await md_To_Pdf(markdown);
    }
    if (typefile === "docx") {
      fileName = await md_To_Docx(markdown);
    }
    if (typefile === "txt") {
      fileName = md_To_Txt(markdown);
    }

    if (!fileName) {
      res.status(400).json({
        code: "400",
        message: "convert fail! Please check your markdown",
        status: "CONVERT_FAIL",
      });
    }

    res.status(200).json({
      code: "200",
      message: "convert success!",
      status: "CONVERT_SUCCESS",
      data: {
        filename: `${fileName}`,
      },
    });
  } catch (error) {
    console.log("check error ", error);
    res.status(500).json({
      code: 5,
      error: {
        code: "500",
        message: `server error: ${error}`,
        status: "SERVER_ERROR",
      },
    });
  }
};

const getFile = (req:Request, res:Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, `../public/downloads/${filename}`);
  res.download(filePath, (error) => {
    if (error) {
      res.status(500).json({
        code: 5,
        error: {
          code: "500",
          message: `server error: ${error}`,
          status: "SERVER_ERROR",
        },
      });
    }
  });
};

export { mdToFile, getFile };
