import { BaseCache } from "./base.cache";
import { config } from "@/config.app";
import { ServerError } from "@global/helpers/error-handler";

import type { IDetailChatbot } from "@/modules/chatbot/interfaces/chatbot.interface";

class ChatbotCache extends BaseCache {
  constructor() {
    super("ChatbotCache");
  }

  public async saveDetailChatbotToCache(
    key: string,
    data: {
      code: number;
      message: string;
      status: string;
      data: IDetailChatbot;
    }
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SET(key, JSON.stringify(data), {
        EX: Number(config.REDIS_EXPIRE),
      });
    } catch (error) {
      throw new ServerError("Error saving user auth to cache", "CACHE_ERROR");
    }
  }

  public async getDetailChatbotFromCache(key: string): Promise<{
    code: number;
    message: string;
    status: string;
    data: IDetailChatbot;
  } | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const data = await this.client.GET(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      throw new ServerError(
        "Error getting user auth from cache",
        "CACHE_ERROR"
      );
    }
  }

  public async deleteDetailChatbotFromCache(key: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.DEL(key);
    } catch (error) {
      throw new ServerError(
        "Error deleting user auth from cache",
        "CACHE_ERROR"
      );
    }
  }
}

export const chatbotCache: ChatbotCache = new ChatbotCache();
