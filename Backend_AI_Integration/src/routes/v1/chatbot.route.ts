import express from "express";
import Chatbot_Controller from "@/controllers/chatbot.controller";

const router = express.Router();

router.post("/create", Chatbot_Controller.createChatbot);
router.get("/detail/:id", Chatbot_Controller.getDetailChatbot);
router.get("/", Chatbot_Controller.getAllChatbot);
router.patch("/update/:id", Chatbot_Controller.updateChatbot);
router.delete("/delete-files/:id", Chatbot_Controller.deleteFilesChatbot);
router.delete("/delete/:id", Chatbot_Controller.deleteChatbot);


export default router;