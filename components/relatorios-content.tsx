"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Download, FileText, BarChart3 } from "lucide-react"
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
} from "recharts"

const pieData = [
  { name: "Desossa", value: 15420, fill: "#8b5cf6" },
  { name: "Salga", value: 8750, fill: "#059669" },
  { name: "Varal", value: 12340, fill: "#dc2626" },
]

const barData = [
  { name: "Produção", desossa: 8000, salga: 4000, varal: 6000 },
  { name: "Limpeza", desossa: 2000, salga: 3000, varal: 2000 },
  { name: "Utilidades", desossa: 3000, salga: 1000, varal: 3000 },
  { name: "Marketing", desossa: 2420, salga: 750, varal: 1340 },
]

const COLORS = ["#8b5cf6", "#059669", "#dc2626"]

export function RelatoriosContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">Visualize e exporte relatórios detalhados dos gastos</p>
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
          <CardDescription>Configure os filtros para gerar relatórios personalizados</CardDescription>
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
                <SelectItem value="desossa">Desossa</SelectItem>
                <SelectItem value="salga">Salga</SelectItem>
                <SelectItem value="varal">Varal</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="producao">Produção</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
                <SelectItem value="utilidades">Utilidades</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
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
            <CardDescription>Distribuição dos gastos entre os setores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Comparação de gastos por categoria entre setores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                <Legend />
                <Bar dataKey="desossa" fill="#8b5cf6" name="Desossa" />
                <Bar dataKey="salga" fill="#059669" name="Salga" />
                <Bar dataKey="varal" fill="#dc2626" name="Varal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Resumo dos principais indicadores financeiros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Geral</p>
              <p className="text-2xl font-bold">R$ 36.510,80</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Maior Gasto</p>
              <p className="text-2xl font-bold">R$ 15.420,50</p>
              <p className="text-xs text-muted-foreground">Desossa</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Menor Gasto</p>
              <p className="text-2xl font-bold">R$ 8.750,30</p>
              <p className="text-xs text-muted-foreground">Salga</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Média por Setor</p>
              <p className="text-2xl font-bold">R$ 12.170,27</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
