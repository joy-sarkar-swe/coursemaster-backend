import redisClient from "../config/redis";

export const cache = (duration: number = 300) => {
  return async (req: any, res: any, next: any) => {
    if (!redisClient.isOpen) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (res.statusCode === 200) {
          redisClient
            .setEx(key, duration, JSON.stringify(body))
            .catch(console.error);
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

export const clearCache = async (pattern: string) => {
  if (!redisClient.isOpen) {
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
