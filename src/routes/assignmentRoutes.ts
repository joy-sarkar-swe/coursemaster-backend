import { Router } from "express";
import {
  createAssignment,
  getAllSubmissions,
  getAssignmentsByCourse,
  getMySubmissions,
  gradeSubmission,
  submitAssignment,
} from "../controllers/assignmentController";
import { authorize, protect } from "../middleware/auth";
import { assignmentSubmissionSchema, validate } from "../middleware/validation";

const router = Router();

router.get("/course/:courseId", protect, getAssignmentsByCourse);
router.post("/", protect, authorize("admin"), createAssignment);
router.post(
  "/submit",
  protect,
  authorize("student"),
  validate(assignmentSubmissionSchema),
  submitAssignment
);
router.get("/my-submissions", protect, authorize("student"), getMySubmissions);
router.get("/submissions", protect, authorize("admin"), getAllSubmissions);
router.put(
  "/submissions/:id/grade",
  protect,
  authorize("admin"),
  gradeSubmission
);

export default router;
