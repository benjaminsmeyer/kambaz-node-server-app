import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const createAssignment = (req, res) => {
    const assignment = dao.createAssignment(req.body);
    res.json(assignment);
  };

  const findAllAssignments = (req, res) => {
    const assignments = dao.findAllAssignments();
    res.json(assignments);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    res.json(assignment);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    res.json(updated);
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.json(status);
  };

  app.post("/api/assignments", createAssignment);
  app.get("/api/assignments", findAllAssignments);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
}
