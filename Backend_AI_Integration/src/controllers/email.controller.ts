import * as service from "../services/v1/email.service";
import { verifyToken } from "../shared/utils/jwt";

import { Request, Response } from "express";

const sendEmail = async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    const data = await service.sendEmail(req.body);
    if (data.code === 2) {
      return res.status(200).json(data.data);
    }
    if (data.code === 4) {
      return res.status(400).json(data.error);
    }
  } catch (error) {
    console.error("controller: ", error);
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({
      code: "400",
      message: "Email verification failed",
      status: "TOKEN_NOT_FOUND",
    });
  }
  const { status, payload } = verifyToken(token as string);
  //const { status, ...obj } = data;
  //console.log("check data", data);
  if (status === "TOKEN_VALID" && payload?.isVerify === true) {
    try {
      const res_service = await service.verifyEmail({
        email_verify: payload.email,
      });
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
  } else if (status === "TOKEN_EXPIRED") {
    return res.status(400).json({
      code: "400",
      message: "Email verification failed",
      status: "TOKEN_EXPIRED",
    });
  } else if (status === "TOKEN_INVALID") {
    return res.status(400).json({
      code: "400",
      message: "Email verification failed",
      status: "TOKEN_INVALID",
    });
  }
};

export { sendEmail, verifyEmail };
