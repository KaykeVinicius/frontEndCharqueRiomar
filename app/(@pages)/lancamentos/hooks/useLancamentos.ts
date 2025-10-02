import { useState, useEffect } from "react";
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

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(
    null
  );

  // 🔹 Estado do form sem IDs iniciais falsos
  const [formData, setFormData] = useState<LancamentoForm>({});

  const [setores, setSetores] = useState<Setor[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    Promise.all([
      lancamentoApi.getAll(),
      setorApi.getAll(),
      categoriaApi.getAll(),
    ])
      .then(([lanc, sets, cats]) => {
        // Ordenar lançamentos por data (mais recentes primeiro)
        const lancamentosOrdenados = lanc.sort((a, b) => {
          const dataA = new Date(a.data).getTime();
          const dataB = new Date(b.data).getTime();
          return dataB - dataA; // Ordem decrescente (mais recente primeiro)
        });
        setLancamentos(lancamentosOrdenados);
        setSetores(sets);
        setCategorias(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
    
    const payload = { ...data, valor: valorNumerico };

    const created = await lancamentoApi.create(payload);
    
    // 🔹 Atualizar lista mantendo a ordenação
    const novosLancamentos = [...lancamentos, created].sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      return dataB - dataA;
    });
    
    novosLancamentos.forEach((l, i) => {
    });
    
    setLancamentos(novosLancamentos);
    return created;
  };

  const updateLancamento = async (id: number, data: LancamentoForm) => {
    
    validateLancamentoForm(data);
    const valorNumerico = parseFloat(
      data.valor!.replace(/\./g, "").replace(",", ".")
    );
    
    const payload = { ...data, valor: valorNumerico };

    const updated = await lancamentoApi.update(id, payload);

    // 🔹 Atualizar lista mantendo a ordenação
    const novosLancamentos = lancamentos.map((e) => (e.id === updated.id ? updated : e))
      .sort((a, b) => {
        const dataA = new Date(a.data).getTime();
        const dataB = new Date(b.data).getTime();
        return dataB - dataA;
      });
    
    novosLancamentos.forEach((l, i) => {
    });
    
    setLancamentos(novosLancamentos);
    return updated;
  };

  const deleteLancamento = async (id: number) => {
    await lancamentoApi.delete(id);
    // 🔹 Mantém a ordenação após deletar
    const novosLancamentos = lancamentos.filter((e) => e.id !== id)
      .sort((a, b) => {
        const dataA = new Date(a.data).getTime();
        const dataB = new Date(b.data).getTime();
        return dataB - dataA;
      });
    setLancamentos(novosLancamentos);
  };

  const formatValorForDisplay = (valor: number): string =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const filteredLancamentos = lancamentos.filter(
    (l) =>
      (l.data || "").includes(searchTerm) ||
      (l.valor || 0).toString().includes(searchTerm)
  );

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
  };
}