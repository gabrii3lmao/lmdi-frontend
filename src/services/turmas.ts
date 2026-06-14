import api from "./api";

export const turmaService = {
  getAll: (page?: number, limit?: number) =>
    api.get("/classes", { params: { page, limit } }),
  create: (nome: string) => api.post("/classes", { name: nome }),
  delete: (id: string) => api.delete(`/classes/${id}`),
  put: (id: string, nome: string) => api.put(`/classes/${id}`, { name: nome }),
};
