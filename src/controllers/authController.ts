import { Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../config";
import User from "../models/User";
import { AuthRequest } from "../types";
import { sendWelcomeEmail } from "../utils/email";

const generateToken = (id: string): string => {
  const secret: Secret = config.jwtSecret as unknown as Secret;
  const options: SignOptions = {
    expiresIn: config.jwtExpire as SignOptions["expiresIn"],
  };
  return jwt.sign({ id }, secret, options);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, error: "User already exists" });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
