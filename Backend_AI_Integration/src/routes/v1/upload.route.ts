import express from "express";
import * as Upload_Controller from "@/controllers/upload.controller";
import uploadCloud from "@/shared/middleware/cloudinary.config";
const router = express.Router();

router.post(
  "/cloudinary",
  uploadCloud.single("file"),
  Upload_Controller.uploadCloudinary
);


export default router;
