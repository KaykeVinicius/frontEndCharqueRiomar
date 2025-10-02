"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Download, FileText } from "lucide-react";
import { useLancamentos } from "../hooks/useLancamentos";
import { DatePickerWithRange } from "./date-range-picker";
import type { DateRange } from "react-day-picker";
import { startOfDay, endOfDay } from "date-fns";
import * as XLSX from "xlsx";
import { RelatorioPDF } from "./relatorio-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

// 🔹 Função de Exportação Excel
const exportToExcel = (lancamentos: any[], periodo: string) => {
  if (lancamentos.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["BIG CHARQUE INDUSTRIA E COMERCIO LTDA", "", "", "RELATÓRIO DE LANÇAMENTOS"],
        ["CNPJ: 05.434.424/0001-88", "", "", ""],
        ["Rua Pedro Spagnol, 4234 - Teixeirão", "", "", ""],
        ["Cacoal - RO | CEP: 76965-598", "", "", ""],
        ["Telefone: (69) 3443-2920", "", "", ""],
        ["E-mail: comercial@charqueriomar.com.br", "", "", ""],
        [],
        ["PERÍODO:", periodo, "", `Total de lançamentos: ${lancamentos.length}`],
        [],
      ],
      { origin: "A1" },
    );

    XLSX.utils.sheet_add_aoa(worksheet, [["SETOR", "CATEGORIA", "DATA", "VALOR (R$)"]], { origin: "A10" });

    const dadosFormatados = lancamentos.map((lancamento) => [
      lancamento.setor?.nome || "N/A",
      lancamento.categoria?.nome || "N/A",
      formatarDataParaExibicao(lancamento.data),
      Number(lancamento.valor || 0),
    ]);

    XLSX.utils.sheet_add_aoa(worksheet, dadosFormatados, { origin: "A11" });

    const linhaTotal = 11 + lancamentos.length;
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["", "", "TOTAL GERAL", lancamentos.reduce((acc, l) => acc + Number(l.valor || 0), 0)]],
      { origin: `A${linhaTotal}` },
    );

    worksheet["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Lançamentos");
    const fileName = `relatorio-lancamentos-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Erro ao gerar Excel. Tente novamente.");
  }
};

export function LancamentosContent() {
  const {
    lancamentos,
    filteredLancamentos: originalFiltered,
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
  } = useLancamentos();

  // 🔹 Estados para os filtros adicionais
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSetor, setSelectedSetor] = useState("all");
  const [selectedCategoria, setSelectedCategoria] = useState("all");

  // 🔹 Função para formatar data sem problemas de fuso horário
  const formatarDataParaExibicao = (dataString: string) => {
    if (!dataString) return "N/A";
    
    const [year, month, day] = dataString.split('-');
    const data = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return data.toLocaleDateString("pt-BR");
  };

  // 🔹 Função para converter data sem problemas de fuso horário (para filtro)
  const parseDataSemFuso = (dataString: string): Date => {
    if (!dataString) return new Date();
    
    const [year, month, day] = dataString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // 🔹 Função para formatar valor como moeda brasileira
  const formatarValorParaExibicao = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 🔹 Função para calcular as datas permitidas (para novo lançamento)
  const getDatasPermitidas = () => {
    const hoje = new Date();
    const duasDiasAtras = new Date();
    duasDiasAtras.setDate(hoje.getDate() - 2);
    
    return {
      dataMinima: duasDiasAtras.toISOString().split('T')[0],
      dataMaxima: hoje.toISOString().split('T')[0]
    };
  };

  // 🔹 Filtros aplicados em tempo real
  const lancamentosFiltrados = useMemo(() => {
    let filtered = originalFiltered;

    // Filtro por período
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((lancamento) => {
        const dataLancamento = parseDataSemFuso(lancamento.data);
        const fromDate = startOfDay(dateRange.from!);
        const toDate = endOfDay(dateRange.to!);

        return dataLancamento >= fromDate && dataLancamento <= toDate;
      });
    }

    // Filtro por setor
    if (selectedSetor !== "all") {
      filtered = filtered.filter((l) => l.setor?.nome === selectedSetor);
    }

    // Filtro por categoria
    if (selectedCategoria !== "all") {
      filtered = filtered.filter((l) => l.categoria?.nome === selectedCategoria);
    }

    return filtered;
  }, [originalFiltered, dateRange, selectedSetor, selectedCategoria]);

  const { dataMinima, dataMaxima } = getDatasPermitidas();
  const textoPeriodo = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return "Todos os períodos";
    const from = dateRange.from.toLocaleDateString("pt-BR");
    const to = dateRange.to.toLocaleDateString("pt-BR");
    return `${from} a ${to}`;
  }, [dateRange]);

  if (loading) return <p>Carregando lançamentos...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔹 Validação da data antes de enviar
    const dataSelecionada = new Date(formData.data + 'T00:00:00');
    const hoje = new Date();
    const duasDiasAtras = new Date();
    duasDiasAtras.setDate(hoje.getDate() - 2);
    
    hoje.setHours(0, 0, 0, 0);
    duasDiasAtras.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);
    
    if (dataSelecionada > hoje) {
      alert("❌ Não é permitido lançar em datas futuras!");
      return;
    }
    
    if (dataSelecionada < duasDiasAtras) {
      alert("❌ Só é permitido lançar até 2 dias antes da data atual!");
      return;
    }

    if (editingLancamento)
      await updateLancamento(editingLancamento.id, formData);
    else await createLancamento(formData);

    setFormData({ setorId: 0, categoriaId: 0, data: "", valor: "" });
    setEditingLancamento(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingLancamento(item);
    const valorFormatado = (item.valor || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setFormData({
      setorId: item.setorId,
      categoriaId: item.categoriaId,
      data: item.data,
      valor: valorFormatado,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => deleteLancamento(id);

  return (
    <div className="space-y-6">
      {/* Header + Botão */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os lançamentos do sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setFormData({ setorId: 0, categoriaId: 0, data: "", valor: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Setor */}
                <div className="grid gap-2">
                  <label htmlFor="setorId">Setor</label>
                  <select
                    id="setorId"
                    value={formData.setorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        setorId: Number(e.target.value),
                      })
                    }
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0">Selecione um setor</option>
                    {setores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoria */}
                <div className="grid gap-2">
                  <label htmlFor="categoriaId">Categoria</label>
                  <select
                    id="categoriaId"
                    value={formData.categoriaId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoriaId: Number(e.target.value),
                      })
                    }
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="0">Selecione uma categoria</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div className="grid gap-2">
                  <label htmlFor="data">Data</label>
                  <Input
                    type="date"
                    id="data"
                    value={formData.data}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    min={dataMinima}
                    max={dataMaxima}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Permitido apenas lançamentos de {formatarDataParaExibicao(dataMinima)} até {formatarDataParaExibicao(dataMaxima)}
                  </p>
                </div>

                {/* Valor */}
                <div className="grid gap-2">
                  <label htmlFor="valor">Valor (R$)</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    id="valor"
                    value={formData.valor}
                    onChange={(e) => handleValorChange(e.target.value)}
                    placeholder="0,00"
                    required
                    className="text-right"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingLancamento ? "Salvar Alterações" : "Criar Lançamento"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card de Filtros e Exportação */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Exportação</CardTitle>
          <CardDescription>Filtre os lançamentos e exporte em PDF ou Excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap items-end">
            {/* Filtro de Período */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>

            {/* Filtro de Setor */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Setor</label>
              <Select value={selectedSetor} onValueChange={setSelectedSetor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {Array.from(new Set(lancamentos.map((l) => l.setor?.nome).filter(Boolean))).map((setor) => (
                    <SelectItem key={setor} value={setor!}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Categoria */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {Array.from(new Set(lancamentos.map((l) => l.categoria?.nome).filter(Boolean))).map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            <Button
              variant="outline"
              onClick={() => {
                setDateRange(undefined);
                setSelectedSetor("all");
                setSelectedCategoria("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>

          {/* Botões de Exportação */}
          <div className="flex justify-end gap-2 mt-4">
            {lancamentosFiltrados.length > 0 ? (
              <PDFDownloadLink
                document={<RelatorioPDF lancamentos={lancamentosFiltrados} titulo={textoPeriodo} />}
                fileName={`lancamentos-charque-riomar-${new Date().toISOString().split("T")[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" disabled={loading} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    {loading ? "Gerando PDF..." : "Exportar PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button variant="outline" disabled className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => exportToExcel(lancamentosFiltrados, textoPeriodo)}
              disabled={lancamentosFiltrados.length === 0}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Lançamentos 
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({lancamentosFiltrados.length} de {lancamentos.length} lançamentos)
            </span>
          </CardTitle>
          <CardDescription>
            {dateRange?.from && dateRange?.to ? `Período: ${textoPeriodo}` : "Todos os lançamentos"}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por data ou valor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentosFiltrados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.setor?.nome || "N/A"}</TableCell>
                  <TableCell>{item.categoria?.nome || "N/A"}</TableCell>
                  <TableCell>
                    {formatarDataParaExibicao(item.data)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatarValorParaExibicao(Number(item.valor || 0))}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function formatarDataParaExibicao(data: any): any {
  throw new Error("Function not implemented.");
}
