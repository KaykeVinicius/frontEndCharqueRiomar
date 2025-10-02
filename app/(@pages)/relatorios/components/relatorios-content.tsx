"use client"

import { useMemo, useState } from "react"
import { useLancamentos } from "../../lancamentos/hooks/useLancamentos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import * as XLSX from "xlsx"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { DatePickerWithRange } from "./date-range-picker"
import type { DateRange } from "react-day-picker"
import { startOfDay, endOfDay, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { RelatorioSetoresPDF } from "./relatorio-setores-pdf"
import { RelatorioCategoriasPDF } from "./relatorio-categorias-pdf"

// 🔹 Função para converter data sem problemas de fuso horário
const parseDataSemFuso = (dataString: string): Date => {
  if (!dataString) return new Date();
  const [year, month, day] = dataString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

// 🔹 Função para exportar Excel de Gastos por Setor
const exportSetoresExcel = (pieData: any[], periodo: string, lancamentosFiltrados: any[]) => {
  if (pieData.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Cabeçalho
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["BIG CHARQUE INDUSTRIA E COMERCIO LTDA", "", "", "RELATÓRIO DE GASTOS POR SETOR"],
        ["CNPJ: 05.434.424/0001-88", "", "", ""],
        ["PERÍODO:", periodo, "", ""],
        [],
        ["SETOR", "VALOR TOTAL (R$)", "QUANTIDADE DE LANÇAMENTOS", "VALOR MÉDIO (R$)"],
      ],
      { origin: "A1" }
    );

    // Ordenar por valor (maior para menor)
    const dadosOrdenados = [...pieData]
      .sort((a, b) => b.value - a.value)
      .map((item) => {
        const qtdLancamentos = lancamentosFiltrados.filter(l => l.setor?.nome === item.name).length;
        const valorMedio = qtdLancamentos > 0 ? Number(item.value) / qtdLancamentos : 0;
        
        return [
          item.name,
          item.value,
          qtdLancamentos,
          valorMedio
        ];
      });

    XLSX.utils.sheet_add_aoa(worksheet, dadosOrdenados, { origin: "A6" });

    // Total geral
    const totalGeral = pieData.reduce((sum, item) => sum + item.value, 0);
    const linhaTotal = 6 + dadosOrdenados.length;
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["TOTAL GERAL", totalGeral, lancamentosFiltrados.length, totalGeral / lancamentosFiltrados.length || 0]],
      { origin: `A${linhaTotal}` }
    );

    worksheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos por Setor");
    const fileName = `gastos-por-setor-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Erro ao gerar Excel. Tente novamente.");
  }
};

// 🔹 Função para exportar Excel de Gastos por Categoria
const exportCategoriasExcel = (barData: any[], periodo: string, lancamentosFiltrados: any[]) => {
  if (barData.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Cabeçalho
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        ["BIG CHARQUE INDUSTRIA E COMERCIO LTDA", "", "", "RELATÓRIO DE GASTOS POR CATEGORIA"],
        ["CNPJ: 05.434.424/0001-88", "", "", ""],
        ["PERÍODO:", periodo, "", ""],
        [],
        ["CATEGORIA", "VALOR TOTAL (R$)", "QUANTIDADE DE LANÇAMENTOS", "VALOR MÉDIO (R$)"],
      ],
      { origin: "A1" }
    );

    // Calcular totais por categoria
    const categoriasTotals = lancamentosFiltrados.reduce((acc, l) => {
      const catNome = l.categoria?.nome || "Outros";
      if (!acc[catNome]) {
        acc[catNome] = { total: 0, count: 0 };
      }
      acc[catNome].total += Number(l.valor || 0);
      acc[catNome].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // Ordenar por valor (maior para menor)
    const dadosOrdenados = Object.entries(categoriasTotals)
      .map(([name, data]) => {
        const typedData = data as { total: number; count: number };
        return {
          name,
          total: typedData.total,
          count: typedData.count,
          media: typedData.count > 0 ? typedData.total / typedData.count : 0
        };
      })
      .sort((a, b) => b.total - a.total)
      .map((item) => [
        item.name,
        item.total,
        item.count,
        item.media
      ]);

    XLSX.utils.sheet_add_aoa(worksheet, dadosOrdenados, { origin: "A6" });

    // Total geral
    const totalGeral: number = (Object.values(categoriasTotals) as { total: number; count: number }[]).reduce((sum, data) => sum + data.total, 0);
    const totalLancamentos = lancamentosFiltrados.length;
    const linhaTotal = 6 + dadosOrdenados.length;
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["TOTAL GERAL", totalGeral, totalLancamentos, totalLancamentos ? totalGeral / totalLancamentos : 0]],
      { origin: `A${linhaTotal}` }
    );

    worksheet["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos por Categoria");
    const fileName = `gastos-por-categoria-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Erro ao gerar Excel. Tente novamente.");
  }
};

