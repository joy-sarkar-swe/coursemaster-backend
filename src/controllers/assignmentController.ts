import { Response } from "express";
import { Assignment, AssignmentSubmission } from "../models/Assignment";
import Enrollment from "../models/Enrollment";
import { AuthRequest } from "../types";

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
export const getAssignmentsByCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    }).sort("moduleIndex");

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private/Admin
export const createAssignment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/submit
// @access  Private/Student
export const submitAssignment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { assignmentId, submissionLink, submissionText } = req.body;
    const studentId = req.user?._id;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      res.status(404).json({ success: false, error: "Assignment not found" });
      return;
    }

    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: assignment.course,
    });

    if (!enrollment) {
      res
        .status(403)
        .json({ success: false, error: "Not enrolled in this course" });
      return;
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: studentId,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.submissionLink = submissionLink || "";
      existingSubmission.submissionText = submissionText || "";
      existingSubmission.submittedAt = new Date();
      existingSubmission.status = "pending";
      await existingSubmission.save();

      res.status(200).json({
        success: true,
        data: existingSubmission,
      });
      return;
    }

    // Create new submission
    const submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      student: studentId,
      submissionLink: submissionLink || "",
      submissionText: submissionText || "",
    });

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get my assignment submissions
// @route   GET /api/assignments/my-submissions
// @access  Private/Student
export const getMySubmissions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const submissions = await AssignmentSubmission.find({
      student: req.user?._id,
    })
      .populate("assignment")
      .sort("-submittedAt");

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get all submissions (Admin)
// @route   GET /api/assignments/submissions
// @access  Private/Admin
export const getAllSubmissions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let query: any = {};

    if (req.query.assignmentId) {
      query.assignment = req.query.assignmentId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const submissions = await AssignmentSubmission.find(query)
      .populate("student", "name email")
      .populate("assignment", "title course")
      .sort("-submittedAt");

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Grade assignment submission
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private/Admin
export const gradeSubmission = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { grade, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(req.params.id);
    if (!submission) {
      res.status(404).json({ success: false, error: "Submission not found" });
      return;
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = "graded";
    await submission.save();

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
