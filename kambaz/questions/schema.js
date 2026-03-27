import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true },
    title: { type: String, default: "New Question" },
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
      default: "Multiple Choice",
    },
    points: { type: Number, default: 1 },
    question: { type: String, default: "" },
    choices: [
      {
        text: { type: String },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    trueFalseAnswer: { type: Boolean, default: true },
    blanks: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { collection: "questions", timestamps: true },
);

export default schema;
