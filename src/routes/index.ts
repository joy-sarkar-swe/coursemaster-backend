import { Router } from "express";
import analyticsRoutes from "./analyticsRoutes";
import assignmentRoutes from "./assignmentRoutes";
import authRoutes from "./authRoutes";
import courseRoutes from "./courseRoutes";
import enrollmentRoutes from "./enrollmentRoutes";
import quizRoutes from "./quizRoutes";

const router = Router();

// Dynamic route configuration
const routes = [
  { path: "/auth", router: authRoutes },
  { path: "/courses", router: courseRoutes },
  { path: "/enrollments", router: enrollmentRoutes },
  { path: "/assignments", router: assignmentRoutes },
  { path: "/quizzes", router: quizRoutes },
  { path: "/analytics", router: analyticsRoutes },
];

// Register all routes dynamically
routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
