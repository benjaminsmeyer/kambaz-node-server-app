export function gradeAttempt(questions, studentAnswers) {
  const answerMap = new Map(
    (studentAnswers ?? []).map((a) => [String(a.question), a]),
  );
  let score = 0;
  let totalPoints = 0;

  const answers = questions.map((q) => {
    totalPoints += q.points;
    const a = answerMap.get(String(q._id)) ?? {};
    let isCorrect = false;

    if (q.type === "Multiple Choice") {
      const correctChoice = q.choices.find((c) => c.isCorrect);
      isCorrect =
        correctChoice != null && correctChoice.text === a.selectedChoice;
    } else if (q.type === "True/False") {
      isCorrect = a.trueFalseAnswer === q.trueFalseAnswer;
    } else if (q.type === "Fill in the Blank") {
      const submitted = (a.blankAnswer ?? "").toLowerCase().trim();
      isCorrect =
        submitted.length > 0 &&
        (q.blanks ?? []).some(
          (b) => b.toLowerCase().trim() === submitted,
        );
    }

    const pointsEarned = isCorrect ? q.points : 0;
    score += pointsEarned;

    return {
      question: q._id,
      selectedChoice: a.selectedChoice ?? null,
      trueFalseAnswer: a.trueFalseAnswer ?? null,
      blankAnswer: a.blankAnswer ?? null,
      isCorrect,
      pointsEarned,
    };
  });

  return { answers, score, totalPoints };
}
