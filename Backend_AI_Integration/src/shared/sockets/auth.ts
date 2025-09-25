import { Server, Socket } from "socket.io";
import { authCache } from "@service/redis/auth.cache";

import { log } from "@/config.app";

export let socketIOAuthObject: Server;

type SessionDestroy = {
  session_id: string;
};

export class SocketIOAuthHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOAuthObject = io;
  }

  public listen(): void {
    this.io.on("connection", (socket: Socket) => {
      socket.on("session_destroy", async (data: SessionDestroy) => {
        // console.log("Session destroy: ", data);
        await authCache
          .deleteUserAuthFromCache(data.session_id)
          .then(() => {
            console.log("Session destroy success: ", data);
            this.io.emit("session_destroy", data);
          })
          .catch((error) => {
            log.error("Error deleting user auth from cache", error);
          });
      });
    });
  }
}
