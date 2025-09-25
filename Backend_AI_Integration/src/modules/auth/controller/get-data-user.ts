import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import { verifyToken, TokenStatus } from "@global/helpers/jwt.auth";
import { authCache } from "@service/redis/auth.cache";
import { NotAuthorizedError, ServerError } from "@global/helpers/error-handler";

export class GetDataUser {
  public async read(req: Request, res: Response, next: NextFunction) {
    const name_cookie = config.COOKIE_NAME_AUTH;
    const token = req.cookies[name_cookie];

    if (!token) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
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
          "You are not authorized to access this resource",
          "TOKEN_INVALID"
        )
      );
    }

    if (status === TokenStatus.TOKEN_EXPIRED) {
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "TOKEN_EXPIRED"
        )
      );
    }

    if (status === TokenStatus.TOKEN_VALID && payload?.session_id) {
      const data = await authCache
        .getUserAuthFromCache(payload?.session_id)
        .catch((error) => {
          return next(
            new ServerError("Error getting user auth from cache", "CACHE_ERROR")
          );
        });

      if (data) {
        return res.status(200).json(data);
      }
      return next(
        new NotAuthorizedError(
          "You are not authorized to access this resource",
          "TOKEN_VALID"
        )
      );
    }
  }
}
