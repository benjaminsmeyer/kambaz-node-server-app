import EnrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);

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
    res.json(updated);
  };

  const deleteEnrollment = (req, res) => {
    const { enrollmentId } = req.params;
    const status = dao.deleteEnrollment(enrollmentId);
    res.json(status);
  };

  app.post("/api/enrollments", createEnrollment);
  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/enrollments/:enrollmentId", findEnrollmentById);
  app.put("/api/enrollments/:enrollmentId", updateEnrollment);
  app.delete("/api/enrollments/:enrollmentId", deleteEnrollment);
}
