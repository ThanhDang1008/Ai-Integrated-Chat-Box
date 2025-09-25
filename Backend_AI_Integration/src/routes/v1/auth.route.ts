import express from "express";
import * as Auth_Controller from "@/controllers/auth.controller";

const router = express.Router();

router.post("/register", Auth_Controller.register);
router.post("/login", Auth_Controller.login);
router.get('/account', Auth_Controller.account)

export default router;
