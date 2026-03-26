import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  const findAllModules = () => db.modules;
  const findModuleById = (moduleId) =>
    db.modules.find((module) => module._id === moduleId);

  function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  function updateModule(courseId, moduleId, moduleUpdates) {
    const exactMatchExists = db.modules.some(
      (module) =>
        module._id === moduleId &&
        (courseId ? module.course === courseId : true),
    );
    let updatedModule = null;
    db.modules = db.modules.map((module) => {
      if (module._id !== moduleId) {
        return module;
      }
      if (exactMatchExists && courseId && module.course !== courseId) {
        return module;
      }
      updatedModule = {
        ...module,
        ...moduleUpdates,
        _id: moduleId,
        course: module.course || courseId,
      };
      return updatedModule;
    });
    return updatedModule;
  }

  function deleteModule(courseId, moduleId) {
    let deletedModule = db.modules.find(
      (module) =>
        module._id === moduleId &&
        (courseId ? module.course === courseId : true),
    );
    if (!deletedModule) {
      deletedModule = db.modules.find((module) => module._id === moduleId);
    }
    if (!deletedModule) {
      return null;
    }
    db.modules = db.modules.filter((module) => module._id !== moduleId);
    return deletedModule;
  }

  function findModulesForCourse(courseId) {
    return db.modules.filter((module) => module.course === courseId);
  }

  return {
    createModule,
    findAllModules,
    findModulesForCourse,
    findModuleById,
    updateModule,
    deleteModule,
  };
}
