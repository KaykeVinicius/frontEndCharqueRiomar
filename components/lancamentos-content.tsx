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

export function LancamentosContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    data: "",
    setor: "",
    categoria: "",
    valor: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/lancamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar lançamento")
      }

      // Resetar formulário e fechar diálogo
      setFormData({ data: "", setor: "", categoria: "", valor: "" })
      setIsDialogOpen(false)
      alert("Lançamento salvo com sucesso!")
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar lançamento")
    }
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho e botão de novo lançamento */}
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
              {/* Data */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data" className="text-right">
                  Data
                </Label>
                <Input
                  id="data"
                  type="date"
                  className="col-span-3"
                  value={formData.data}
                  onChange={(e) => handleChange("data", e.target.value)}
                />
              </div>

              {/* Setor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setor" className="text-right">
                  Setor
                </Label>
                <Select value={formData.setor} onValueChange={(value) => handleChange("setor", value)}>
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

              {/* Categoria */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoria
                </Label>
                <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
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

              {/* Valor */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor
                </Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="col-span-3"
                  value={formData.valor}
                  onChange={(e) => handleChange("valor", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleSubmit}>
                Salvar Lançamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Lançamentos */}
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
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Os dados virão do backend, então deixamos o TableBody vazio por enquanto */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
