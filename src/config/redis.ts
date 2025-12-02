import { createClient } from "redis";
import { config } from "./index";

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Connected"));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("⚠️ Redis connection failed. Caching disabled.");
  }
};

export default redisClient;
