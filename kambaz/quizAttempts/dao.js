import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import seedAttempts from "../database/quizAttempts.js";

export default function QuizAttemptsDao(db) {
  async function seedIfNeeded() {
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(seedAttempts);
    }
  }

  const countAttempts = async (quizId, userId) => {
    await seedIfNeeded();
    return model.countDocuments({ quiz: quizId, user: userId });
  };

  const createAttempt = async (attempt) => {
    const attemptNumber = (await countAttempts(attempt.quiz, attempt.user)) + 1;
    return model.create({ ...attempt, _id: uuidv4(), attemptNumber });
  };

  const findAttemptsForQuizAndUser = async (quizId, userId) => {
    await seedIfNeeded();
    return model.find({ quiz: quizId, user: userId }).sort({ attemptNumber: 1 });
  };

  const findLatestAttempt = async (quizId, userId) => {
    await seedIfNeeded();
    return model
      .findOne({ quiz: quizId, user: userId })
      .sort({ attemptNumber: -1 });
  };

  const deleteAttemptsForQuiz = async (quizId) => {
    return model.deleteMany({ quiz: quizId });
  };

  return {
    createAttempt,
    findAttemptsForQuizAndUser,
    findLatestAttempt,
    countAttempts,
    deleteAttemptsForQuiz,
  };
}
