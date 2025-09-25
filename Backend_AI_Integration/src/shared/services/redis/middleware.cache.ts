import { BaseCache } from "./base.cache";
import { config } from "@/config.app";
import { ServerError } from "@global/helpers/error-handler";

class MiddlewareCache extends BaseCache {
  constructor() {
    super("MiddlewareCache");
  }

  public async setRateLimitToCache(
    key: string,
    limit: number,
    time: number //seconds
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SET(key, limit, {
        EX: Number(time),
      });
    } catch (error) {
      throw new ServerError("Error saving rate limit to cache", "CACHE_ERROR");
    }
  }

  public async getRateLimitFromCache(key: string): Promise<boolean | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const data_limit = await this.client.GET(key);
     // console.log("data_limit: ", data_limit);

      if (data_limit) {
        const limit = Number(data_limit);
        const ttl = await this.client.ttl(key);
        //console.log("ttl: ", ttl);
        //TTL The command returns -2 if the key does not exist.
        //TTL The command returns -1 if the key exists but has no associated expire.
        //console.log("limit: ", limit);
        if (!isNaN(limit) && limit > 0) {
          await this.client.SET(key, limit - 1, {
            EX: ttl,
          });
          return true;
        } else if (!isNaN(limit) && limit === 0) {
          return false;
        }
      }
      return null;
    } catch (error) {
      throw new ServerError(
        "Error getting rate limit from cache",
        "CACHE_ERROR"
      );
    }
  }
}

export const middlewareCache: MiddlewareCache = new MiddlewareCache();
