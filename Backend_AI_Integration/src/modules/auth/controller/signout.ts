import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import { authCache } from "@service/redis/auth.cache";
import { ServerError,NotAuthorizedError } from "@global/helpers/error-handler";
import { verifyToken, TokenStatus } from "@global/helpers/jwt.auth";

export class SignOut {
  public async update(req: Request, res: Response, next: NextFunction) {
    const name_cookie = config.COOKIE_NAME_AUTH;
    const token = req.cookies[name_cookie];

    if (!token) {
      return next(
        new NotAuthorizedError(
          "Signout failed",
          "TOKEN_NOT_FOUND"
        )
      );
    }

    type Payload = {
      session_id: string;
      iat: number;
      exp: number;
    };

    const { status, payload } = verifyToken<Payload>(token);

    if (status === TokenStatus.TOKEN_INVALID) {
      return next(
        new NotAuthorizedError(
          "Signout failed",
          "TOKEN_INVALID"
        )
      );
    }

    if (status === TokenStatus.TOKEN_EXPIRED) {
      return next(
        new NotAuthorizedError(
          "Signout failed",
          "TOKEN_EXPIRED"
        )
      );
    }

    if (status === TokenStatus.TOKEN_VALID && payload?.session_id) {
      await authCache.deleteSessionUserFromCache(payload.session_id).catch((error) => {
        return next(
          new ServerError("Error deleting session user from cache", "CACHE_ERROR")
        );
      });

      res.clearCookie(name_cookie);
      return res.status(200).json({
        message: "Signout success",
        status: "SIGNOUT_SUCCESS",
      });
    }
  }
}
