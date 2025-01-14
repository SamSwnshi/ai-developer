import http from "http";
import app from "./App.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server);

io.use((socket,next)=>{
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
        
        if(!token){
            return next(new Error("Authentication Error!"))
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return next(new Error("Authentication Error!"))
        }

        socket.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
})

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
