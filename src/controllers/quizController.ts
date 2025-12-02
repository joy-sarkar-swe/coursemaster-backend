import { Response } from "express";
import Enrollment from "../models/Enrollment";
import { Quiz, QuizAttempt } from "../models/Quiz";
import { AuthRequest } from "../types";

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getQuizzesByCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .select("-questions.correctAnswer")
      .sort("moduleIndex");

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404).json({ success: false, error: "Quiz not found" });
      return;
    }

    // Remove correct answers for students
    const quizData = quiz.toObject();
    if (req.user?.role !== "admin") {
      quizData.questions = quizData.questions.map((q: any) => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
    }

    res.status(200).json({
      success: true,
      data: quizData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/submit
// @access  Private/Student
export const submitQuiz = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.user?._id;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ success: false, error: "Quiz not found" });
      return;
    }

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: quiz.course,
    });

    if (!enrollment) {
      res
        .status(403)
        .json({ success: false, error: "Not enrolled in this course" });
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      quiz: quizId,
      student: studentId,
      answers,
      score,
      passed,
    });

    res.status(201).json({
      success: true,
      data: {
        score,
        passed,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
        attempt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get my quiz attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private/Student
export const getMyAttempts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user?._id })
      .populate("quiz", "title course")
      .sort("-attemptedAt");

    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
