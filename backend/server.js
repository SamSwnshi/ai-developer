import http from "http";
import app from "./App.js"
import dotenv from "dotenv";

dotenv.config()

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on PORT:${port} `)
})