// app/(@pages)/lancamentos/hooks/useLancamentos.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import { lancamentoApi } from "../api/lancamentos";
import { setorApi } from "@/app/(@pages)/setores/api/setores";
import { categoriaApi } from "@/app/(@pages)/categorias/api/categoria";
import { Lancamento } from "@/app/@types/Lancamento";
import { Setor } from "@/app/@types/Setor";
import { Categoria } from "@/app/@types/Categoria";

// 🔹 Tipo de formulário interno (sem userId)
export type LancamentoForm = {
  setorId?: number;
  categoriaId?: number;
  data?: string;
  valor?: string;
};

interface PaginationData {
  count: number;
  page: number;
  items: number;
  pages: number;
  last: number;
  from: number;
  to: number;
  prev: number | null;
  next: number | null;
}

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null);

  // 🔹 Estados de paginação
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 🔹 Estado do form sem IDs iniciais falsos
  const [formData, setFormData] = useState<LancamentoForm>({});

  const [setores, setSetores] = useState<Setor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // 🔹 Carregar lançamentos com paginação
  useEffect(() => {
    loadLancamentos();
  }, [currentPage, itemsPerPage]);

  // 🔹 Carregar setores e categorias uma vez
  useEffect(() => {
    Promise.all([
      setorApi.getAll(),
      categoriaApi.getAll(),
    ])
      .then(([sets, cats]) => {
        setSetores(sets);
        setCategorias(cats);
      })
      .catch((err) => console.error("Erro ao carregar setores/categorias:", err));
  }, []);

  const loadLancamentos = async () => {
    setLoading(true);
    try {
      const response = await lancamentoApi.getAll({
        page: currentPage,
        per_page: itemsPerPage,
      });
      
      console.log("📦 Dados recebidos da API:", response); // 🔹 DEBUG
      
      // 🔹 CORREÇÃO: Usar os dados diretamente da resposta paginada
      setLancamentos(response.lancamentos || []);
      setPagination(response.pagination || null);
    } catch (error) {
      console.error("Erro ao carregar lançamentos:", error);
      // 🔹 Fallback: tentar carregar sem paginação se der erro
      try {
        const fallbackData = await lancamentoApi.getAll();
        setLancamentos(fallbackData.lancamentos || fallbackData || []);
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError);
        setLancamentos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Formatação de valor em Real
  const formatToReal = (value: string = ""): string => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const numberValue = parseInt(digits) / 100;
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, valor: formatToReal(value) }));
  };

  // 🔹 Validação do form antes de enviar
  const validateLancamentoForm = (data: LancamentoForm) => {
    if (!data.setorId) throw new Error("Selecione um setor");
    if (!data.categoriaId) throw new Error("Selecione uma categoria");
    if (!data.data) throw new Error("Informe a data");
    if (!data.valor) throw new Error("Informe o valor");
  };

  const createLancamento = async (data: LancamentoForm) => {
    validateLancamentoForm(data);
    const valorNumerico = parseFloat(
      data.valor!.replace(/\./g, "").replace(",", ".")
    );
    
    const payload = { 
      setorId: data.setorId!,
      categoriaId: data.categoriaId!,
      data: data.data!,
      valor: valorNumerico 
    };

    const created = await lancamentoApi.create(payload);
    
    // 🔹 Recarregar os dados com paginação
    await loadLancamentos();
    return created;
  };

  const updateLancamento = async (id: number, data: LancamentoForm) => {
    validateLancamentoForm(data);
    const valorNumerico = parseFloat(
      data.valor!.replace(/\./g, "").replace(",", ".")
    );
    
    const payload = { 
      setorId: data.setorId!,
      categoriaId: data.categoriaId!,
      data: data.data!,
      valor: valorNumerico 
    };

    const updated = await lancamentoApi.update(id, payload);

    // 🔹 Recarregar os dados com paginação
    await loadLancamentos();
    return updated;
  };

  const deleteLancamento = async (id: number) => {
    await lancamentoApi.delete(id);
    // 🔹 Recarregar os dados com paginação
    await loadLancamentos();
  };

  const formatValorForDisplay = (valor: number): string =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // 🔹 Filtro local para busca em tempo real
  const filteredLancamentos = useMemo(() => {
    if (!searchTerm.trim()) {
      return lancamentos;
    }

    const term = searchTerm.toLowerCase();
    return lancamentos.filter((lancamento) => {
      const dataStr = lancamento.data ? new Date(lancamento.data).toLocaleDateString('pt-BR') : '';
      const valorStr = lancamento.valor?.toString() || '';
      
      return (
        dataStr.includes(term) ||
        valorStr.includes(term) ||
        lancamento.setor?.nome?.toLowerCase().includes(term) ||
        lancamento.categoria?.nome?.toLowerCase().includes(term)
      );
    });
  }, [lancamentos, searchTerm]);

  // 🔹 Funções de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Volta para a primeira página
  };

  return {
    lancamentos,
    filteredLancamentos,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingLancamento,
    formData,
    setFormData,
    handleValorChange,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    setEditingLancamento,
    setores,
    categorias,
    formatValorForDisplay,
    // 🔹 Novos props de paginação
    pagination,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
}