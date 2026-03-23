import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  let { assignments } = db;

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    assignments = [...assignments, newAssignment];
    return newAssignment;
  };

  const findAllAssignments = () => assignments;
  const findAssignmentById = (assignmentId) =>
    assignments.find((assignment) => assignment._id === assignmentId);

  const updateAssignment = (assignmentId, assignment) =>
    (assignments = assignments.map((a) =>
      a._id === assignmentId ? assignment : a,
    ));

  const deleteAssignment = (assignmentId) =>
    (assignments = assignments.filter((a) => a._id !== assignmentId));

  return {
    createAssignment,
    findAllAssignments,
    findAssignmentById,
    updateAssignment,
    deleteAssignment,
  };
}
