"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

// Mock data
const lancamentos = [
  {
    id: 1,
    data: "2024-01-15",
    setor: "Desossa",
    categoria: "Produção",
    conta: "Manutenção de Máquinas",
    valor: 1999.0,
    usuario: "João Silva",
  },
  {
    id: 2,
    data: "2024-01-14",
    setor: "Salga",
    categoria: "Limpeza",
    conta: "Material de Limpeza",
    valor: 39.0,
    usuario: "Maria Santos",
  },
  {
    id: 3,
    data: "2024-01-13",
    setor: "Varal",
    categoria: "Utilidades",
    conta: "Energia Elétrica",
    valor: 299.0,
    usuario: "Pedro Costa",
  },
]

export function LancamentosContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lançamentos</h2>
          <p className="text-muted-foreground">Gerencie todos os lançamentos de gastos por setor</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
              <DialogDescription>Adicione um novo lançamento de gasto ao sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data" className="text-right">
                  Data
                </Label>
                <Input id="data" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setor" className="text-right">
                  Setor
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desossa">Desossa</SelectItem>
                    <SelectItem value="salga">Salga</SelectItem>
                    <SelectItem value="varal">Varal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoria
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="producao">Produção</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="utilidades">Utilidades</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="conta" className="text-right">
                  Conta
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manutencao">Manutenção de Máquinas</SelectItem>
                    <SelectItem value="limpeza">Material de Limpeza</SelectItem>
                    <SelectItem value="energia">Energia Elétrica</SelectItem>
                    <SelectItem value="seguranca">Equipamentos de Segurança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor
                </Label>
                <Input id="valor" type="number" step="0.01" placeholder="0,00" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Salvar Lançamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Use os filtros abaixo para encontrar lançamentos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por conta..." className="pl-8" />
            </div>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Lançamentos</CardTitle>
          <CardDescription>Todos os lançamentos registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lancamentos.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell>{new Date(lancamento.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{lancamento.setor}</TableCell>
                  <TableCell>{lancamento.categoria}</TableCell>
                  <TableCell>{lancamento.conta}</TableCell>
                  <TableCell>{lancamento.usuario}</TableCell>
                  <TableCell className="text-right">
                    R$ {lancamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
