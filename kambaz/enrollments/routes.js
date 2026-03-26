import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const resolveUserId = (userId, req, res) => {
    if (userId !== "current") {
      return userId;
    }
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser._id;
  };

  const createEnrollment = async (req, res) => {
    const enrollment = await dao.createEnrollment(req.body);
    res.json(enrollment);
  };

  const findAllEnrollments = async (req, res) => {
    const enrollments = await dao.findAllEnrollments();
    res.json(enrollments);
  };

  const findEnrollmentById = async (req, res) => {
    const { enrollmentId } = req.params;
    const enrollment = await dao.findEnrollmentById(enrollmentId);
    if (!enrollment) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(enrollment);
  };

  const updateEnrollment = async (req, res) => {
    const { enrollmentId } = req.params;
    const updated = await dao.updateEnrollment(enrollmentId, req.body);
    if (!updated) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(updated);
  };

  const deleteEnrollment = async (req, res) => {
    const { enrollmentId } = req.params;
    const deleted = await dao.deleteEnrollment(enrollmentId);
    if (!deleted) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(deleted);
  };

  const findEnrollmentsForUser = async (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const findEnrollmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  const enrollUserInCourse = async (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const { courseId } = req.params;
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = async (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const { courseId } = req.params;
    const enrollment = await dao.unenrollUserFromCourse(userId, courseId);
    if (!enrollment) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(enrollment);
  };

  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.get("/api/courses/:courseId/enrollments", findEnrollmentsForCourse);
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
  app.post("/api/enrollments", createEnrollment);
  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/enrollments/:enrollmentId", findEnrollmentById);
  app.put("/api/enrollments/:enrollmentId", updateEnrollment);
  app.delete("/api/enrollments/:enrollmentId", deleteEnrollment);
}
