import { Router } from "express";
import {
  getDashboardStats,
  getEnrollmentAnalytics,
} from "../controllers/analyticsController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/enrollments", protect, authorize("admin"), getEnrollmentAnalytics);
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

export default router;
