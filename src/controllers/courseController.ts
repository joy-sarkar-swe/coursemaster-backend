import { Response } from "express";
import { clearCache } from "../middleware/cache";
import Course from "../models/Course";
import { AuthRequest } from "../types";

// @desc    Get all courses with pagination, search, filter, sort
// @route   GET /api/courses
// @access  Public
export const getCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { instructor: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by tags
    if (req.query.tags) {
      query.tags = { $in: (req.query.tags as string).split(",") };
    }

    // Filter by level
    if (req.query.level) {
      query.level = req.query.level;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice)
        query.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice)
        query.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    // Sort
    let sortOption: any = { createdAt: -1 };
    if (req.query.sort) {
      const sortBy = req.query.sort as string;
      if (sortBy === "price-asc") sortOption = { price: 1 };
      if (sortBy === "price-desc") sortOption = { price: -1 };
      if (sortBy === "title") sortOption = { title: 1 };
      if (sortBy === "newest") sortOption = { createdAt: -1 };
    }

    const courses = await Course.find(query)
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
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

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ success: false, error: "Course not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.create(req.body);

    // Clear cache
    await clearCache("cache:/api/courses*");

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      res.status(404).json({ success: false, error: "Course not found" });
      return;
    }

    // Clear cache
    await clearCache("cache:/api/courses*");

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      res.status(404).json({ success: false, error: "Course not found" });
      return;
    }

    // Clear cache
    await clearCache("cache:/api/courses*");

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
export const getCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const categories = await Course.distinct("category");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Server error",
    });
  }
};
