import api from "./api";

export const examService = {
  // CORRIGIDO: Rota mudada de /exams para /submissions
  getAllSubmission: (examId: string) =>
    api.get("/submissions", {
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
    api.post("/exams/", {
      title,
      classId,
      questionsCount,
      choicesCount,
      answerKey,
    }),

  listarSubmissao: (id: string) => api.get(`/submissions/${id}`),

  criarSubmissao: (examId: string, imagens: File[]) => {
    const formData = new FormData();

    formData.append("examId", examId);

    imagens.forEach((imagem) => {
      formData.append("files", imagem);
    });

    return api.post("/submissions", formData);
  },

  // CORRIGIDO: Adicionado o "/class/" no caminho da URL
  listarGabaritosMestre: (classId: string) =>
    api.get(`/exams/class/${classId}`),
};
