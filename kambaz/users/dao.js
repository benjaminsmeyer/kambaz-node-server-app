import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
  };

  const findUserByUsername = (username) =>
    db.users.find((user) => user.username === username);

  const findAllUsers = () => db.users;

  const findUserById = (userId) => db.users.find((user) => user._id === userId);

  const findUserByCredentials = (username, password) =>
    db.users.find(
      (user) => user.username === username && user.password === password,
    );

  const findUsersForCourse = (courseId) => {
    const enrolledUserIds = new Set(
      db.enrollments
        .filter((enrollment) => enrollment.course === courseId)
        .map((enrollment) => enrollment.user),
    );
    return db.users.filter((user) => enrolledUserIds.has(user._id));
  };

  const updateUser = (userId, userUpdates) => {
    let updatedUser = null;
    db.users = db.users.map((user) => {
      if (user._id !== userId) {
        return user;
      }
      updatedUser = { ...user, ...userUpdates, _id: userId };
      return updatedUser;
    });
    return updatedUser;
  };

  const deleteUser = (userId) => {
    const user = findUserById(userId);
    if (!user) {
      return null;
    }
    db.users = db.users.filter((u) => u._id !== userId);
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment.user !== userId,
    );
    return user;
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUsersForCourse,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
