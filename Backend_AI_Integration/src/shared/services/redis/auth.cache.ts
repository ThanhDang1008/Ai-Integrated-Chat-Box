import { BaseCache } from "./base.cache";
import { config } from "@/config.app";
import { ServerError } from "@global/helpers/error-handler";

import type { ISessionUser } from "@/modules/auth/interfaces/auth.interface";

class AuthCache extends BaseCache {
  constructor() {
    super("AuthCache");
  }

  public async saveUserAuthToCache(
    id: string,
    session: Omit<ISessionUser, "password" | "status">
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SET(id, JSON.stringify(session), {
        EX: Number(config.REDIS_EXPIRES_AUTH),
      });
    } catch (error) {
      throw new ServerError("Error saving user auth to cache", "CACHE_ERROR");
    }
  }

  //omit status and password
  public async getUserAuthFromCache(
    id: string
  ): Promise<Omit<ISessionUser, "password" | "status"> | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const user = await this.client.GET(id);
      if (user) {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      throw new ServerError(
        "Error getting user auth from cache",
        "CACHE_ERROR"
      );
    }
  }

  public async deleteUserAuthFromCache(id: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.DEL(id);
    } catch (error) {
      throw new ServerError(
        "Error deleting user auth from cache",
        "CACHE_ERROR"
      );
    }
  }

  public async deleteSessionUserFromCache(id: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.DEL(id);
    } catch (error) {
      throw new ServerError(
        "Error deleting session user from cache",
        "CACHE_ERROR"
      );
    }
  }
}

export const authCache: AuthCache = new AuthCache();
