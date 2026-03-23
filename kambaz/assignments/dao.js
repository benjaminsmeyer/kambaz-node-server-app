import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  let { assignments } = db;

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    assignments = [...assignments, newAssignment];
    return newAssignment;
  };

  const findAssignmentsForCourse = (courseId) =>
    assignments.filter((assignment) => assignment.course === courseId);

  const findAllAssignments = () => assignments;
  const findAssignmentById = (assignmentId) =>
    assignments.find((assignment) => assignment._id === assignmentId);

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    let updatedAssignment = null;
    assignments = assignments.map((assignment) => {
      if (assignment._id !== assignmentId) {
        return assignment;
      }
      updatedAssignment = {
        ...assignment,
        ...assignmentUpdates,
        _id: assignmentId,
      };
      return updatedAssignment;
    });
    return updatedAssignment;
  };

  const deleteAssignment = (assignmentId) =>
    (assignments = assignments.filter((a) => a._id !== assignmentId));

  return {
    createAssignment,
    findAssignmentsForCourse,
    findAllAssignments,
    findAssignmentById,
    updateAssignment,
    deleteAssignment,
  };
}
