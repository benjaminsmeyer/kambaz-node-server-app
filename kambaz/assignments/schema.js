import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    course: { type: String, required: true, index: true },
    available: String,
    due: String,
    until: String,
    points: { type: Number, default: 100 },
    description: String,
  },
  { collection: "assignments" },
);

export default schema;
