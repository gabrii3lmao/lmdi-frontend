import api from "./api";

export const examService = {
  createExam: (
    title: string,
    classId: string,
    questionsCount: number,
    choicesCount: number,
    answerKey: string[],
  ) =>
    api.post("/exams/", {
      title,
      classId,
      questionsCount,
      choicesCount,
      answerKey,
    }),

  listarGabaritosMestre: (classId: string) =>
    api.get(`/exams/class/${classId}`),
};
