import model from "./model.js";

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  function createEnrollment(enrollment) {
    const enrollmentId =
      enrollment._id || `${enrollment.user}-${enrollment.course}`;
    return model.create({ ...enrollment, _id: enrollmentId });
  }

  function findAllEnrollments() {
    return model.find();
  }

  function findEnrollmentById(enrollmentId) {
    return model.findById(enrollmentId);
  }

  function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
  }

  function findEnrollmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findEnrollmentForUserInCourse(userId, courseId) {
    return model.findOne({ user: userId, course: courseId });
  }

  function updateEnrollment(enrollmentId, enrollmentUpdates) {
    return model.findByIdAndUpdate(
      enrollmentId,
      { $set: enrollmentUpdates },
      { new: true },
    );
  }

  async function enrollUserInCourse(userId, courseId) {
    const existingEnrollment = await findEnrollmentForUserInCourse(
      userId,
      courseId,
    );
    if (existingEnrollment) {
      return existingEnrollment;
    }
    return createEnrollment({ user: userId, course: courseId });
  }

  function unenrollUserFromCourse(user, course) {
    return model.findOneAndDelete({ user, course });
  }

  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  function deleteEnrollment(enrollmentId) {
    return model.findByIdAndDelete(enrollmentId);
  }

  return {
    createEnrollment,
    findAllEnrollments,
    findEnrollmentById,
    findEnrollmentsForUser,
    findEnrollmentsForCourse,
    findEnrollmentForUserInCourse,
    updateEnrollment,
    deleteEnrollment,
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
