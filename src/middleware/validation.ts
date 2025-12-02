import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
      return;
    }

    next();
  };
};

export const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid("student", "admin").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const courseSchema = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  price: Joi.number().required().min(0),
  thumbnail: Joi.string().uri().optional(),
  syllabus: Joi.array().optional(),
  batches: Joi.array().optional(),
  duration: Joi.number().required().min(1),
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  learningOutcomes: Joi.array().items(Joi.string()).optional(),
});

export const enrollmentSchema = Joi.object({
  courseId: Joi.string().required(),
  batch: Joi.number().required().min(1),
});

export const assignmentSubmissionSchema = Joi.object({
  assignmentId: Joi.string().required(),
  submissionLink: Joi.string().allow("").optional(),
  submissionText: Joi.string().allow("").optional(),
});

export const quizSubmissionSchema = Joi.object({
  quizId: Joi.string().required(),
  answers: Joi.array().items(Joi.number()).required(),
});
