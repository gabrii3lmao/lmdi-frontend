import api from "./api";

export const turmaService = {
  getAll: () => api.get("/classes"),
  create: (nome: string) => api.post("/classes", { name: nome }),
  delete: (id: string) => api.delete(`/classes/${id}`),
  put: (id: string, nome: string) => api.put(`/classes/${id}`, { name: nome }),
};
