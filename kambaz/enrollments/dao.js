import model from "./model.js";
import seedEnrollments from "../database/enrollments.js";

export default function EnrollmentsDao(db) {
  async function seedIfNeeded() {
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(seedEnrollments);
    }
  }

  async function findCoursesForUser(userId) {
    await seedIfNeeded();
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

  async function findAllEnrollments() {
    await seedIfNeeded();
    return model.find();
  }

  function findEnrollmentById(enrollmentId) {
    return model.findById(enrollmentId);
  }

  async function findEnrollmentsForUser(userId) {
    await seedIfNeeded();
    return model.find({ user: userId });
  }

  async function findEnrollmentsForCourse(courseId) {
    await seedIfNeeded();
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
