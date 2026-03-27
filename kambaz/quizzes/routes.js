import QuizzesDao from "./dao.js";
import QuestionsDao from "../questions/dao.js";
import QuizAttemptsDao from "../quizAttempts/dao.js";

export default function QuizRoutes(app, db) {
  const quizzesDao = QuizzesDao(db);
  const questionsDao = QuestionsDao(db);
  const attemptsDao = QuizAttemptsDao(db);

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

  const findQuizzesForCourse = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { courseId } = req.params;
    const user = currentUser(req);
    const publishedOnly = user.role !== "FACULTY" && user.role !== "ADMIN";
    const quizzes = await quizzesDao.findQuizzesForCourse(courseId, publishedOnly);
    res.json(quizzes);
  };

  const createQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { courseId } = req.params;
    const user = currentUser(req);
    const quiz = await quizzesDao.createQuiz({
      ...req.body,
      course: courseId,
      createdBy: user._id,
    });
    res.json(quiz);
  };

  const findQuizById = async (req, res) => {
    if (!requireAuth(req, res)) return;
    const { quizId } = req.params;
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      res.status(404).send("Quiz not found");
      return;
    }
    res.json(quiz);
  };

  const updateQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { quizId } = req.params;
    const updated = await quizzesDao.updateQuiz(quizId, req.body);
    if (!updated) {
      res.status(404).send("Quiz not found");
      return;
    }
    res.json(updated);
  };

  const deleteQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { quizId } = req.params;
    await questionsDao.deleteQuestionsForQuiz(quizId);
    await attemptsDao.deleteAttemptsForQuiz(quizId);
    const deleted = await quizzesDao.deleteQuiz(quizId);
    if (!deleted) {
      res.status(404).send("Quiz not found");
      return;
    }
    res.json(deleted);
  };

  const publishQuiz = async (req, res) => {
    if (!requireFaculty(req, res)) return;
    const { quizId } = req.params;
    const { published } = req.body;
    const updated = await quizzesDao.publishQuiz(quizId, published);
    if (!updated) {
      res.status(404).send("Quiz not found");
      return;
    }
    res.json(updated);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
}
