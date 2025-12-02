import { Router } from "express";
import {
  enrollCourse,
  getAllEnrollments,
  getEnrollment,
  getMyEnrollments,
  markLessonComplete,
} from "../controllers/enrollmentController";
import { authorize, protect } from "../middleware/auth";
import { enrollmentSchema, validate } from "../middleware/validation";

const router = Router();

router.post(
  "/",
  protect,
  authorize("student"),
  validate(enrollmentSchema),
  enrollCourse
);
router.get("/my", protect, authorize("student"), getMyEnrollments);
router.get("/:id", protect, getEnrollment);
router.put(
  "/:id/complete-lesson",
  protect,
  authorize("student"),
  markLessonComplete
);
router.get("/", protect, authorize("admin"), getAllEnrollments);

export default router;
