import { v4 as uuidv4 } from "uuid";
import CourseModel from "../courses/model.js";
import seedModules from "../database/modules.js";

export default function ModulesDao(db) {
  async function seedIfNeeded() {
    const courses = await CourseModel.find({ "modules.0": { $exists: false } });
    const modulesByCourse = {};
    seedModules.forEach((m) => {
      if (!modulesByCourse[m.course]) modulesByCourse[m.course] = [];
      modulesByCourse[m.course].push({
        _id: m._id,
        name: m.name,
        description: m.description,
        lessons: m.lessons,
      });
    });
    for (const course of courses) {
      if (modulesByCourse[course._id]) {
        await CourseModel.updateOne(
          { _id: course._id },
          { $set: { modules: modulesByCourse[course._id] } },
        );
      }
    }
  }

  async function findModulesForCourse(courseId) {
    await seedIfNeeded();
    const course = await CourseModel.findById(courseId);
    if (!course) return [];
    return course.modules;
  }

  async function findAllModules() {
    await seedIfNeeded();
    const courses = await CourseModel.find({});
    return courses.flatMap((course) => course.modules);
  }

  async function findModuleById(moduleId) {
    await seedIfNeeded();
    const course = await CourseModel.findOne({ "modules._id": moduleId });
    if (!course) return null;
    return course.modules.id(moduleId);
  }

  async function createModule(courseId, module) {
    const newModule = {
      _id: uuidv4(),
      name: module.name,
      description: module.description,
      lessons: module.lessons || [],
    };
    await CourseModel.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } },
    );
    return newModule;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await CourseModel.findById(courseId);
    if (!course) return null;
    const module = course.modules.id(moduleId);
    if (!module) return null;
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  }

  async function deleteModule(courseId, moduleId) {
    const result = await CourseModel.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } },
    );
    if (result.modifiedCount === 0) return null;
    return { _id: moduleId };
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
