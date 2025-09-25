import express from "express";
import * as MdToFile_Controller from "@/controllers/mdtofile.controller";

const router = express.Router();


router.post("/", MdToFile_Controller.mdToFile);
router.get("/download/:filename", MdToFile_Controller.getFile);


export default router;