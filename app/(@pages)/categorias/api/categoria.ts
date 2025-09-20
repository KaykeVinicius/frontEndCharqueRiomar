import { api } from "@/lib/api"
import { Categoria } from "@/app/@types/Categoria"

export const categoriaApi = {
  getAll: () => api.get<Categoria[]>("/categorias"),
  getById: (id: number) => api.get<Categoria>(`/categorias/${id}`),
  create: (data: Partial<Categoria>) => api.post<Categoria>("/categorias", data),
  update: (id: number, data: Partial<Categoria>) => api.put<Categoria>(`/categorias/${id}`, data),
  delete: (id: number) => api.delete(`/categorias/${id}`),
}
