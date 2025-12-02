import mongoose, { Document, Schema } from "mongoose";

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  moduleIndex: number;
  title: string;
  description: string;
  dueDate: Date;
}

export interface IAssignmentSubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  submissionLink: string;
  submissionText: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  status: "pending" | "graded";
}

const assignmentSchema = new Schema<IAssignment>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    moduleIndex: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    submissionLink: {
      type: String,
      default: "",
    },
    submissionText: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "graded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate submissions
assignmentSubmissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
export const AssignmentSubmission = mongoose.model<IAssignmentSubmission>(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
