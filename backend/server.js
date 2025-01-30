import http from "http";
import app from "./App.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.models.js";
import { generateResult } from "./services/ai.service.js";

dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project Id"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      return next(new Error("Authentication Error!"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication Error!"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  console.log("a user connected");

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if (aiIsPresentInMessage) {
      try {
        const prompt = message.replace("@ai", "");
        const result = await generateResult(prompt); // API Call

        io.to(socket.roomId).emit("project-message", {
          message: result,
          sender: {
            _id: "ai",
            email: "AI",
          },
        });
      } catch (error) {
        console.error("AI Service Error:", error.message);

        io.to(socket.roomId).emit("project-message", {
          message: "AI is currently unavailable. Please try again later.",
          sender: {
            _id: "ai",
            email: "AI",
          },
        });
      }
    }
    if (aiIsPresentInMessage) {
      try {
        const prompt = message.replace("@ai", "");
        const result = await generateResult(prompt); // API Call

        io.to(socket.roomId).emit("project-message", {
          message: result,
          sender: {
            _id: "ai",
            email: "AI",
          },
        });
      } catch (error) {
        console.error("AI Service Error:", error.message);

        io.to(socket.roomId).emit("project-message", {
          message: "AI is currently unavailable. Please try again later.",
          sender: {
            _id: "ai",
            email: "AI",
          },
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is running on PORT:${port} `);
});
