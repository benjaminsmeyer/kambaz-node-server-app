import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import QuestionModel from "../questions/model.js";
import seedQuizzes from "../database/quizzes.js";

export default function QuizzesDao(db) {
  async function seedIfNeeded() {
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(seedQuizzes);
    }
  }

  const createQuiz = async (quiz) => {
    await seedIfNeeded();
    return model.create({ ...quiz, _id: uuidv4() });
  };

  const findQuizzesForCourse = async (courseId, publishedOnly = false) => {
    await seedIfNeeded();
    const filter = { course: courseId };
    if (publishedOnly) filter.published = true;
    return model.find(filter);
  };

  const findQuizById = async (quizId) => {
    await seedIfNeeded();
    return model.findById(quizId);
  };

  const updateQuiz = async (quizId, quizUpdates) => {
    return model.findByIdAndUpdate(
      quizId,
      { $set: quizUpdates },
      { new: true },
    );
  };

  const deleteQuiz = async (quizId) => {
    return model.findByIdAndDelete(quizId);
  };

  const publishQuiz = async (quizId, published) => {
    return model.findByIdAndUpdate(
      quizId,
      { $set: { published } },
      { new: true },
    );
  };

  const updateQuizPoints = async (quizId) => {
    const [result] = await QuestionModel.aggregate([
      { $match: { quiz: quizId } },
      { $group: { _id: null, totalPoints: { $sum: "$points" }, count: { $sum: 1 } } },
    ]);
    const { totalPoints = 0, count = 0 } = result ?? {};
    return model.findByIdAndUpdate(
      quizId,
      { $set: { points: totalPoints, numberOfQuestions: count } },
      { new: true },
    );
  };

  return {
    createQuiz,
    findQuizzesForCourse,
    findQuizById,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    updateQuizPoints,
  };
}
