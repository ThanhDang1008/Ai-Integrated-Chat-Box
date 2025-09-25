import * as service from "../services/v1/file.service";
import { Request, Response } from "express";

import fs from "fs";
import path from "path";

import pdfParse from "pdf-parse";
import TurndownService from "turndown";

import vision from "@google-cloud/vision";

const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1beta3;

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "../config/cert/Key_Gg_Cloud.json"),
});

const clientDocumentAI = new DocumentProcessorServiceClient({
  keyFilename: path.join(__dirname, "../config/cert/keys_2.json"),
});

const uploadSystem = async (req: Request, res: Response) => {
  const { filename, destination, mimetype, originalname } = req.file as any;
  const { iduser, ocr } = req.body;
  //type ocr string
  //console.log("check ocr", ocr,"type",typeof ocr);
  //console.log("check req.body", iduser);
  console.log("check file", req.file);
  if (req.file === undefined) {
    //console.log("check file", req.file);
    return res.status(400).json({
      code: "400",
      message: "file not found!",
      status: "FAIL_UPLOAD_FILE",
    });
  }
  let pathFile = destination + filename;
  //console.log("check file", req.file);
  try {
    const res_service = await service.uploadSystem({
      filename,
      pathFile,
      mimetype,
      originalname,
      iduser,
      ocr,
    });
    if (res_service.code === 2) {
      return res.status(201).json(res_service.data);
    }
    if (res_service.code === 4) {
      return res.status(400).json(res_service.error);
    }
    if (res_service.code === 5) {
      return res.status(500).json(res_service.error);
    }
  } catch (error) {
    console.log("check error ", error);
  }
};

const getFile = async (req: Request, res: Response) => {
  const { keyfile } = req.params;
  try {
    const res_service = await service.getFile({ keyfile });
    if (res_service.code === 2) {
      return res.sendFile(res_service.path, { root: "./" });
    }
    if (res_service.code === 4) {
      return res.status(400).json(res_service.error);
    }
    if (res_service.code === 5) {
      return res.status(500).json(res_service.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const res_service = await service.deleteFile({ id });
    if (res_service.code === 2) {
      return res.status(200).json(res_service.data);
    }
    if (res_service.code === 4) {
      return res.status(400).json(res_service.error);
    }
    if (res_service.code === 5) {
      return res.status(500).json(res_service.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const uploadGoogleCloudVision = async (req: Request, res: Response) => {
  console.log("check req.file", req.file);
  const { filename, destination, size } = req.file as any;
  const pathFile = destination + filename;

  const isLt20M = size / 1024 / 1024 < 20;
  if (!isLt20M) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res.status(400).json({
      code: "400",
      message: "file size must be less than 20MB",
      status: "FAIL_UPLOAD_FILE",
    });
  }

  try {
    const results = await client.textDetection(pathFile);
    //console.log("Results: ", results);
    const fullTextAnnotation = results[0].fullTextAnnotation;
    const fullText = fullTextAnnotation?.text;
    //console.log(`Full text: ${fullTextAnnotation.text}`);
    if (fullText) {
      fs.unlink(pathFile, (err: any) => {
        if (err) {
          return console.log(`delete file ${pathFile} fail!`, err);
        }
        return console.log(`delete file ${pathFile} success!`);
      });

      return res.status(200).json({
        fullText: fullText,
        html: `<div>${fullText.replace(/\n/g, "<br>")}</div>`,
      });
    }
    if (!fullText) {
      return res
        .status(400)
        .json({ message: "not found text", status: "NOT_FOUND_TEXT" });
    }
  } catch (error: any) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res
      .status(400)
      .json({ message: error.message, status: "FAIL_GOOGLE_CLOUD_VISION" });
  }
};

const uploadGoogleCloudDocumentAI = async (req: Request, res: Response) => {
  //Supports JPEG, JPG, PNG, BMP, PDF, TIFF, TIF, GIF (15 pages, 20MB max)
  console.log("check req.file", req.file);

  const { filename, destination, size, mimetype } = req.file as any;
  const pathFile = destination + filename;

  const projectId = "610640503604";
  const location = "us";
  const processorId = "aa54a2eb15da766c";

  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const isLt20M = size / 1024 / 1024 < 20;
  if (!isLt20M) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res.status(400).json({
      code: "400",
      message: "file size must be less than 20MB",
      status: "FAIL_UPLOAD_FILE",
    });
  }

  const typeFileSupport = {
    "application/pdf": true,
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/bmp": true,
    "image/tiff": true,
    "image/tif": true,
    "image/gif": true,
  } as any;

  if (!typeFileSupport[mimetype]) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res.status(400).json({
      code: "400",
      message: "file type not support",
      status: "FAIL_UPLOAD_FILE",
    });
  }

  const readFile = fs.readFileSync(pathFile);
  const encodedFile = Buffer.from(readFile).toString("base64");

  try {
    const [result] = await clientDocumentAI.processDocument({
      name,
      inlineDocument: {
        content: encodedFile,
        mimeType: mimetype,
      },
    });
    const { document } = result;
    let fullText = document.text;

    if (fullText) {
      fs.unlink(pathFile, (err: any) => {
        if (err) {
          return console.log(`delete file ${pathFile} fail!`, err);
        }
        return console.log(`delete file ${pathFile} success!`);
      });

      return res.status(200).json({
        text: fullText,
        html: `<div>${fullText.replace(/\n/g, "<br>")}</div>`,
      });
    }
    if (!fullText) {
      return res
        .status(400)
        .json({ message: "not found text", status: "NOT_FOUND_TEXT" });
    }
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      status: "FAIL_GOOGLE_CLOUD_DOCUMENT_AI",
    });
  }
};

const convertPdfToMarkdown = async (req: Request, res: Response) => {
  const { filename, destination, size, mimetype } = req.file as any;
  const pathFile = destination + filename;

  const isLt50M = size / 1024 / 1024 < 50;
  if (!isLt50M) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res.status(400).json({
      code: "400",
      message: "file size must be less than 50MB",
      status: "FAIL_UPLOAD_FILE",
    });
  }

  const typeFileSupport = {
    "application/pdf": true,
  } as any;

  if (!typeFileSupport[mimetype]) {
    fs.unlink(pathFile, (err: any) => {
      if (err) {
        return console.log(`delete file ${pathFile} fail!`, err);
      }
      return console.log(`delete file ${pathFile} success!`);
    });
    return res.status(400).json({
      code: "400",
      message: "file type not support",
      status: "FAIL_UPLOAD_FILE",
    });
  }

  try {
    const dataBuffer = fs.readFileSync(pathFile);
    pdfParse(dataBuffer).then((data: any) => {
      let text_replace = data.text.replace(/\n/g, "<br>");
      const htmlContent = `
      <html>
          <body>
              <div>
                  <p>${text_replace}</p>
              </div>
          </body>
      </html>
  `;
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(htmlContent);

      fs.unlink(pathFile, (err: any) => {
        if (err) {
          return console.log(`delete file ${pathFile} fail!`, err);
        }
        return console.log(`delete file ${pathFile} success!`);
      });
      return res.status(200).json({
        markdown: markdown,
        html: `<div>${text_replace}</div>`,
      });
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      status: "FAIL_CONVERT_PDF_TO_MARKDOWN",
    });
  }
};

export {
  uploadSystem,
  getFile,
  deleteFile,
  uploadGoogleCloudVision,
  uploadGoogleCloudDocumentAI,
  convertPdfToMarkdown,
};
