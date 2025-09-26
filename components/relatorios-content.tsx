"use client";

import { useMemo, useState } from "react";
import { useLancamentos } from "@/app/(@pages)/lancamentos/hooks/useLancamentos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Download, FileText, BarChart3 } from "lucide-react";
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
} from "recharts";
import * as XLSX from 'xlsx';
import { RelatorioPDF } from './relatorio-pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';

// Função de Exportação Excel (mantida igual)
const exportToExcel = (lancamentos: any[]) => {
  if (lancamentos.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    // Preparar dados para Excel
    const dadosFormatados = lancamentos.map(lancamento => ({
      'Setor': lancamento.setor?.nome || 'N/A',
      'Categoria': lancamento.categoria?.nome || 'N/A',
      'Data': new Date(lancamento.data).toLocaleDateString('pt-BR'),
      'Valor (R$)': Number(lancamento.valor || 0)
    }));

    // Calcular total
    const total = lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0);

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
    
    // Adicionar linha de total
    XLSX.utils.sheet_add_aoa(worksheet, [['', '', 'TOTAL GERAL', total]], { 
      origin: -1 
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lançamentos');
    
    XLSX.writeFile(workbook, `relatorio-charque-riomar-${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    alert('Erro ao gerar Excel. Tente novamente.');
  }
};

export function RelatoriosContent() {
  const { lancamentos, loading } = useLancamentos();
  const safeLancamentos = Array.isArray(lancamentos) ? lancamentos : [];
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 🔹 Dados do PieChart (gastos por setor)
  const pieData = useMemo(() => {
    const setorTotals = safeLancamentos.reduce((acc, l) => {
      const setorNome = l.setor?.nome || "Outros";
      acc[setorNome] = (acc[setorNome] || 0) + Number(l.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(setorTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [safeLancamentos]);

  // 🔹 Dados do BarChart (gastos por categoria entre setores)
  const barData = useMemo(() => {
    const categoriasSetores: Record<string, Record<string, number>> = {};

    safeLancamentos.forEach((l) => {
      const cat = l.categoria?.nome || "Outros";
      const setor = l.setor?.nome || "Outros";
      if (!categoriasSetores[cat]) categoriasSetores[cat] = {};
      categoriasSetores[cat][setor] =
        (categoriasSetores[cat][setor] || 0) + Number(l.valor || 0);
    });

    return Object.entries(categoriasSetores).map(([cat, setores]) => ({
      name: cat,
      ...setores,
    }));
  }, [safeLancamentos]);

  // 🔹 Lista de cores padrão
  const COLORS = ["#8b5cf6", "#059669", "#dc2626", "#f97316", "#3b82f6"];

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Visualize e exporte relatórios detalhados dos gastos
          </p>
        </div>
        <div className="flex gap-2">
          {/* Botão PDF com React PDF */}
          {safeLancamentos.length > 0 ? (
            <PDFDownloadLink
              document={
                <RelatorioPDF 
                  lancamentos={safeLancamentos} 
                  titulo="" 
                />
              }
              fileName={`relatorio-charque-riomar-${new Date().toISOString().split('T')[0]}.pdf`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              {({ loading, error }) => (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  {loading ? 'Gerando PDF...' : 'Exportar PDF'}
                </>
              )}
            </PDFDownloadLink>
          ) : (
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          )}

          {/* Botão Excel (mantido igual) */}
          <Button 
            variant="outline" 
            onClick={() => exportToExcel(safeLancamentos)}
            disabled={safeLancamentos.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>
            Configure os filtros para gerar relatórios personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <DatePickerWithRange />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {Array.from(
                  new Set(
                    safeLancamentos.map((l) => l.setor?.nome).filter(Boolean)
                  )
                ).map((setor) => (
                  <SelectItem key={setor} value={setor!}>
                    {setor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {Array.from(
                  new Set(
                    safeLancamentos
                      .map((l) => l.categoria?.nome)
                      .filter(Boolean)
                  )
                ).map((cat) => (
                  <SelectItem key={cat} value={cat!}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Setor</CardTitle>
            <CardDescription>
              Distribuição dos gastos entre os setores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const name = props.name as string;
                    const percent = typeof props.percent === "number" ? props.percent : 0;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `R$ ${Number(value).toLocaleString("pt-BR")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>
              Comparação de gastos por categoria entre setores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip
                  formatter={(value) =>
                    `R$ ${Number(value).toLocaleString("pt-BR")}`
                  }
                />
                <Legend />
                {Array.from(
                  new Set(
                    safeLancamentos.map((l) => l.setor?.nome).filter(Boolean)
                  )
                ).map((setor, index) => (
                  <Bar
                    key={setor}
                    dataKey={setor!}
                    fill={COLORS[index % COLORS.length]}
                    name={setor}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
