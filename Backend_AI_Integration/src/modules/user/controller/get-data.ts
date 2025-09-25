import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import { userService } from "@/modules/user/service/user.service";
import { verifyToken, TokenStatus } from "@global/helpers/jwt.auth";
import {
  BadRequestError,
  ServerError,
  NotAuthorizedError,
} from "@global/helpers/error-handler";
import { authCache } from "@service/redis/auth.cache";

export class GetData {
  public async read(
    req: Request<{}, {}, {}, { id: string }>,
    res: Response,
    next: NextFunction
  ) {
    let idUser: string | undefined;

    const { id } = req.query;
    //console.log("id query", id);
    idUser = id;

    const name_cookie = config.COOKIE_NAME_AUTH;
    const token = req.cookies[name_cookie];

    //console.log("token", token);

    if (!idUser && !token) {
      return next(
        new BadRequestError("Get data user failed", "TOKEN_NOT_FOUND")
      );
    }

    type Payload = {
      session_id: string;
      iat: number;
      exp: number;
    };

    const { status, payload } = verifyToken<Payload>(token);

    if (!idUser && status === TokenStatus.TOKEN_INVALID) {
      return next(new BadRequestError("Get data user failed", "TOKEN_INVALID"));
    }

    if (!idUser && status === TokenStatus.TOKEN_EXPIRED) {
      return next(new BadRequestError("Get data user failed", "TOKEN_EXPIRED"));
    }

    if (!idUser && status === TokenStatus.TOKEN_VALID && payload?.session_id) {
      const data = await authCache
        .getUserAuthFromCache(payload?.session_id)
        .catch((error) => {
          return next(
            new ServerError("Error getting user auth from cache", "CACHE_ERROR")
          );
        });
      idUser = data?.id;
    }

    if (!idUser) {
      return new BadRequestError("Get data user failed", "ID_USER_NOT_FOUND");
    }

    //----------------------------------------------------------------

    const data = await userService.getUserById(idUser).catch((error) => {
      return next(
        new ServerError("Error getting user data", "GET_USER_DATA_ERROR")
      );
    });

    if (!data) {
      return next(new BadRequestError("User not found", "USER_NOT_FOUND"));
    }

    if (data) {
      return res.status(200).json({
        message: "Get user data success",
        data: data,
      });
    }

    return next(
      new ServerError("Internal Server Error", "INTERNAL_SERVER_ERROR")
    );
  }
}
