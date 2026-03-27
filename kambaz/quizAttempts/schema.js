import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true },
    user: { type: String, required: true },
    course: { type: String, required: true },
    attemptNumber: { type: Number, default: 1 },
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    answers: [
      {
        question: { type: String },
        selectedChoice: { type: String, default: null },
        trueFalseAnswer: { type: Boolean, default: null },
        blankAnswer: { type: String, default: null },
        isCorrect: { type: Boolean, default: false },
        pointsEarned: { type: Number, default: 0 },
      },
    ],
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts", timestamps: true },
);

export default schema;
