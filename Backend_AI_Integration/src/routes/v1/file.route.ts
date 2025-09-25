import express from "express";
import * as File_Controller from "@/controllers/file.controller";
import uploadSystem from "@/shared/middleware/multer.config";
const router = express.Router();

router.post(
  "/upload-system",
  uploadSystem.single("file"),
  File_Controller.uploadSystem
);

router.get("/:keyfile", File_Controller.getFile);
router.delete("/delete/:id", File_Controller.deleteFile);
//router.post("/:keyfile", File_Controller.getFile);//upload antd
router.post(
  "/google-cloud-vision",
  uploadSystem.single("file"),
  File_Controller.uploadGoogleCloudVision
);
router.post(
  "/google-cloud-documentai",
  uploadSystem.single("file"),
  File_Controller.uploadGoogleCloudDocumentAI
);

router.post(
  "/convert-pdf-to-markdown",
  uploadSystem.single("file"),
  File_Controller.convertPdfToMarkdown
);

export default router;
