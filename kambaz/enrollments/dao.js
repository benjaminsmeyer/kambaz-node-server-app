import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const createEnrollment = (enrollment) => {
    const newEnrollment = { ...enrollment, _id: uuidv4() };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  };

  const findAllEnrollments = () => db.enrollments;

  const findEnrollmentById = (enrollmentId) =>
    db.enrollments.find((enrollment) => enrollment._id === enrollmentId);

  const findEnrollmentsForUser = (userId) =>
    db.enrollments.filter((enrollment) => enrollment.user === userId);

  const findEnrollmentsForCourse = (courseId) =>
    db.enrollments.filter((enrollment) => enrollment.course === courseId);

  const findEnrollmentForUserInCourse = (userId, courseId) =>
    db.enrollments.find(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === courseId,
    );

  const updateEnrollment = (enrollmentId, enrollmentUpdates) => {
    let updatedEnrollment = null;
    db.enrollments = db.enrollments.map((enrollment) => {
      if (enrollment._id !== enrollmentId) {
        return enrollment;
      }
      updatedEnrollment = {
        ...enrollment,
        ...enrollmentUpdates,
        _id: enrollmentId,
      };
      return updatedEnrollment;
    });
    return updatedEnrollment;
  };

  function enrollUserInCourse(userId, courseId) {
    const existingEnrollment = findEnrollmentForUserInCourse(userId, courseId);
    if (existingEnrollment) {
      return existingEnrollment;
    }
    return createEnrollment({ user: userId, course: courseId });
  }

  function unenrollUserFromCourse(userId, courseId) {
    const enrollment = findEnrollmentForUserInCourse(userId, courseId);
    if (!enrollment) {
      return null;
    }
    db.enrollments = db.enrollments.filter(
      (existing) => existing._id !== enrollment._id,
    );
    return enrollment;
  }

  const deleteEnrollment = (enrollmentId) => {
    const existingEnrollment = findEnrollmentById(enrollmentId);
    if (!existingEnrollment) {
      return null;
    }
    db.enrollments = db.enrollments.filter((e) => e._id !== enrollmentId);
    return existingEnrollment;
  };

  return {
    createEnrollment,
    enrollUserInCourse,
    unenrollUserFromCourse,
    findAllEnrollments,
    findEnrollmentById,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findEnrollmentForUserInCourse,
    updateEnrollment,
    deleteEnrollment,
  };
}
