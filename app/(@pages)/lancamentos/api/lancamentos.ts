import { api } from "@/lib/api"
import { Lancamento } from "@/app/@types/Lancamento"

export const lancamentoApi = {
  getAll: () => api.get<Lancamento[]>("/lancamentos"),
  getById: (id: number) => api.get<Lancamento>(`/lancamentos/${id}`),
  create: (data: Partial<Lancamento>) =>
    api.post<Lancamento>("/lancamentos", { lancamento: {
      setor_id: data.setorId,
      user_id: data.userId,
      categoria_id: data.categoriaId,
      data: data.data,
      valor: data.valor
    } }),
  update: (id: number, data: Partial<Lancamento>) =>
    api.put<Lancamento>(`/lancamentos/${id}`, { lancamento: {
      setor_id: data.setorId,
      user_id: data.userId,
      categoria_id: data.categoriaId,
      data: data.data,
      valor: data.valor
    } }),
  delete: (id: number) => api.delete(`/lancamentos/${id}`),
}
