import { Response } from "express";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import User from "../models/User";
import { AuthRequest } from "../types";

// @desc    Get enrollment analytics
// @route   GET /api/analytics/enrollments
// @access  Private/Admin
export const getEnrollmentAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Enrollments over time (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const enrollmentsByMonth = await Enrollment.aggregate([
      {
        $match: {
          enrollmentDate: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$enrollmentDate" },
            month: { $month: "$enrollmentDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Total stats
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({
      status: "active",
    });
    const completedEnrollments = await Enrollment.countDocuments({
      status: "completed",
    });

    // Popular courses
    const popularCourses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          enrollmentCount: { $sum: 1 },
        },
      },
      {
        $sort: { enrollmentCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $unwind: "$courseInfo",
      },
      {
        $project: {
          _id: 1,
          enrollmentCount: 1,
          title: "$courseInfo.title",
          instructor: "$courseInfo.instructor",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        enrollmentsByMonth,
        stats: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments,
        },
        popularCourses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({
      status: "active",
    });

    // Average progress
    const avgProgressResult = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: "$progress" },
        },
      },
    ]);

    const avgProgress =
      avgProgressResult.length > 0 ? avgProgressResult[0].avgProgress : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        activeEnrollments,
        avgProgress: Math.round(avgProgress),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
