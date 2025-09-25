import { Request, Response, NextFunction } from "express";

import { authService } from "@/modules/auth/service/auth.service";
import { authCache } from "@service/redis/auth.cache";
import { config } from "@/config.app";
import { comparePassword } from "../utils/auth.util";
import { generateToken } from "@global/helpers/jwt.auth";
import { statusAccount } from "@/constants/common";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
} from "@global/helpers/error-handler";

export class SignIn {
  public async read(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const existingUser = await authService.getAuthUserByUsername(username);

    if (existingUser.length === 0) {
      return next(
        new BadRequestError(
          "Username or password incorrect!",
          "USERNAME_INCORRECT"
        )
      );
    }

    const passwordsMatch: boolean = await comparePassword(
      password,
      existingUser[0].password
    );

    if (!passwordsMatch) {
      return next(
        new BadRequestError(
          "Username or password incorrect!",
          "PASSWORD_INCORRECT"
        )
      );
    }

    if (passwordsMatch && existingUser[0].status === statusAccount.UNVERIFIED) {
      // return next(
      //   new NotAuthorizedError(
      //     "Account is not verified!",
      //     "ACCOUNT_NOT_VERIFIED",
      //     { fullname: existingUser[0].fullname, email: existingUser[0].email }
      //   ));
      return res.status(401).json({
        message: "Account is not verified!",
        status: "ACCOUNT_NOT_VERIFIED",
        data: {
          fullname: existingUser[0].fullname,
          email: existingUser[0].email,
        },
      });
    }

    if (
      passwordsMatch &&
      existingUser[0].id &&
      existingUser[0].status === "verified"
    ) {
      const { password, status, ...data_session_without_password_status } =
        existingUser[0];

      //session id
      const session_id =
        "session-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
      const data_session = {
        ...data_session_without_password_status,
        session_id: session_id,
      };

      //generate token
      const payload = { session_id: session_id };
      const token = generateToken(payload, config.JWT_EXPIRES_AUTH);

      //set cookie
      const name_cookie = config.COOKIE_NAME_AUTH;
      res.cookie(name_cookie, token, {
        httpOnly: true,
        maxAge: Number(config.COOKIE_EXPIRES_IN), //đơn vị là ms
      });

      //save user auth to cache
      await authCache
        .saveUserAuthToCache(session_id, data_session)
        .catch((error) => {
          return next(
            new ServerError("Internal Server Error", "INTERNAL_SERVER_ERROR")
          );
        });

      return res.status(200).json({
        message: "Login success!",
        data: data_session,
        token: token,
      });
    }

    return next(
      new ServerError("Internal Server Error", "INTERNAL_SERVER_ERROR")
    );
  }
}
