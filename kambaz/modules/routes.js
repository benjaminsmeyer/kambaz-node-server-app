import ModulesDao from "./dao.js";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const findAllModules = async (req, res) => {
    const modules = await dao.findAllModules();
    res.json(modules);
  };

  const findModuleById = async (req, res) => {
    const { moduleId } = req.params;
    const module = await dao.findModuleById(moduleId);
    if (!module) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(module);
  };

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const newModule = await dao.createModule(courseId, req.body);
    res.json(newModule);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const deleted = await dao.deleteModule(courseId, moduleId);
    if (!deleted) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(deleted);
  };

  const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const updated = await dao.updateModule(courseId, moduleId, moduleUpdates);
    if (!updated) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(updated);
  };

  const createModule = async (req, res) => {
    const { course } = req.body;
    if (!course) {
      res.status(400).send("course is required");
      return;
    }
    const newModule = await dao.createModule(course, req.body);
    res.json(newModule);
  };

  const updateModuleById = async (req, res) => {
    const { moduleId } = req.params;
    const updated = await dao.updateModule(null, moduleId, req.body);
    if (!updated) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(updated);
  };

  const deleteModuleById = async (req, res) => {
    const { moduleId } = req.params;
    const deleted = await dao.deleteModule(null, moduleId);
    if (!deleted) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(deleted);
  };

  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModuleById);
  app.delete("/api/modules/:moduleId", deleteModuleById);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/modules", createModule);
  app.get("/api/modules", findAllModules);
  app.get("/api/modules/:moduleId", findModuleById);
}
