import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  const findUsersByRole = (role) => model.find({ role: role });
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>
    model.findOne({ username: username });
  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });
  const findUsersForCourse = (courseId) => {
    const enrolledUserIds = db.enrollments
      .filter((enrollment) => enrollment.course === courseId)
      .map((enrollment) => enrollment.user);
    return model.find({ _id: { $in: enrolledUserIds } });
  };
  const updateUser = (userId, user) =>
    model.findByIdAndUpdate(userId, { $set: user }, { new: true });
  const deleteUser = (userId) => model.findByIdAndDelete(userId);
  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUsersForCourse,
    findUserByUsername,
    findUserByCredentials,
    findUsersByPartialName,
    updateUser,
    findUsersByRole,
    deleteUser,
  };
}
