"use client"

import { useMemo, useState } from "react"
import { useLancamentos } from "@/app/(@pages)/lancamentos/hooks/useLancamentos"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
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
import { RelatorioPDF } from "./relatorio-pdf"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { DatePickerWithRange } from "./date-range-picker"
import type { DateRange } from "react-day-picker"
import { startOfDay, endOfDay, format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

// Função de Exportação Excel
const exportToExcel = (lancamentos: any[], periodo: string) => {
  if (lancamentos.length === 0) {
    alert("Não há dados para exportar.")
    return
  }

  try {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([])

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
    )

    XLSX.utils.sheet_add_aoa(worksheet, [["SETOR", "CATEGORIA", "DATA", "VALOR (R$)"]], { origin: "A10" })

    const dadosFormatados = lancamentos.map((lancamento) => [
      lancamento.setor?.nome || "N/A",
      lancamento.categoria?.nome || "N/A",
      new Date(lancamento.data).toLocaleDateString("pt-BR"),
      Number(lancamento.valor || 0),
    ])

    XLSX.utils.sheet_add_aoa(worksheet, dadosFormatados, { origin: "A11" })

    const linhaTotal = 11 + lancamentos.length
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["", "", "TOTAL GERAL", lancamentos.reduce((acc, l) => acc + Number(l.valor || 0), 0)]],
      { origin: `A${linhaTotal}` },
    )

    worksheet["!cols"] = [{ wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Lançamentos")
    const fileName = `relatorio-charque-riomar-${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  } catch (error) {
    console.error("Erro ao gerar Excel:", error)
    alert("Erro ao gerar Excel. Tente novamente.")
  }
}

// 🔹 Função para converter data sem problemas de fuso horário
const parseDataSemFuso = (dataString: string): Date => {
  if (!dataString) return new Date();
  
  // Divide a string YYYY-MM-DD e cria a data no fuso local
  const [year, month, day] = dataString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

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
        // 🔹 CORREÇÃO: Usar a função que evita problemas de fuso horário
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

  const pieData = useMemo(() => {
    const setorTotals = lancamentosFiltrados.reduce(
      (acc, l) => {
        const setorNome = l.setor?.nome || "Outros"
        acc[setorNome] = (acc[setorNome] || 0) + Number(l.valor || 0)
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(setorTotals).map(([name, value]) => ({
      name,
      value,
    }))
  }, [lancamentosFiltrados])

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

  const timelineData = useMemo(() => {
    const gastosPorData: Record<string, number> = {}

    lancamentosFiltrados.forEach((l) => {
      // 🔹 CORREÇÃO: Usar a função que evita problemas de fuso horário
      const dataObj = parseDataSemFuso(l.data);
      const dataFormatada = format(dataObj, "dd/MM", { locale: ptBR });
      gastosPorData[dataFormatada] = (gastosPorData[dataFormatada] || 0) + Number(l.valor || 0)
    })

    return Object.entries(gastosPorData)
      .map(([data, valor]) => ({
        data,
        valor,
      }))
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Visualize e exporte relatórios detalhados dos gastos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>Configure os filtros para gerar relatórios personalizados</CardDescription>
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

          <div className="flex justify-end gap-2 mt-4">
            {lancamentosFiltrados.length > 0 ? (
              <PDFDownloadLink
                document={<RelatorioPDF lancamentos={lancamentosFiltrados} titulo={textoPeriodo} />}
                fileName={`relatorio-charque-riomar-${new Date().toISOString().split("T")[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" disabled={loading}className="cursor-pointer">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Setor</CardTitle>
            <CardDescription>Distribuição dos gastos entre os setores ({textoPeriodo})</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado para exibir
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Comparação de gastos por categoria entre setores ({textoPeriodo})</CardDescription>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evolução Temporal dos Gastos</CardTitle>
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
    </div>
  )
}

export { RelatoriosContent }