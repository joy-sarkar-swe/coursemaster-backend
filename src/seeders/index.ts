import dotenv from "dotenv";
import { config } from "../config";
import { connectDB } from "../config/database";
import { Assignment } from "../models/Assignment";
import Course from "../models/Course";
import { Quiz } from "../models/Quiz";
import User from "../models/User";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await Quiz.deleteMany({});

    console.log("Cleared existing data");

    // Create Admin User
    const admin = await User.create({
      name: "Admin User",
      email: config.admin.email,
      password: config.admin.password,
      role: "admin",
    });

    console.log("Admin user created");

    // Create Sample Students
    const students = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "student",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "student",
      },
    ]);

    console.log("Sample students created");

    // Create Courses
    const courses = await Course.create([
      {
        title: "Full Stack Web Development with MERN",
        description:
          "Learn to build modern web applications using MongoDB, Express, React, and Node.js. This comprehensive course covers everything from basics to advanced topics.",
        instructor: "Sarah Johnson",
        category: "Web Development",
        tags: ["JavaScript", "React", "Node.js", "MongoDB"],
        price: 4999,
        thumbnail:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        duration: 60,
        level: "intermediate",
        requirements: [
          "Basic JavaScript knowledge",
          "Understanding of HTML/CSS",
        ],
        learningOutcomes: [
          "Build full-stack applications",
          "Master React and Node.js",
          "Work with MongoDB databases",
          "Deploy applications to production",
        ],
        syllabus: [
          {
            title: "Introduction to MERN Stack",
            description:
              "Overview of the MERN stack and setting up the development environment",
            order: 1,
            lessons: [
              {
                title: "What is MERN Stack?",
                videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
                duration: 15,
                order: 1,
              },
              {
                title: "Setting Up Development Environment",
                videoUrl: "https://www.youtube.com/embed/SBmSRK3feww",
                duration: 20,
                order: 2,
              },
            ],
          },
          {
            title: "MongoDB Fundamentals",
            description: "Learn database design and MongoDB operations",
            order: 2,
            lessons: [
              {
                title: "Introduction to MongoDB",
                videoUrl: "https://www.youtube.com/embed/ExcRbA7fy_A",
                duration: 25,
                order: 1,
              },
              {
                title: "Mongoose ODM",
                videoUrl: "https://www.youtube.com/embed/DZBGEVgL2eE",
                duration: 30,
                order: 2,
              },
            ],
          },
          {
            title: "Backend with Express & Node.js",
            description: "Building RESTful APIs with Express",
            order: 3,
            lessons: [
              {
                title: "Express Basics",
                videoUrl: "https://www.youtube.com/embed/L72fhGm1tfE",
                duration: 35,
                order: 1,
              },
              {
                title: "REST API Development",
                videoUrl: "https://www.youtube.com/embed/pKd0Rpw7O48",
                duration: 40,
                order: 2,
              },
            ],
          },
        ],
        batches: [
          {
            batchNumber: 1,
            startDate: new Date("2025-01-15"),
            endDate: new Date("2025-03-15"),
            maxStudents: 50,
            currentEnrollments: 0,
          },
          {
            batchNumber: 2,
            startDate: new Date("2025-02-01"),
            endDate: new Date("2025-04-01"),
            maxStudents: 50,
            currentEnrollments: 0,
          },
        ],
      },
      {
        title: "Python for Data Science",
        description:
          "Master Python programming for data analysis, visualization, and machine learning. Perfect for beginners and aspiring data scientists.",
        instructor: "Dr. Michael Chen",
        category: "Data Science",
        tags: ["Python", "Data Analysis", "Machine Learning"],
        price: 3999,
        thumbnail:
          "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
        duration: 45,
        level: "beginner",
        requirements: ["Basic programming knowledge"],
        learningOutcomes: [
          "Master Python fundamentals",
          "Perform data analysis with Pandas",
          "Create visualizations",
          "Build ML models",
        ],
        syllabus: [
          {
            title: "Python Basics",
            description: "Introduction to Python programming",
            order: 1,
            lessons: [
              {
                title: "Python Installation and Setup",
                videoUrl: "https://www.youtube.com/embed/YYXdXT2l-Gg",
                duration: 15,
                order: 1,
              },
              {
                title: "Variables and Data Types",
                videoUrl: "https://www.youtube.com/embed/khKv-8q7YmY",
                duration: 20,
                order: 2,
              },
            ],
          },
          {
            title: "Data Analysis with Pandas",
            description: "Learn data manipulation and analysis",
            order: 2,
            lessons: [
              {
                title: "Introduction to Pandas",
                videoUrl: "https://www.youtube.com/embed/vmEHCJofslg",
                duration: 30,
                order: 1,
              },
            ],
          },
        ],
        batches: [
          {
            batchNumber: 1,
            startDate: new Date("2025-01-20"),
            endDate: new Date("2025-03-05"),
            maxStudents: 60,
            currentEnrollments: 0,
          },
        ],
      },
      {
        title: "UI/UX Design Masterclass",
        description:
          "Learn the principles of user interface and user experience design. Create beautiful, user-friendly designs.",
        instructor: "Emily Rodriguez",
        category: "Design",
        tags: ["UI", "UX", "Figma", "Design Thinking"],
        price: 2999,
        thumbnail:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
        duration: 30,
        level: "beginner",
        requirements: ["No prior experience required"],
        learningOutcomes: [
          "Understand UI/UX principles",
          "Master Figma",
          "Create wireframes and prototypes",
          "Conduct user research",
        ],
        syllabus: [
          {
            title: "Introduction to UI/UX",
            description: "Understanding design fundamentals",
            order: 1,
            lessons: [
              {
                title: "What is UI/UX Design?",
                videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
                duration: 20,
                order: 1,
              },
            ],
          },
        ],
        batches: [
          {
            batchNumber: 1,
            startDate: new Date("2025-01-25"),
            endDate: new Date("2025-02-25"),
            maxStudents: 40,
            currentEnrollments: 0,
          },
        ],
      },
      {
        title: "DevOps and Cloud Computing",
        description:
          "Master DevOps practices and cloud platforms like AWS. Learn CI/CD, Docker, Kubernetes, and more.",
        instructor: "Robert Taylor",
        category: "DevOps",
        tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        price: 5999,
        thumbnail:
          "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
        duration: 50,
        level: "advanced",
        requirements: [
          "Linux basics",
          "Programming experience",
          "Networking fundamentals",
        ],
        learningOutcomes: [
          "Deploy applications on AWS",
          "Containerize with Docker",
          "Orchestrate with Kubernetes",
          "Implement CI/CD pipelines",
        ],
        syllabus: [
          {
            title: "Introduction to DevOps",
            description: "Understanding DevOps culture and practices",
            order: 1,
            lessons: [
              {
                title: "What is DevOps?",
                videoUrl: "https://www.youtube.com/embed/UbtB4sMaaNM",
                duration: 25,
                order: 1,
              },
            ],
          },
        ],
        batches: [
          {
            batchNumber: 1,
            startDate: new Date("2025-02-01"),
            endDate: new Date("2025-03-25"),
            maxStudents: 30,
            currentEnrollments: 0,
          },
        ],
      },
      {
        title: "Mobile App Development with React Native",
        description:
          "Build cross-platform mobile applications for iOS and Android using React Native.",
        instructor: "Lisa Anderson",
        category: "Mobile Development",
        tags: ["React Native", "JavaScript", "iOS", "Android"],
        price: 4499,
        thumbnail:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
        duration: 40,
        level: "intermediate",
        requirements: ["JavaScript knowledge", "React basics"],
        learningOutcomes: [
          "Build mobile apps",
          "Master React Native",
          "Publish to app stores",
          "Work with native modules",
        ],
        syllabus: [
          {
            title: "Getting Started with React Native",
            description: "Setup and fundamentals",
            order: 1,
            lessons: [
              {
                title: "Introduction to React Native",
                videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
                duration: 20,
                order: 1,
              },
            ],
          },
        ],
        batches: [
          {
            batchNumber: 1,
            startDate: new Date("2025-02-10"),
            endDate: new Date("2025-03-20"),
            maxStudents: 45,
            currentEnrollments: 0,
          },
        ],
      },
    ]);

    console.log("Courses created");

    // Create Assignments
    const assignments = await Assignment.create([
      {
        course: courses[0]._id,
        moduleIndex: 0,
        title: "MERN Stack Research Assignment",
        description:
          "Write a brief report on the advantages of MERN stack over other tech stacks. Submit as a Google Doc link.",
        dueDate: new Date("2025-02-01"),
      },
      {
        course: courses[0]._id,
        moduleIndex: 2,
        title: "Build a REST API",
        description:
          "Create a simple REST API with CRUD operations. Submit GitHub repository link.",
        dueDate: new Date("2025-02-15"),
      },
      {
        course: courses[1]._id,
        moduleIndex: 1,
        title: "Data Analysis Project",
        description:
          "Analyze a dataset using Pandas and create visualizations. Submit Jupyter Notebook.",
        dueDate: new Date("2025-02-20"),
      },
    ]);

    console.log("Assignments created");

    // Create Quizzes
    const quizzes = await Quiz.create([
      {
        course: courses[0]._id,
        moduleIndex: 0,
        title: "MERN Stack Basics Quiz",
        duration: 15,
        passingScore: 70,
        questions: [
          {
            question: "What does MERN stand for?",
            options: [
              "MySQL, Express, React, Node",
              "MongoDB, Express, React, Node",
              "MongoDB, Ember, React, Next",
              "Mongoose, Express, Redux, Node",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which is the database in MERN stack?",
            options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
            correctAnswer: 2,
          },
          {
            question: "What is Express.js?",
            options: [
              "A database",
              "A frontend framework",
              "A backend framework",
              "A testing library",
            ],
            correctAnswer: 2,
          },
          {
            question: "React is used for?",
            options: ["Backend", "Database", "Frontend", "DevOps"],
            correctAnswer: 2,
          },
          {
            question: "Node.js runs on?",
            options: [
              "Browser only",
              "Server only",
              "Both browser and server",
              "Mobile only",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        course: courses[1]._id,
        moduleIndex: 0,
        title: "Python Fundamentals Quiz",
        duration: 10,
        passingScore: 60,
        questions: [
          {
            question: "Which of the following is a Python data type?",
            options: ["int", "varchar", "boolean", "char"],
            correctAnswer: 0,
          },
          {
            question: "How do you create a list in Python?",
            options: ["list = ()", "list = []", "list = {}", "list = <>"],
            correctAnswer: 1,
          },
          {
            question: "What is the correct way to import a module?",
            options: [
              "include pandas",
              "import pandas",
              "using pandas",
              "require pandas",
            ],
            correctAnswer: 1,
          },
        ],
      },
    ]);

    console.log("Quizzes created");

    console.log("\n Database seeded successfully!");
    console.log("\n Admin Credentials:");
    console.log(`   Email: ${config.admin.email}`);
    console.log(`   Password: ${config.admin.password}`);
    console.log("\n Sample Student Credentials:");
    console.log("   Email: john@example.com / jane@example.com");
    console.log("   Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
