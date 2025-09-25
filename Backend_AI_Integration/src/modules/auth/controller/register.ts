import { Request, Response, NextFunction } from "express";

import { authService } from "@/modules/auth/service/auth.service";
import { authCache } from "@service/redis/auth.cache";
import { config } from "@/config.app";
import { hashPassword } from "../utils/auth.util";
import { avatar_default } from "@/constants/common";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@global/helpers/error-handler";

export class Register {
  public async create(
    req: Request<
      {},
      {},
      {
        fullname: string;
        gender: string;
        email: string;
        password: string;
        type: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { fullname, gender, email, password, type } = req.body;

    const isUserExist = await authService.checkUserExistByEmail(email);

    if (isUserExist) {
      return next(new BadRequestError("User already exist!", "USER_EXIST"));
    }

    const id_user =
      "user-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    const hashedPassword = await hashPassword(password);

    const newUser = await authService.registerUser({
      id: id_user,
      fullname,
      email,
      gender,
      urlavatar: avatar_default,
      type,
      hashPassword: hashedPassword,
    });

    if (newUser) {
      return res.status(201).json({
        message: "Register success",
        status: "REGISTER_SUCCESS",
      });
    }

    return next(
      new ServerError("Error creating new user", "CREATE_USER_ERROR")
    );
  }
}
