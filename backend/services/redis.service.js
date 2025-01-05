import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config()

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
console.log(
  process.env.REDIS_HOST,
  process.env.REDIS_PORT,
  process.env.REDIS_PASSWORD
);

redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;
