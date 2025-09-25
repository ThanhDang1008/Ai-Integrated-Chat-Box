import "dotenv/config";
import bunyan from "bunyan";
import Logger from "bunyan";
import type { Dialect } from "sequelize";

const SERVER_PORT = 5000;
const SERVER_HOST = "localhost";

class Config {
  public PORT: string | undefined;
  public HOST: string | undefined;

  public CLIENT_URL: string | undefined;
  public CLIENT_URL2: string | undefined;
  public CLIENT_URL3: string | undefined;

  public DB_DATABASE: string | undefined;
  public DB_HOST: string | undefined;
  public DB_DIALECT: Dialect | undefined;
  public DB_USERNAME: string | undefined;
  public DB_PASSWORD: string | undefined;
  public DB_PORT: string | undefined;

  public EMAIL_USER: string | undefined;
  public EMAIL_PASS: string | undefined;

  public JWT_KEY_AUTH: string;
  public JWT_EXPIRES_AUTH: string;
  public ACCESS_TOKEN_TIME: string | undefined;
  public REFRESH_TOKEN_TIME: string | undefined;

  public COOKIE_NAME_AUTH: string;
  public COOKIE_EXPIRES_IN: string | number;

  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_KEY: string | undefined;
  public CLOUDINARY_SECRET: string | undefined;

  public REDIS_EXPIRE: string | undefined;
  public REDIS_EXPIRES_AUTH: string | number;
  public REDIS_PORT: string | undefined;
  public REDIS_HOST: string | undefined;
  public REDIS_PASSWORD: string | undefined;

  public ELASTICSEARCH_URL: string

  constructor() {
    this.PORT = process.env.PORT || SERVER_PORT.toString();
    this.HOST = process.env.HOST || SERVER_HOST;

    this.CLIENT_URL = process.env.CLIENT_URL;
    this.CLIENT_URL2 = process.env.CLIENT_URL2;
    this.CLIENT_URL3 = process.env.CLIENT_URL3;

    this.DB_DATABASE = process.env.DB_DATABASE;
    this.DB_HOST = process.env.DB_HOST;
    this.DB_DIALECT = process.env.DB_DIALECT as Dialect;
    this.DB_USERNAME = process.env.DB_USERNAME;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_PORT = process.env.DB_PORT;

    this.EMAIL_USER = process.env.EMAIL_USER;
    this.EMAIL_PASS = process.env.EMAIL_PASS;

    this.JWT_KEY_AUTH = process.env.JWT_KEY_AUTH || "KEY_DEFAULT";
    this.JWT_EXPIRES_AUTH = process.env.JWT_EXPIRES_AUTH || "1d";
    this.ACCESS_TOKEN_TIME = process.env.ACCESS_TOKEN_TIME;
    this.REFRESH_TOKEN_TIME = process.env.REFRESH_TOKEN_TIME;

    this.COOKIE_NAME_AUTH = process.env.COOKIE_NAME_AUTH || "session";
    this.COOKIE_EXPIRES_IN = process.env.COOKIE_EXPIRES_IN || 86400000; // 1 day (miliseconds)

    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
    this.CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
    this.CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

    this.REDIS_EXPIRE = process.env.REDIS_EXPIRE;
    this.REDIS_EXPIRES_AUTH = process.env.REDIS_EXPIRES_AUTH || 86400; // 1 day (seconds)
    this.REDIS_PORT = process.env.REDIS_PORT;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.REDIS_PASSWORD = process.env.REDIS_PASSWORD;

    this.ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || "http://localhost:9200";
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }
}

export const config: Config = new Config();

export const log: Logger = config.createLogger("server");
