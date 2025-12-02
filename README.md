# CourseMaster Backend API

Production-ready E-learning platform backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Student/Admin)
- **Course Management**: Full CRUD operations for courses with batches, modules, and lessons
- **Enrollment System**: Students can enroll in courses and track progress
- **Assignments & Quizzes**: Submit assignments and take quizzes with automatic grading
- **Analytics Dashboard**: Enrollment analytics and dashboard stats for admins
- **Redis Caching**: Optimized API responses with Redis caching layer
- **Email Notifications**: Welcome emails and enrollment confirmations via Nodemailer
- **Input Validation**: Request validation using Joi
- **Error Handling**: Centralized error handling middleware
- **Database Optimization**: Indexed fields and query optimization

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Redis (optional, for caching)

## 🛠️ Installation

1. **Install dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file**:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coursemaster
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRE=7d

   # Redis (Optional)
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Email (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # Admin Credentials
   ADMIN_EMAIL=admin@coursemaster.com
   ADMIN_PASSWORD=Admin@123
   ```

4. **Seed Database**:

   ```bash
   npm run seed
   ```

5. **Start Development Server**:

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Courses

#### Get All Courses (with filters)

```http
GET /api/courses?page=1&limit=10&search=react&category=Web Development&sort=price-asc&level=beginner
```

#### Get Single Course

```http
GET /api/courses/:id
```

#### Create Course (Admin only)

```http
POST /api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course description",
  "instructor": "Instructor Name",
  "category": "Web Development",
  "price": 4999,
  "duration": 40,
  "level": "intermediate"
}
```

#### Update Course (Admin only)

```http
PUT /api/courses/:id
Authorization: Bearer <admin_token>
```

#### Delete Course (Admin only)

```http
DELETE /api/courses/:id
Authorization: Bearer <admin_token>
```

### Enrollments

#### Enroll in Course (Student only)

```http
POST /api/enrollments
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "courseId": "course_id",
  "batch": 1
}
```

#### Get My Enrollments

```http
GET /api/enrollments/my
Authorization: Bearer <student_token>
```

#### Mark Lesson Complete

```http
PUT /api/enrollments/:enrollmentId/complete-lesson
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "lessonId": "lesson_id"
}
```

### Assignments

#### Get Assignments for Course

```http
GET /api/assignments/course/:courseId
Authorization: Bearer <token>
```

#### Submit Assignment

```http
POST /api/assignments/submit
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "assignmentId": "assignment_id",
  "submissionLink": "https://drive.google.com/...",
  "submissionText": "Assignment answer"
}
```

#### Get All Submissions (Admin only)

```http
GET /api/assignments/submissions
Authorization: Bearer <admin_token>
```

#### Grade Submission (Admin only)

```http
PUT /api/assignments/submissions/:id/grade
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Great work!"
}
```

### Quizzes

#### Get Quiz

```http
GET /api/quizzes/:id
Authorization: Bearer <token>
```

#### Submit Quiz

```http
POST /api/quizzes/submit
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "quizId": "quiz_id",
  "answers": [1, 2, 0, 3]
}
```

### Analytics (Admin only)

#### Get Enrollment Analytics

```http
GET /api/analytics/enrollments
Authorization: Bearer <admin_token>
```

#### Get Dashboard Stats

```http
GET /api/analytics/dashboard
Authorization: Bearer <admin_token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   ├── redis.ts      # Redis connection
│   │   └── index.ts      # Environment config
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes (dynamic routing)
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── validation.ts # Joi validation
│   │   ├── cache.ts      # Redis caching
│   │   └── errorHandler.ts
│   ├── seeders/          # Database seeders
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── server.ts         # Express app entry point
├── package.json
└── tsconfig.json
```

## 🔐 Default Credentials

After seeding the database:

- **Admin**: `admin@coursemaster.com` / `Admin@123`
- **Student**: `john@example.com` / `password123`

## 🧪 Scripts

```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server
npm run seed     # Seed database with sample data
```

## 🎯 Key Features Implementation

### 1. **Database Indexing**

- Text indexes on course title, description, instructor
- Compound indexes for optimized queries
- Unique indexes to prevent duplicates

### 2. **Redis Caching**

- Course listing cached for 5 minutes
- Auto-invalidation on course updates

### 3. **Dynamic Routing**

- All routes registered dynamically from configuration
- Easy to add new routes

### 4.  **Error Handling**

- Global error handler middleware
- Mongoose error transformation
- Structured error responses

### 5. **Security**

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation with Joi

## 📝 Notes

- Redis is optional; the app works without it but with reduced performance
- Email notifications require SMTP credentials in `.env`
- MongoDB must be running before starting the server

## ⌨️ Troubleshooting

**MongoDB Connection Error**:

- Ensure MongoDB is running: `mongodb`
- Check connection string in `.env`

**Redis Connection Error**:

- Redis is optional, app will continue without it
- Start Redis: `redis-server`

**Port Already in Use**:

- Change PORT in `.env` file
