import api from "./api";

export const submissionService = {
  getAllSubmission: (examId: string) =>
    api.get("/submissions", {
      params: {
        examId: examId,
      },
    }),
  getSubmissionsByClass: (classId: string) => api.get(`/submissions/class/${classId}`),

  listarSubmissao: (id: string) => api.get(`/submissions/${id}`),
  criarSubmissao: (examId: string, dados: { nome: string; arquivo: File }) => {
    const formData = new FormData();
    formData.append("examId", examId);

    const extensao = dados.arquivo.name.split(".").pop() || "jpg";
    const arquivoRenomeado = new File(
      [dados.arquivo],
      `${dados.nome}.${extensao}`,
      { type: dados.arquivo.type },
    );

    formData.append("files", arquivoRenomeado);

    return api.post("/submissions", formData);
  },

  getSubmissionAnswers: (submissionId: string) => api.get(`/submissions/${submissionId}/answers`),
};
