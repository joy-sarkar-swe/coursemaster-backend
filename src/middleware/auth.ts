import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import User from "../models/User";
import { AuthRequest } from "../types";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res
        .status(401)
        .json({ success: false, error: "Not authorized to access this route" });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ success: false, error: "User not found" });
        return;
      }

      req.user = {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };

      next();
    } catch (error) {
      res
        .status(401)
        .json({ success: false, error: "Not authorized to access this route" });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `User role ${req.user?.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
