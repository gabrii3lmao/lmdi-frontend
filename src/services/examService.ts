import api from "./api";

export const examService = {
  getAllSubmission: () => api.get("/exam/submission"),
  createExam: (
    title: string,
    classId: string,
    questionCount: number,
    choicesCount: number,
    answerKey: string[],
  ) =>
    api.post("/exam/create-exam", {
      title,
      classId,
      questionCount,
      choicesCount,
      answerKey,
    }),
  listarSubmissao: (id: string) => api.get(`/exam/${id}`),
  criarSubmissao: (examId: string, imagens: File[]) => {
    const formData = new FormData();

    imagens.forEach((imagem) => {
      formData.append("files", imagem);
    });

    return api.post("/exam/submission", { examId: examId, formData });
  },
};
