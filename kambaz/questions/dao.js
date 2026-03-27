import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import seedQuestions from "../database/questions.js";

export default function QuestionsDao(db) {
  async function seedIfNeeded() {
    const count = await model.countDocuments();
    if (count === 0) {
      await model.insertMany(seedQuestions);
    }
  }

  const createQuestion = async (question) => {
    await seedIfNeeded();
    return model.create({ ...question, _id: uuidv4() });
  };

  const findQuestionsForQuiz = async (quizId) => {
    await seedIfNeeded();
    return model.find({ quiz: quizId }).sort({ order: 1 });
  };

  const findQuestionById = async (questionId) => {
    await seedIfNeeded();
    return model.findById(questionId);
  };

  const updateQuestion = async (questionId, updates) => {
    return model.findByIdAndUpdate(
      questionId,
      { $set: updates },
      { new: true },
    );
  };

  const deleteQuestion = async (questionId) => {
    return model.findByIdAndDelete(questionId);
  };

  const deleteQuestionsForQuiz = async (quizId) => {
    return model.deleteMany({ quiz: quizId });
  };

  return {
    createQuestion,
    findQuestionsForQuiz,
    findQuestionById,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsForQuiz,
  };
}
