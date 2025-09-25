import { createClient } from "redis";
import Logger from 'bunyan';
import { config } from "@/config.app";

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.client = createClient({
      password: config.REDIS_PASSWORD,
      socket: {
        host: config.REDIS_HOST,
        port: Number(config.REDIS_PORT),
      },
    });
    this.log = config.createLogger(cacheName);
    this.cacheError();
  }

  private cacheError(): void {
    this.client.on("error", (error: unknown) => {
      this.log.error("----Redis Error----", error);
      console.log("___Redis Error: ", error);
    });
  }
}
