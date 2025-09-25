import express from "express";
import * as Conversation_Controller from "@/controllers/conversation.controller";
const router = express.Router();

router.post("/create", Conversation_Controller.createConversation);
router.get("/detail/:id", Conversation_Controller.getDetailConversation);
router.patch("/update/:id", Conversation_Controller.updateConversation);
router.patch("/update-title/:id", Conversation_Controller.updateTitleConversation);
router.delete("/delete/:id", Conversation_Controller.deleteConversation);
router.post("/check-exist", Conversation_Controller.checkExistConversation);

export default router;
