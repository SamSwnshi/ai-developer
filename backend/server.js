import http from "http";
import app from "./App.js";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a new connection");
  client.on("event", (data) => {
    /* … */
  });
  client.on("disconnect", () => {
    /* … */
  });
});

server.listen(port, () => {
  console.log(`Server is running on PORT:${port} `);
});
