"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentTransactions } from "@/components/recent-transactions";
import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useLancamentos } from "@/app/(@pages)/lancamentos/hooks/useLancamentos";
import { useMemo } from "react";

export function Dashboard() {
  const { lancamentos, loading } = useLancamentos();

  // 🔹 Calcula total de gastos
  const totalGastos = useMemo(() => {
    return lancamentos.reduce((sum, l) => sum + (l.valor || 0), 0);
  }, [lancamentos]);

  // 🔹 Total de lançamentos
  const totalLancamentos = lancamentos.length;

  // 🔹 Exemplos de dados de tendências (pode calcular com base em mês anterior)
  const desossa = useMemo(() => {
    return lancamentos
      .filter((l) => l.categoria?.nome?.toLowerCase() === "desossa")
      .reduce((sum, l) => sum + (l.valor || 0), 0);
  }, [lancamentos]);

  const salga = useMemo(() => {
    return lancamentos
      .filter((l) => l.categoria?.nome?.toLowerCase() === "salga")
      .reduce((sum, l) => sum + (l.valor || 0), 0);
  }, [lancamentos]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Gastos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {totalGastos.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lançamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLancamentos}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desossa</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {desossa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salga</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {salga.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 em relação ao mês passado
            </p>
          </CardContent>
        </Card>
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
            <CardDescription>
              Você fez {totalLancamentos} lançamentos este mês.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions lancamentos={lancamentos.slice(-10)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
