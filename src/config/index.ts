import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/coursemaster",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@coursemaster.com",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@coursemaster.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
  },
};
