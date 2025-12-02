import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCategories,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courseController";
import { authorize, protect } from "../middleware/auth";
import { cache } from "../middleware/cache";
import { courseSchema, validate } from "../middleware/validation";

const router = Router();

router.get("/", cache(300), getCourses);
router.get("/categories", getCategories);
router.get("/:id", getCourse);
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(courseSchema),
  createCourse
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate(courseSchema),
  updateCourse
);
router.delete("/:id", protect, authorize("admin"), deleteCourse);

export default router;
