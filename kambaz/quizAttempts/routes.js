import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";
import QuestionsDao from "../questions/dao.js";
import { gradeAttempt } from "./grading.js";

export default function QuizAttemptRoutes(app, db) {
  const dao = QuizAttemptsDao(db);
  const quizzesDao = QuizzesDao(db);
  const questionsDao = QuestionsDao(db);

  const currentUser = (req) => req.session["currentUser"];

  const requireAuth = (req, res) => {
    if (!currentUser(req)) {
      res.sendStatus(401);
      return false;
    }
    return true;
  };

  const submitAttempt = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { quizId } = req.params;
    const user = currentUser(req);

    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      res.status(404).send("Quiz not found");
      return;
    }
    if (!quiz.published) {
      res.sendStatus(403);
      return;
    }

    if (quiz.accessCode && quiz.accessCode !== "" && req.body.accessCode !== quiz.accessCode) {
      res.status(403).send("Invalid access code");
      return;
    }

    const attemptCount = await dao.countAttempts(quizId, user._id);
    if (!quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      res.status(403).send("Maximum attempts reached");
      return;
    }

    const questions = await questionsDao.findQuestionsForQuiz(quizId);
    const { answers, score, totalPoints } = gradeAttempt(questions, req.body.answers);

    const attempt = await dao.createAttempt({
      quiz: quizId,
      user: user._id,
      course: quiz.course,
      answers,
      score,
      totalPoints,
    });

    res.json(attempt);
  };

  const getAttempts = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { quizId } = req.params;
    const user = currentUser(req);
    const attempts = await dao.findAttemptsForQuizAndUser(quizId, user._id);
    res.json(attempts);
  };

  const getLatestAttempt = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { quizId } = req.params;
    const user = currentUser(req);
    const attempt = await dao.findLatestAttempt(quizId, user._id);
    if (!attempt) {
      res.status(404).send("No attempts found");
      return;
    }
    res.json(attempt);
  };

  // /latest must be registered before any future /:attemptId route
  app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
  app.get("/api/quizzes/:quizId/attempts", getAttempts);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
