import ModulesDao from "./dao.js";

export default function ModuleRoutes(app, db) {
  const dao = ModulesDao(db);

  const createModule = async (req, res) => {
    const module = await dao.createModule(req.body);
    res.json(module);
  };

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
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await dao.createModule(module);
    res.send(newModule);
  };

  const deleteModule = async (req, res) => {
    const { moduleId } = req.params;
    const status = await dao.deleteModule(moduleId);
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(moduleId, moduleUpdates);
    res.send(status);
  };

  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/modules", createModule);
  app.get("/api/modules", findAllModules);
  app.get("/api/modules/:moduleId", findModuleById);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}
