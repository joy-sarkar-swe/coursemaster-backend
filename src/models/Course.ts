import mongoose, { Document, Schema } from "mongoose";

export interface ILesson {
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface IModule {
  title: string;
  description: string;
  lessons: ILesson[];
  order: number;
}

export interface IBatch {
  batchNumber: number;
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  currentEnrollments: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  category: string;
  tags: string[];
  price: number;
  thumbnail: string;
  syllabus: IModule[];
  batches: IBatch[];
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  requirements: string[];
  learningOutcomes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  order: { type: Number, required: true },
});

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: [lessonSchema],
  order: { type: Number, required: true },
});

const batchSchema = new Schema<IBatch>({
  batchNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxStudents: { type: Number, default: 50 },
  currentEnrollments: { type: Number, default: 0 },
});

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
    },
    instructor: {
      type: String,
      required: [true, "Please provide instructor name"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/400x300",
    },
    syllabus: [moduleSchema],
    batches: [batchSchema],
    duration: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    requirements: [String],
    learningOutcomes: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for search optimization
courseSchema.index({ title: "text", description: "text", instructor: "text" });
courseSchema.index({ category: 1, price: 1 });

export default mongoose.model<ICourse>("Course", courseSchema);
