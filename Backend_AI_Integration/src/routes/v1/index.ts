import express from "express";
import Role_Routes from "./role.route";
import Email_Routes from "./email.route";
import Upload_Routes from "./upload.route";
import Conversation_Routes from "./conversation.route";
import Auth_Routes from "./auth.route";
import File_Routes from "./file.route";
import User_Routes from "./user.route";
import MdToFile_Routes from "./mdToFile.route";
import Chatbot_Routes from "./chatbot.route";
const router = express.Router();

router.use("/role", Role_Routes);
router.use("/email", Email_Routes);
router.use("/upload", Upload_Routes);
router.use("/conversation", Conversation_Routes);
router.use("/auth", Auth_Routes);
router.use("/file", File_Routes);
router.use("/user", User_Routes);
router.use("/mdToFile", MdToFile_Routes);
router.use("/chatbot", Chatbot_Routes);

export default router;
