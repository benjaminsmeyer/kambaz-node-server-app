import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const newAssignment = await dao.createAssignment({
      ...req.body,
      course: courseId,
    });
    res.json(newAssignment);
  };

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignment = async (req, res) => {
    const assignment = await dao.createAssignment(req.body);
    res.json(assignment);
  };

  const findAllAssignments = async (req, res) => {
    const assignments = await dao.findAllAssignments();
    res.json(assignments);
  };

  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    res.json(assignment);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const updated = await dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.status(404).send("Assignment not found");
      return;
    }
    res.json(updated);
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  app.post("/api/assignments", createAssignment);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.get("/api/assignments", findAllAssignments);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
