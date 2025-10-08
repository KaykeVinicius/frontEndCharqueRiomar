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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Download, FileText, ChevronDown } from "lucide-react";
import { useLancamentos } from "../hooks/useLancamentos";
import { DatePickerWithRange } from "./date-range-picker";
import type { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as XLSX from "xlsx";
import { RelatorioPDF } from "./relatorio-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

// 🔹 Função para converter data sem problemas de fuso horário
const parseDataSemFuso = (dataString: string): Date => {
  if (!dataString) return new Date();
  const [year, month, day] = dataString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

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

// 🔹 Função para formatar data
const formatarDataParaExibicao = (dataString: string) => {
  if (!dataString) return "N/A";
  const data = parseDataSemFuso(dataString);
  return format(data, "dd/MM/yyyy", { locale: ptBR });
};

// 🔹 Componente para Select com busca
interface SelectWithSearchProps {
  options: Array<{ id: number; nome: string }>;
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder: string;
  label: string;
}

function SelectWithSearch({ options, value, onChange, placeholder, label }: SelectWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    const term = searchTerm.toLowerCase();
    return options.filter(option => 
      option.nome.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption ? selectedOption.nome : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-80">
            {/* Input de busca */}
            <div className="p-2 border-b">
              <Input
                placeholder={`Buscar ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
                autoFocus
              />
            </div>
            
            {/* Lista de opções */}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Nenhum resultado encontrado
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      option.id === value ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    {option.nome}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    pagination,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  } = useLancamentos();

  // 🔹 Estados para os filtros adicionais
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedSetor, setSelectedSetor] = useState("all");
  const [selectedCategoria, setSelectedCategoria] = useState("all");

  // 🔹 Estado para a modal de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<number | null>(null);

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
      dataMinima: null,
      dataMaxima: null
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
    const from = format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
    const to = format(dateRange.to, "dd/MM/yyyy", { locale: ptBR });
    return `${from} a ${to}`;
  }, [dateRange]);

  if (loading) return <p>Carregando lançamentos...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔹 CORREÇÃO TYPESCRIPT: Verificar se valor existe antes de usar
    if (!formData.valor) {
      alert("Por favor, insira um valor válido");
      return;
    }

    const valorNumerico = parseFloat(formData.valor.replace('.', '').replace(',', '.'));
    if (isNaN(valorNumerico)) {
      alert("Por favor, insira um valor válido");
      return;
    }

    if (editingLancamento)
      await updateLancamento(editingLancamento.id, formData);
    else 
      await createLancamento(formData);

    setFormData({}); // 🔹 Limpa o form corretamente
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
      valor: valorFormatado, // 🔹 Agora sempre tem valor
    });
    setIsDialogOpen(true);
  };

  // 🔹 Função para abrir a modal de confirmação de exclusão
  const handleOpenDeleteDialog = (id: number) => {
    setLancamentoToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // 🔹 Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (lancamentoToDelete) {
      await deleteLancamento(lancamentoToDelete);
      setIsDeleteDialogOpen(false);
      setLancamentoToDelete(null);
    }
  };

  // 🔹 Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setLancamentoToDelete(null);
  };

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
              onClick={() => setFormData({})} // 🔹 Limpa o form corretamente
              className="cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Setor com busca */}
                <SelectWithSearch
                  options={setores}
                  value={formData.setorId}
                  onChange={(setorId) => setFormData({ ...formData, setorId })}
                  placeholder="Selecione um setor"
                  label="Setor"
                />

                {/* Categoria com busca */}
                <SelectWithSearch
                  options={categorias}
                  value={formData.categoriaId}
                  onChange={(categoriaId) => setFormData({ ...formData, categoriaId })}
                  placeholder="Selecione uma categoria"
                  label="Categoria"
                />

                {/* Data */}
                <div className="grid gap-2">
                  <label htmlFor="data" className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    id="data"
                    value={formData.data || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, data: e.target.value })
                    }
                    required
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Modo demonstração: qualquer data permitida
                  </p>
                </div>

                {/* Valor */}
                <div className="grid gap-2">
                  <label htmlFor="valor" className="text-sm font-medium">Valor (R$)</label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    id="valor"
                    value={formData.valor || ""}
                    onChange={(e) => handleValorChange(e.target.value)}
                    placeholder="0,00"
                    required
                    className="text-right cursor-pointer"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  {editingLancamento ? "Salvar Alterações" : "Criar Lançamento"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card de Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os lançamentos por período, setor ou categoria</CardDescription>
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
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {Array.from(new Set(lancamentos.map((l) => l.setor?.nome).filter(Boolean))).map((setor) => (
                    <SelectItem key={setor} value={setor!} className="cursor-pointer">
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
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {Array.from(new Set(lancamentos.map((l) => l.categoria?.nome).filter(Boolean))).map((cat) => (
                    <SelectItem key={cat} value={cat!} className="cursor-pointer">
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
              className="cursor-pointer"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Lançamentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Lista de Lançamentos 
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({lancamentosFiltrados.length} de {pagination ? pagination.count : lancamentos.length} lançamentos)
                </span>
              </CardTitle>
              <CardDescription>
                {dateRange?.from && dateRange?.to ? `Período: ${textoPeriodo}` : "Todos os lançamentos"}
              </CardDescription>
            </div>
            
            {/* Botões de Exportação no lado direito do header */}
            <div className="flex gap-2">
              {lancamentosFiltrados.length > 0 ? (
                <PDFDownloadLink
                  document={<RelatorioPDF lancamentos={lancamentosFiltrados} titulo={textoPeriodo} />}
                  fileName={`lancamentos-charque-riomar-${new Date().toISOString().split("T")[0]}.pdf`}
                >
                  {({ loading }) => (
                    <Button variant="outline" size="sm" disabled={loading} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      {loading ? "Gerando..." : "PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button variant="outline" size="sm" disabled className="cursor-not-allowed">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(lancamentosFiltrados, textoPeriodo)}
                disabled={lancamentosFiltrados.length === 0}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>
          
          {/* Barra de busca mantida no mesmo lugar */}
          <div className="flex items-center space-x-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por data ou valor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm cursor-text"
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
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentosFiltrados.map((item) => (
                <TableRow key={item.id} className="cursor-default">
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
                      onClick={() => handleOpenDeleteDialog(item.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Componente de Paginação */}
          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {pagination.from} a {pagination.to} de {pagination.count} lançamentos
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => handleItemsPerPageChange(Number(value))}
                >
                  <SelectTrigger className="w-[120px] cursor-pointer">
                    <SelectValue placeholder="Itens por página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="20">20 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                    <SelectItem value="100">100 por página</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.prev}
                    className="cursor-pointer"
                  >
                    Anterior
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.next}
                    className="cursor-pointer"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              className="cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}