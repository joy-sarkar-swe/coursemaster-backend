import cors from "cors";
import express, { Application, Request, Response } from "express";
import { config } from "./config";
import { connectDB } from "./config/database";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "CourseMaster API",
    version: "1.0.0",
  });
});

app.use("/api", routes);

// Error Handler (must be last)
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Connect to Redis (optional, won't crash if it fails)
    await connectRedis().catch(() => {
      console.log("Continuing without Redis cache");
    });

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
      console.log(`API URL: http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
