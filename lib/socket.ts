import { io, Socket } from "socket.io-client";
let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io();
    console.log("Connexion WebSocket initialisée");
  }
  return socket;
};
