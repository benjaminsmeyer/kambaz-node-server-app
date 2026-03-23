import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  let { courses } = db;

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  function findAllCourses() {
    return db.courses;
  }

  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id,
      ),
    );
    return enrolledCourses;
  }

  const findCourseById = (courseId) =>
    courses.find((course) => course._id === courseId);

  function updateCourse(courseId, courseUpdates) {
    const { courses } = db;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
  }

  function deleteCourse(courseId) {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId,
    );
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
