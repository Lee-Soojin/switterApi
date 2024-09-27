import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { config } from "../config.js";

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          config.cors.allowedOrigin,
          "http://localhost:3000",
          "https://s-witter.netlify.app",
        ],
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication Error"));
      }

      jwt.verify(token, config.jwt.secretKey, (error) => {
        if (error) {
          return next(new Error("Authentication Error"));
        }
        next();
      });
    });

    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}

let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

export function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  return socket.io;
}
