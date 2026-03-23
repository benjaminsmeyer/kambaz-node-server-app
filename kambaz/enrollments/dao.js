import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  let { enrollments } = db;

  const createEnrollment = (enrollment) => {
    const newEnrollment = { ...enrollment, _id: uuidv4() };
    enrollments = [...enrollments, newEnrollment];
    return newEnrollment;
  };

  const findAllEnrollments = () => enrollments;
  const findEnrollmentById = (enrollmentId) =>
    enrollments.find((enrollment) => enrollment._id === enrollmentId);

  const updateEnrollment = (enrollmentId, enrollment) =>
    (enrollments = enrollments.map((e) =>
      e._id === enrollmentId ? enrollment : e,
    ));

  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
  }

  const deleteEnrollment = (enrollmentId) =>
    (enrollments = enrollments.filter((e) => e._id !== enrollmentId));

  return {
    createEnrollment,
    enrollUserInCourse,
    findAllEnrollments,
    findEnrollmentById,
    updateEnrollment,
    deleteEnrollment,
  };
}
