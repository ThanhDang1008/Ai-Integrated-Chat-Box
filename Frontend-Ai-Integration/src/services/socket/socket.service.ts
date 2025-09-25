import { io, Socket } from "socket.io-client";
import { baseURL } from "@/services/api/axios";

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(baseURL);
  }

  public getSocket() {
    return this.socket;
  }

  public connect() {
    this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  socketConnectionEvents() {
    this.socket.on("connect", () => {
      console.log("connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect();
    });

    this.socket.on("connect_error", (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect();
    });
  }
}

export const socketService = new SocketService();
