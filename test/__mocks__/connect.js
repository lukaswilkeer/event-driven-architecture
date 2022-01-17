import socketClient from "socket.io-client";
import { userToken } from "./tokens";

export const socketConnect = (userToken = null) => socketClient("http://localhost:3000", {
  path: "/",
  transports: ["pooling", "websocket"],
  extraHeaders: {
    authorization: userToken
  }
});