import Redis from "ioredis";


const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        console.log(`Reconnecting attempt #${times}`);
        return Math.min(times * 150, 10000); // Reconnect after increasing intervals
      },
})

redisClient.on('connect',()=>{
    console.log("Redis Connected")
})

export default redisClient;