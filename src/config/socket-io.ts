import { Server, Socket as SocketIO } from "socket.io";
import http from "http";

class Socket {
  private io: Server;
  private connectedClients: Record<string, string>;

  constructor(server: http.Server) {
    const io = new Server(server, {});
    this.io = io;
    this.connectedClients = {};

    io.on("connection", (socket: SocketIO) => {
      const userId = socket.handshake.query.userId as string;
      this.connectedClients[userId] = socket.id;
      console.log(this.connectedClients);
      socket.on("disconnect", () => {
        console.log(`user ${this.connectedClients[userId]} disconnected`);
        delete this.connectedClients[userId];
        console.log(this.connectedClients);
      });
    });
  }

  public generateNotification(
    userId: string,
    message: string
  ): boolean | Error {
    try {
      this.io.to(this.connectedClients[userId]).emit("notification", message);
      return true;
    } catch (error) {
      return error as Error;
    }
  }
}

export default Socket;
