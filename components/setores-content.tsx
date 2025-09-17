"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Building2 } from "lucide-react"

// Mock data
const setores = [
  {
    id: 1,
    nome: "Desossa",
    totalGastos: 15420.5,
    ultimoLancamento: "2024-01-15",
  },
  {
    id: 2,
    nome: "Salga",
    totalGastos: 8750.3,
    ultimoLancamento: "2024-01-14",
  },
  {
    id: 3,
    nome: "Varal",
    totalGastos: 12340.8,
    ultimoLancamento: "2024-01-13",
  },
]

export function SetoresContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Setores</h2>
          <p className="text-muted-foreground">Gerencie os setores da empresa (centros de resultado)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Setor</DialogTitle>
              <DialogDescription>Adicione um novo setor (centro de resultado) ao sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input id="nome" placeholder="Ex: DESOSSA, SALGA, VARAL" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                Salvar Setor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {setores.map((setor) => (
          <Card key={setor.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{setor.nome}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {setor.totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Último lançamento: {new Date(setor.ultimoLancamento).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Setores</CardTitle>
          <CardDescription>Todos os setores cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Total de Gastos</TableHead>
                <TableHead>Último Lançamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {setores.map((setor) => (
                <TableRow key={setor.id}>
                  <TableCell className="font-medium">{setor.nome}</TableCell>
                  <TableCell className="text-right">
                    R$ {setor.totalGastos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{new Date(setor.ultimoLancamento).toLocaleDateString("pt-BR")}</TableCell>
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
