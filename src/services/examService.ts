import api from "./api";
import type { Exam } from "@/types/Exam";
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

  atualizarGabarito: (examData: Partial<Exam> & { _id: string }) =>
    api.put(`/exams/${examData._id}`, examData),

  deletarGabarito: (examId: string) => api.delete(`/exams/${examId}`),
};
