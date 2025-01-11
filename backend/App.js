import express from "express";
import morgan from "morgan";
import connect from "./db/db.config.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js"

dotenv.config()

connect();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users',userRoutes)
app.use('/projects',projectRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
