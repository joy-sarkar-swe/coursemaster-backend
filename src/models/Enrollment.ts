import mongoose, { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  batch: number;
  enrollmentDate: Date;
  status: "active" | "completed" | "dropped";
  progress: number;
  completedLessons: string[];
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
