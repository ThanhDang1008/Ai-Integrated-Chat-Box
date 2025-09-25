import { SendMailVerify } from "../controller/sendMailVerify";
import { VerifyRegistrationMail } from "../controller/verifyRegistrationMail";
import { rateLimitSendMail } from "@/shared/middleware/rateLimit";
import express, { Router } from "express";

class MailRoutes {
  private router: Router;
  private routerIndex: Router;

  constructor() {
    this.router = express.Router();
    this.routerIndex = express.Router();
  }

  public index(): Router {
    this.routerIndex.use("/mail", this.routes());
    return this.routerIndex;
  }

  public routes(): Router {
    this.router.post(
      "/send-mail-verify",
      rateLimitSendMail({
        limit: 1,
        time: 60,
      }),
      SendMailVerify.prototype.execute
    );
    this.router.get(
      "/verify-registration-mail",
      VerifyRegistrationMail.prototype.execute
    );
    return this.router;
  }
}

export const mailRoutes: MailRoutes = new MailRoutes();
