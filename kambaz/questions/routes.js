import QuestionsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";

export default function QuestionRoutes(app, db) {
  const dao = QuestionsDao(db);
  const quizzesDao = QuizzesDao(db);

  const currentUser = (req) => req.session["currentUser"];

  const requireAuth = (req, res) => {
    if (!currentUser(req)) {
      res.sendStatus(401);
      return false;
    }
    return true;
  };

  const requireFaculty = (req, res) => {
    const user = currentUser(req);
    if (!user) {
      res.sendStatus(401);
      return false;
    }
    if (user.role !== "FACULTY" && user.role !== "ADMIN") {
      res.sendStatus(403);
      return false;
    }
    return true;
  };

  // Strip correct-answer fields for students
  const stripAnswers = (question) => {
    const q = question.toObject ? question.toObject() : { ...question };
    if (q.choices) {
      q.choices = q.choices.map(({ text, _id }) => ({ text, _id }));
    }
    delete q.trueFalseAnswer;
    delete q.blanks;
    return q;
  };

  const findQuestionsForQuiz = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { quizId } = req.params;
    const questions = await dao.findQuestionsForQuiz(quizId);
    const user = currentUser(req);
    if (user.role !== "FACULTY" && user.role !== "ADMIN") {
      res.json(questions.map(stripAnswers));
    } else {
      res.json(questions);
    }
  };

  const createQuestion = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { quizId } = req.params;
    const question = await dao.createQuestion({ ...req.body, quiz: quizId });
    await quizzesDao.updateQuizPoints(quizId);
    res.json(question);
  };

  const findQuestionById = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { questionId } = req.params;
    const question = await dao.findQuestionById(questionId);
    if (!question) {
      res.status(404).send("Question not found");
      return;
    }
    res.json(question);
  };

  const updateQuestion = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { questionId } = req.params;
    const existing = await dao.findQuestionById(questionId);
    if (!existing) {
      res.status(404).send("Question not found");
      return;
    }
    const updated = await dao.updateQuestion(questionId, req.body);
    await quizzesDao.updateQuizPoints(existing.quiz);
    res.json(updated);
  };

  const deleteQuestion = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { questionId } = req.params;
    const existing = await dao.findQuestionById(questionId);
    if (!existing) {
      res.status(404).send("Question not found");
      return;
    }
    const deleted = await dao.deleteQuestion(questionId);
    await quizzesDao.updateQuizPoints(existing.quiz);
    res.json(deleted);
  };

  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.post("/api/quizzes/:quizId/questions", createQuestion);
  app.get("/api/questions/:questionId", findQuestionById);
  app.put("/api/questions/:questionId", updateQuestion);
  app.delete("/api/questions/:questionId", deleteQuestion);
}
