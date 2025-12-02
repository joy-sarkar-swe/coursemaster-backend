import { Response } from "express";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import { AuthRequest } from "../types";

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private/Student
export const enrollCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { courseId, batch } = req.body;
    const studentId = req.user?._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, error: "Course not found" });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      res
        .status(400)
        .json({ success: false, error: "Already enrolled in this course" });
      return;
    }

    // Check batch capacity
    const batchInfo = course.batches.find((b) => b.batchNumber === batch);
    if (!batchInfo) {
      res.status(400).json({ success: false, error: "Invalid batch number" });
      return;
    }

    if (batchInfo.currentEnrollments >= batchInfo.maxStudents) {
      res.status(400).json({ success: false, error: "Batch is full" });
      return;
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      batch,
    });

    // Update batch enrollment count
    batchInfo.currentEnrollments += 1;
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("course", "title instructor thumbnail")
      .populate("student", "name email");

    res.status(201).json({
      success: true,
      data: populatedEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private/Student
export const getMyEnrollments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ student: req.user?._id })
      .populate("course", "title instructor thumbnail duration level")
      .sort("-enrollmentDate");

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("course")
      .populate("student", "name email");

    if (!enrollment) {
      res.status(404).json({ success: false, error: "Enrollment not found" });
      return;
    }

    // Check authorization
    if (
      req.user?.role !== "admin" &&
      enrollment.student._id.toString() !== req.user?._id
    ) {
      res.status(403).json({ success: false, error: "Not authorized" });
      return;
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Mark lesson as completed
// @route   PUT /api/enrollments/:id/complete-lesson
// @access  Private/Student
export const markLessonComplete = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findById(req.params.id).populate(
      "course"
    );

    if (!enrollment) {
      res.status(404).json({ success: false, error: "Enrollment not found" });
      return;
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user?._id) {
      res.status(403).json({ success: false, error: "Not authorized" });
      return;
    }

    // Add to completed lessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);

      // Calculate progress
      const course = enrollment.course as any;
      const totalLessons = course.syllabus.reduce(
        (acc: number, module: any) => acc + module.lessons.length,
        0
      );
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );

      // Check if completed
      if (enrollment.progress === 100) {
        enrollment.status = "completed";
      }

      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments
// @access  Private/Admin
export const getAllEnrollments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (req.query.courseId) {
      query.course = req.query.courseId;
    }

    if (req.query.batch) {
      query.batch = parseInt(req.query.batch as string);
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const enrollments = await Enrollment.find(query)
      .populate("student", "name email")
      .populate("course", "title instructor")
      .sort("-enrollmentDate")
      .limit(limit)
      .skip(skip);

    const total = await Enrollment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        enrollments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
