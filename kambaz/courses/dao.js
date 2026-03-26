import model from "./model.js";
import enrollmentModel from "../enrollments/model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }

  const findCourseById = (courseId) => model.findById(courseId);

  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }

  function findAllCourses() {
    return model.find({}, { name: 1, description: 1 });
  }

  async function findCoursesForEnrolledUser(userId) {
    const enrollments = await enrollmentModel
      .find({ user: userId })
      .select("course");
    const courseIds = enrollments.map((enrollment) => enrollment.course);
    return model.find({ _id: { $in: courseIds } }, { name: 1, description: 1 });
  }

  return {
    createCourse,
    findAllCourses,
    findCourseById,
    updateCourse,
    findCoursesForEnrolledUser,
    deleteCourse,
  };
}
