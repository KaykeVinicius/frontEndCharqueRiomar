"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lancamento } from "@/app/@types/Lancamento";

interface RecentTransactionsProps {
  lancamentos: Lancamento[];
}

export function RecentTransactions({ lancamentos }: RecentTransactionsProps) {
  if (!lancamentos || lancamentos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum lançamento recente.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {lancamentos.map((l) => (
        <div key={l.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {l.categoria?.nome
                ? l.categoria.nome.slice(0, 2).toUpperCase()
                : "XX"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {l.categoria?.nome || "Sem categoria"}
            </p>
            <p className="text-sm text-muted-foreground">
              {l.setor?.nome || "Sem setor"}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {l.valor
              ? `R$ ${l.valor.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`
              : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
