import express, { Application, Response, Request, NextFunction } from "express";
import http from "http";//hoặc import { createServer } from "http"___const httpServer = createServer();
import Logger from "bunyan";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
// import { createAdapter } from '@socket.io/redis-adapter';//chưa tải

import { config } from "./config.app";
import applicationRoutes from "./routes.app";
import configCors from "@/config/cors";
import {
  CustomError,
  IErrorResponse,
} from "@/shared/globals/helpers/error-handler";
import { SocketIOChatHandler } from "@socket/chat";
import {SocketIOAuthHandler} from "@socket/auth";

const log: Logger = config.createLogger("server");

export class RunServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(configCors);
    app.use(cookieParser());
  }

  private standardMiddleware(app: Application): void {
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res.status(404).json({
        message: `method:${req.method}, path:${req.originalUrl} not found!`,
        status: "NOT_FOUND_ENDPOINT",
      });
    });

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        //log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);

      this.socketIOConnections(socketIO);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL2,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
    });
    //https://socket.io/docs/v4/redis-adapter
    //const pubClient = createClient({ url: config.REDIS_HOST });
    //const subClient = pubClient.duplicate();
    // await Promise.all([pubClient.connect(), subClient.connect()]);
    // io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    // log.info(`Worker with process id of ${process.pid} has started...`);
    // log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(config.PORT, () => {
      // log.info(`Server running on port ${config.PORT}`);
      console.log(
        "\x1b[35m%s\x1b[0m",
        `Server is running on`,
        `http://${config.HOST}:${config.PORT}`
      );
      console.log(
        "\x1b[35m%s\x1b[0m",
        `Server socket is running on`,
        `http://${config.HOST}:${config.PORT}`
      );
    });
  }

  private socketIOConnections(io: Server): void {
    const chatSocketHandler: SocketIOChatHandler = new SocketIOChatHandler(io);
    const authSocketHandler: SocketIOAuthHandler = new SocketIOAuthHandler(io);

    chatSocketHandler.listen();
    authSocketHandler.listen();
  }
}
