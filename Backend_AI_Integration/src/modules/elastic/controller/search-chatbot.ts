import { Request, Response, NextFunction } from "express";

import { config } from "@/config.app";
import {
  BadRequestError,
  ServerError,
  NotAuthorizedError,
} from "@global/helpers/error-handler";
import { chatbotElastic } from "@service/elastic/chatbot.es";

export class SearchChatbot {
  public async read(
    req: Request<{}, {}, { value: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { value } = req.body;
   // console.log("value", value);
    if (!value) {
      return next(new BadRequestError("Search chatbot failed", "VALUE_NOT_FOUND"));
    }

    const result = await chatbotElastic.searchChatbot(value).catch((error) => {
      return next(new ServerError("Error searching chatbot", "ELASTIC_ERROR"));
    });

    res.status(200).json({
      message: "Search chatbot success",
      data: result,
    });
  }
}
