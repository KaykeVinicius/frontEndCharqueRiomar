import { api } from "@/lib/api"
import { Setor } from "@/app/@types/Setor"

export const setorApi = {
  getAll: () => api.get<Setor[]>("/setores"),
  getById: (id: number) => api.get<Setor>(`/setores/${id}`),
  create: (data: Partial<Setor>) => api.post<Setor>("/setores", data),
  update: (id: number, data: Partial<Setor>) => api.put<Setor>(`/setores/${id}`, data),
  delete: (id: number) => api.delete(`/setores/${id}`),
}
