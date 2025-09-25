import { middlewareCache } from "@service/redis/middleware.cache";
import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  ServerError,
  TooManyRequestError,
} from "@global/helpers/error-handler";

type RateLimit = {
  key: string;
  limit: number;
  time: number;
};

export const rateLimit = ({ key, limit, time }: RateLimit) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const checkKeyRateLimit = await middlewareCache.getRateLimitFromCache(key);
    if (checkKeyRateLimit === null) {
      await middlewareCache.setRateLimitToCache(key, limit, time);
      return next();
    } else if (checkKeyRateLimit === true) {
      next();
    } else if (checkKeyRateLimit === false) {
      return next(
        new TooManyRequestError("Too many request", "TOO_MANY_REQUEST")
      );
    }
  };
};

export const rateLimitSendMail = ({
  limit,
  time,
}: {
  limit: number;
  time: number;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email_user } = req.body;
    if (!email_user) {
      return next(new BadRequestError("Email is required", "EMAIL_REQUIRED"));
    }

    const checkKeyRateLimit = await middlewareCache.getRateLimitFromCache(
      `send-mail-` + email_user
    );
    if (checkKeyRateLimit === null) {
      await middlewareCache.setRateLimitToCache(
        `send-mail-` + email_user,
        limit - 1,
        time
      );
      return next();
    } else if (checkKeyRateLimit === true) {
      next();
    } else if (checkKeyRateLimit === false) {
      return next(
        new TooManyRequestError("Too many request", "TOO_MANY_REQUEST")
      );
    }
  };
};
