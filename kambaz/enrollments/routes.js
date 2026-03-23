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

  const createEnrollment = (req, res) => {
    const enrollment = dao.createEnrollment(req.body);
    res.json(enrollment);
  };

  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  const findEnrollmentById = (req, res) => {
    const { enrollmentId } = req.params;
    const enrollment = dao.findEnrollmentById(enrollmentId);
    if (!enrollment) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(enrollment);
  };

  const updateEnrollment = (req, res) => {
    const { enrollmentId } = req.params;
    const updated = dao.updateEnrollment(enrollmentId, req.body);
    if (!updated) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(updated);
  };

  const deleteEnrollment = (req, res) => {
    const { enrollmentId } = req.params;
    const deleted = dao.deleteEnrollment(enrollmentId);
    if (!deleted) {
      res.status(404).send("Enrollment not found");
      return;
    }
    res.json(deleted);
  };

  const findEnrollmentsForUser = (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  const enrollUserInCourse = (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const { courseId } = req.params;
    const enrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUserFromCourse = (req, res) => {
    const userId = resolveUserId(req.params.userId, req, res);
    if (!userId) {
      return;
    }
    const { courseId } = req.params;
    const enrollment = dao.unenrollUserFromCourse(userId, courseId);
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
