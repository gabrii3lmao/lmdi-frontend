import api from "./api";
import axios from "axios";
import type { SubmissionDetail } from "@/types/Submission";

interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export const submissionService = {
  getAllSubmission: (examId: string, page?: number, limit?: number, status?: string) =>
    api.get("/submissions", {
      params: { examId, page, limit, status },
    }),

  getSubmissionsByClass: (classId: string, page?: number, limit?: number) =>
    api.get(`/submissions/class/${classId}`, { params: { page, limit } }),

  listarSubmissao: (id: string) => api.get(`/submissions/${id}`),

  getUploadSignature: () =>
    api.get<UploadSignature>("/submissions/upload-signature"),

  uploadToCloudinary: async (
    file: File,
    signature: UploadSignature,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      formData,
    );

    return response.data.secure_url as string;
  },

  criarSubmissao: (
    examId: string,
    submissions: { studentName: string; imageUrl: string }[],
  ) => api.post("/submissions", { examId, submissions }),

  getSubmissionAnswers: (submissionId: string) =>
    api.get(`/submissions/${submissionId}/answers`),

  exportReport: (examId: string) =>
    api.get(`/submissions/${examId}/export`, { responseType: "blob" }),

  getAnalytics: (examId: string) =>
    api.get(`/submissions/${examId}/analytics`),

  atualizarSubmissao: (
    id: string,
    data: Partial<{
      studentName: string;
      score: number;
      totalCorrect: number;
      details: SubmissionDetail[];
    }>,
  ) => api.put(`/submissions/${id}`, data),

  deletarSubmissao: (id: string) => api.delete(`/submissions/${id}`),

  reprocessarSubmissao: (id: string) => api.post(`/submissions/${id}/reprocess`),

  reprocessarEmLote: (examId: string) => api.post(`/submissions/${examId}/batch-reprocess`),
};
