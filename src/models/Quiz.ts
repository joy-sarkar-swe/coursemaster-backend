import mongoose, { Document, Schema } from "mongoose";

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  moduleIndex: number;
  title: string;
  questions: IQuizQuestion[];
  passingScore: number;
  duration: number;
}

export interface IQuizAttempt extends Document {
  quiz: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  passed: boolean;
  attemptedAt: Date;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const quizSchema = new Schema<IQuiz>(
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
    questions: [quizQuestionSchema],
    passingScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: {
      type: [Number],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>(
  "QuizAttempt",
  quizAttemptSchema
);
