"use client";

import { useMemo } from "react";
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

export function RelatoriosContent() {
  const { lancamentos, loading } = useLancamentos();
  const safeLancamentos = Array.isArray(lancamentos) ? lancamentos : [];

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
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline">
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
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
