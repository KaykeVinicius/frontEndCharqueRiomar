"use client"
import { useMemo } from "react"
import { useLancamentos } from "@/app/(@pages)/lancamentos/hooks/useLancamentos"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Users, Building2, Target } from "lucide-react"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"

export function Dashboard() {
  const { lancamentos, loading } = useLancamentos()

  const safeLancamentos = Array.isArray(lancamentos) ? lancamentos : []

  const totalGastos = useMemo(() => {
    return safeLancamentos.reduce((sum, l) => sum + (Number(l.valor) || 0), 0)
  }, [safeLancamentos])

  const totalLancamentos = safeLancamentos.length

  const topSetores = useMemo(() => {
    const setorTotals = safeLancamentos.reduce(
      (acc, lancamento) => {
        const setorNome = lancamento.setor?.nome || "Outros"
        if (!acc[setorNome]) {
          acc[setorNome] = 0
        }
        acc[setorNome] += Number(lancamento.valor) || 0
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(setorTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([nome, valor]) => ({ nome, valor }))
  }, [safeLancamentos])

  const cardColors = [
    { border: "border-l-orange-500", bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-500" },
    { border: "border-l-purple-500", bg: "bg-purple-100", text: "text-purple-800", icon: "text-purple-500" },
    { border: "border-l-emerald-500", bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-500" },
  ]

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lançamentos</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLancamentos}</div>
            <p className="text-xs text-muted-foreground">+180.1% em relação ao mês passado</p>
          </CardContent>
        </Card>

        {topSetores.map((setor, index) => (
          <Card key={setor.nome} className={`border-l-4 ${cardColors[index].border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <span
                  className={`${cardColors[index].bg} ${cardColors[index].text} px-2 py-1 rounded-md text-xs font-semibold`}
                >
                  {setor.nome}
                </span>
              </CardTitle>
              {index === 0 ? (
                <Target className={`h-4 w-4 ${cardColors[index].icon}`} />
              ) : (
                <Building2 className={`h-4 w-4 ${cardColors[index].icon}`} />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {setor.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {index === 0 ? "Maior gasto" : index === 1 ? "2º maior gasto" : "3º maior gasto"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lançamentos Recentes</CardTitle>
            <CardDescription>Você fez {totalLancamentos} lançamentos este mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions lancamentos={safeLancamentos.slice(-10)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