export default function RelatoriosContent() {
  const { lancamentos, loading } = useLancamentos()
  const safeLancamentos = Array.isArray(lancamentos) ? lancamentos : []

  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSetor, setSelectedSetor] = useState("all")
  const [selectedCategoria, setSelectedCategoria] = useState("all")

  const lancamentosFiltrados = useMemo(() => {
    let filtered = safeLancamentos

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((lancamento) => {
        const dataLancamento = parseDataSemFuso(lancamento.data);
        const fromDate = startOfDay(dateRange.from!);
        const toDate = endOfDay(dateRange.to!);
        return dataLancamento >= fromDate && dataLancamento <= toDate;
      });
    }

    if (selectedSetor !== "all") {
      filtered = filtered.filter((l) => l.setor?.nome === selectedSetor)
    }

    if (selectedCategoria !== "all") {
      filtered = filtered.filter((l) => l.categoria?.nome === selectedCategoria)
    }

    return filtered
  }, [safeLancamentos, dateRange, selectedSetor, selectedCategoria])

  const textoPeriodo = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return "Todos os períodos"
    const from = format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
    const to = format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
    return `${from} a ${to}`
  }, [dateRange])

  // 🔹 Dados para Gastos por Setor (ordenados do maior para menor)
  const pieData = useMemo(() => {
    const setorTotals = lancamentosFiltrados.reduce(
      (acc, l) => {
        const setorNome = l.setor?.nome || "Outros"
        acc[setorNome] = (acc[setorNome] || 0) + Number(l.valor || 0)
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(setorTotals)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value); // Ordenar do maior para menor
  }, [lancamentosFiltrados])

  // 🔹 Dados para Gastos por Categoria
  const barData = useMemo(() => {
    const categoriasSetores: Record<string, Record<string, number>> = {}

    lancamentosFiltrados.forEach((l) => {
      const cat = l.categoria?.nome || "Outros"
      const setor = l.setor?.nome || "Outros"
      if (!categoriasSetores[cat]) categoriasSetores[cat] = {}
      categoriasSetores[cat][setor] = (categoriasSetores[cat][setor] || 0) + Number(l.valor || 0)
    })

    return Object.entries(categoriasSetores).map(([cat, setores]) => ({
      name: cat,
      ...setores,
    }))
  }, [lancamentosFiltrados])

  // 🔹 Dados para Evolução Temporal
  const timelineData = useMemo(() => {
    const gastosPorData: Record<string, number> = {}

    lancamentosFiltrados.forEach((l) => {
      const dataObj = parseDataSemFuso(l.data);
      const dataFormatada = format(dataObj, "dd/MM", { locale: ptBR });
      gastosPorData[dataFormatada] = (gastosPorData[dataFormatada] || 0) + Number(l.valor || 0)
    })

    return Object.entries(gastosPorData)
      .map(([data, valor]) => ({ data, valor }))
      .sort((a, b) => {
        const [diaA, mesA] = a.data.split("/").map(Number)
        const [diaB, mesB] = b.data.split("/").map(Number)
        return mesA !== mesB ? mesA - mesB : diaA - diaB
      })
  }, [lancamentosFiltrados])

  const COLORS = ["#8b5cf6", "#059669", "#dc2626", "#f97316", "#3b82f6"]

  const renderLabel = (entry: any) => {
    return `${entry.name}`
  }

  if (loading) return <div>Carregando lançamentos...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios Analíticos</h2>
          <p className="text-muted-foreground">Análise detalhada dos gastos com exportações específicas</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
          <CardDescription>Configure os filtros para análise dos dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Período</label>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Setor</label>
              <Select value={selectedSetor} onValueChange={setSelectedSetor}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  {Array.from(new Set(safeLancamentos.map((l) => l.setor?.nome).filter(Boolean))).map((setor) => (
                    <SelectItem key={setor} value={setor!}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {Array.from(new Set(safeLancamentos.map((l) => l.categoria?.nome).filter(Boolean))).map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setDateRange(undefined)
                setSelectedSetor("all")
                setSelectedCategoria("all")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Gastos por Setor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Gastos por Setor
            </CardTitle>
            <CardDescription>Distribuição dos gastos entre os setores ({textoPeriodo})</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportSetoresExcel(pieData, textoPeriodo, lancamentosFiltrados)}
              disabled={pieData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <PDFDownloadLink
              document={<RelatorioSetoresPDF data={pieData} periodo={textoPeriodo} lancamentosFiltrados={lancamentosFiltrados} />}
              fileName={`gastos-por-setor-${new Date().toISOString().split("T")[0]}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading || pieData.length === 0}>
                  <FileText className="mr-2 h-4 w-4" />
                  {loading ? "Gerando..." : "PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label={renderLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhum dado para exibir
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Gastos por Categoria */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Gastos por Categoria
            </CardTitle>
            <CardDescription>Comparação de gastos por categoria entre setores ({textoPeriodo})</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCategoriasExcel(barData, textoPeriodo, lancamentosFiltrados)}
              disabled={barData.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <PDFDownloadLink
              document={<RelatorioCategoriasPDF data={barData} periodo={textoPeriodo} lancamentosFiltrados={lancamentosFiltrados} />}
              fileName={`gastos-por-categoria-${new Date().toISOString().split("T")[0]}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading || barData.length === 0}>
                  <FileText className="mr-2 h-4 w-4" />
                  {loading ? "Gerando..." : "PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </CardHeader>
        <CardContent>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value: number) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]} />
                <Legend />
                {Array.from(new Set(lancamentosFiltrados.map((l) => l.setor?.nome).filter(Boolean))).map(
                  (setor, index) => (
                    <Bar key={setor} dataKey={setor!} fill={COLORS[index % COLORS.length]} name={setor} />
                  ),
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhum dado para exibir
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Evolução Temporal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução Temporal dos Gastos
          </CardTitle>
          <CardDescription>Acompanhe a tendência de gastos ao longo do período ({textoPeriodo})</CardDescription>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip
                  formatter={(value: number) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#8b5cf6" strokeWidth={2} name="Gastos" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Nenhum dado para exibir
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}