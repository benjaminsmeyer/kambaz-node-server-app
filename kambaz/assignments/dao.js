import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import seedAssignments from "../database/assignments.js";

export default function AssignmentsDao(db) {
  async function seedIfNeeded() {
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(seedAssignments);
    }
  }

  const createAssignment = async (assignment) => {
    await seedIfNeeded();
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const findAssignmentsForCourse = async (courseId) => {
    await seedIfNeeded();
    return model.find({ course: courseId });
  };

  const findAllAssignments = async () => {
    await seedIfNeeded();
    return model.find();
  };

  const findAssignmentById = async (assignmentId) => {
    await seedIfNeeded();
    return model.findById(assignmentId);
  };

  const updateAssignment = async (assignmentId, assignmentUpdates) => {
    await seedIfNeeded();
    return model.findByIdAndUpdate(
      assignmentId,
      { $set: assignmentUpdates },
      { new: true },
    );
  };

  const deleteAssignment = async (assignmentId) => {
    await seedIfNeeded();
    return model.findByIdAndDelete(assignmentId);
  };

  return {
    createAssignment,
    findAssignmentsForCourse,
    findAllAssignments,
    findAssignmentById,
    updateAssignment,
    deleteAssignment,
  };
}
