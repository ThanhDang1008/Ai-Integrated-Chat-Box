import express, { Express } from "express";
import Logger from "bunyan";

import { config } from "./config.app";
import initializeDirectory from "@/config/initDirectory";
import { RunServer } from "./setupServer";
import {connectionToDatabase} from "./setupDatabase";

const log: Logger = config.createLogger("app");

class Application {
  public initialize(): void {
    initializeDirectory();
    connectionToDatabase.db();
    connectionToDatabase.redis();
    //connectionToDatabase.elasticSearch();
    //-----------------------------
    const app: Express = express();
    const server: RunServer = new RunServer(app);
    server.start();
    //Application.handleExit();
  }

  private static handleExit(): void {
    process.on("uncaughtException", (error: Error) => {
      log.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on("unhandleRejection", (reason: Error) => {
      log.error(`Unhandled rejection at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      log.error("Caught SIGTERM");
      Application.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      log.error("Caught SIGINT");
      Application.shutDownProperly(2);
    });

    process.on("exit", () => {
      log.error("Exiting");
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info("Shutdown complete");
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
