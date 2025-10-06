import { api } from "@/lib/api"
import {Usuario } from "@/app/@types/Usuario"

export const UsuarioApi = {
  getAll: () => api.get<Usuario[]>("/usuarios"),
  getById: (id: number) => api.get<Usuario>(`/usuarios/${id}`),
  create: (data: Partial<Usuario>) => api.post<Usuario>("/usuarios", data),
  update: (id: number, data: Partial<Usuario>) => api.put<Usuario>(`/usuarios/${id}`, data),
  delete: (id: number) => api.delete(`/usuarios/${id}`),
}