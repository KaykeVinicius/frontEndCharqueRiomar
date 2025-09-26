"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { useLancamentos } from "@/app/(@pages)/lancamentos/hooks/useLancamentos"
import { useMemo } from "react"

export function Overview() {
  const { lancamentos } = useLancamentos()

  const safeLancamentos = Array.isArray(lancamentos) ? lancamentos : []

  const chartData = useMemo(() => {
    const dataBySetor = safeLancamentos.reduce(
      (acc, lancamento) => {
        const setorNome = lancamento.setor?.nome || "Outros"

        if (!acc[setorNome]) {
          acc[setorNome] = { name: setorNome, value: 0 }
        }

        acc[setorNome].value += Number(lancamento.valor) || 0

        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(dataBySetor)
  }, [safeLancamentos])

  const colors = [
    "#8b5cf6", // Roxo
    "#06b6d4", // Ciano
    "#10b981", // Verde
    "#f59e0b", // Amarelo
    "#ef4444", // Vermelho
    "#8b5a2b", // Marrom
    "#6366f1", // Índigo
    "#ec4899", // Rosa
    "#84cc16", // Lima
  ]

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Nenhum dado disponível para exibir
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#888888" }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `R$ ${Number(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`
          }
          tick={{ fill: "#888888" }}
        />
        <Tooltip
          formatter={(value: any) => [
            `R$ ${Number(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Valor",
          ]}
          labelStyle={{ color: "#374151" }}
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} className="hover:opacity-80 transition-opacity">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
