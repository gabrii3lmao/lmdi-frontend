import api from "./api";

export const examService = {
  getAllSubmission: (examId: string) =>
    api.get("/exams/submission", {
      params: {
        examId: examId,
      },
    }),
  createExam: (
    title: string,
    classId: string,
    questionsCount: number,
    choicesCount: number,
    answerKey: string[],
  ) =>
    api.post("/exams/create-exam", {
      title,
      classId,
      questionsCount,
      choicesCount,
      answerKey,
    }),

  listarSubmissao: (id: string) => api.get(`/exams/${id}`),

  criarSubmissao: (examId: string, imagens: File[]) => {
    const formData = new FormData();

    formData.append("examId", examId);

    imagens.forEach((imagem) => {
      formData.append("files", imagem);
    });

    return api.post("/exams/submission", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  listarGabaritosMestre: (classId: string) => api.get(`/exams/${classId}`),
};
