import { Server, Socket } from "socket.io";

export let socketIOChatObject: Server;

export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.on("connection", (socket: Socket) => {
      socket.on("join_room", (users: any) => {
        console.log("Người dùng đã tham gia: ", users);
      });

      socket.on("leave_room", (users: any) => {
        console.log("Người dùng đã rời khỏi: ", users);
      });

      interface Message {
        roomID: string;
        message: any;
      }
      socket.on("send_message", (data: Message) => {
        console.log("Dữ liệu tin nhắn: ", data);
        this.io.emit(`receive_message_${data.roomID}`, {
          message: data.message,
        });
      });

      socket.on("disconnect", () => {
        console.log("Người dùng đã rời khỏi room");
      });
    });
  }
}
