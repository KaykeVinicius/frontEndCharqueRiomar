import { api } from "@/lib/api";
import { Lancamento } from "@/app/@types/Lancamento";

interface PaginatedResponse<T> {
  lancamentos: T[];
  pagination: {
    count: number;
    page: number;
    items: number;
    pages: number;
    last: number;
    from: number;
    to: number;
    prev: number | null;
    next: number | null;
  };
}

export const lancamentoApi = {
  getAll: (params?: { 
    page?: number; 
    per_page?: number; 
    q?: any 
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    
    if (params?.q) {
      Object.keys(params.q).forEach(key => {
        if (params.q[key]) {
          queryParams.append(`q[${key}]`, params.q[key]);
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = `/lancamentos${queryString ? `?${queryString}` : ''}`;
    
    return api.get<PaginatedResponse<Lancamento>>(url);
  },
  
  getById: (id: number) => api.get<Lancamento>(`/lancamentos/${id}`),
  create: (data: Partial<Lancamento>) =>
    api.post<Lancamento>("/lancamentos", {
      lancamento: {
        setor_id: data.setorId,
        categoria_id: data.categoriaId,
        data: data.data,
        valor: data.valor,
      },
    }),

  update: (id: number, data: Partial<Lancamento>) =>
    api.put<Lancamento>(`/lancamentos/${id}`, {
      lancamento: {
        setor_id: data.setorId,
        categoria_id: data.categoriaId,
        data: data.data,
        valor: data.valor,
      },
    }),
  delete: (id: number) => api.delete(`/lancamentos/${id}`),
};