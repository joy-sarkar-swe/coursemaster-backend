import { Router } from "express";
import {
  createQuiz,
  getMyAttempts,
  getQuiz,
  getQuizzesByCourse,
  submitQuiz,
} from "../controllers/quizController";
import { authorize, protect } from "../middleware/auth";
import { quizSubmissionSchema, validate } from "../middleware/validation";

const router = Router();

router.get("/course/:courseId", protect, getQuizzesByCourse);
router.get("/:id", protect, getQuiz);
router.post("/", protect, authorize("admin"), createQuiz);
router.post(
  "/submit",
  protect,
  authorize("student"),
  validate(quizSubmissionSchema),
  submitQuiz
);
router.get("/my-attempts", protect, authorize("student"), getMyAttempts);

export default router;
