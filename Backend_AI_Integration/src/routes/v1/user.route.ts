import express from "express";
import * as User_Controller from "@/controllers/user.controller";
import uploadSystem from "@/shared/middleware/multer.config";
const router = express.Router();

router.get("/conversations/:iduser", User_Controller.getConversations);
router.get("/files/:iduser", User_Controller.getFiles);
router.patch(
  "/update/avatar/:iduser",
  uploadSystem.single("file"),
  User_Controller.updateAvatar
);
router.delete("/delete/avatar/:iduser", User_Controller.deleteAvatar);
router.patch("/update/profile/:iduser", User_Controller.updateProfile);

export default router;
