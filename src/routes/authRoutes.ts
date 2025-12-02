import { Router } from "express";
import { getMe, login, register } from "../controllers/authController";
import { protect } from "../middleware/auth";
import {
  loginSchema,
  registerSchema,
  validate,
} from "../middleware/validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;
