"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Conta {
  id: number
  nome: string
  descricao: string
  categoria: string
  categoriaId: number
  lancamentosCount: number
  status: "ativo" | "inativo"
}

const mockContas: Conta[] = [
  {
    id: 1,
    nome: "MANUTENÇÃO DE MÁQ/EQUIP",
    descricao: "Manutenção de máquinas e equipamentos",
    categoria: "Manutenção",
    categoriaId: 4,
    lancamentosCount: 15,
    status: "ativo",
  },
  {
    id: 2,
    nome: "PUBLICIDADE E PROPAGANDA",
    descricao: "Gastos com publicidade",
    categoria: "Marketing",
    categoriaId: 1,
    lancamentosCount: 8,
    status: "ativo",
  },
  {
    id: 3,
    nome: "MATÉRIA PRIMA",
    descricao: "Compra de matéria prima",
    categoria: "Produção",
    categoriaId: 2,
    lancamentosCount: 25,
    status: "ativo",
  },
  {
    id: 4,
    nome: "ENERGIA ELÉTRICA",
    descricao: "Conta de energia elétrica",
    categoria: "Administrativo",
    categoriaId: 3,
    lancamentosCount: 12,
    status: "ativo",
  },
]

const mockCategorias = [
  { id: 1, nome: "Marketing" },
  { id: 2, nome: "Produção" },
  { id: 3, nome: "Administrativo" },
  { id: 4, nome: "Manutenção" },
]

export function ContasContent() {
  const [contas, setContas] = useState<Conta[]>(mockContas)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConta, setEditingConta] = useState<Conta | null>(null)
  const [formData, setFormData] = useState({ nome: "", descricao: "", categoriaId: "" })

  const filteredContas = contas.filter(
    (conta) =>
      conta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conta.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const categoria = mockCategorias.find((cat) => cat.id === Number.parseInt(formData.categoriaId))

    if (editingConta) {
      setContas(
        contas.map((conta) =>
          conta.id === editingConta.id
            ? {
                ...conta,
                nome: formData.nome,
                descricao: formData.descricao,
                categoriaId: Number.parseInt(formData.categoriaId),
                categoria: categoria?.nome || "",
              }
            : conta,
        ),
      )
    } else {
      const newConta: Conta = {
        id: Math.max(...contas.map((c) => c.id)) + 1,
        nome: formData.nome,
        descricao: formData.descricao,
        categoriaId: Number.parseInt(formData.categoriaId),
        categoria: categoria?.nome || "",
        lancamentosCount: 0,
        status: "ativo",
      }
      setContas([...contas, newConta])
    }
    setFormData({ nome: "", descricao: "", categoriaId: "" })
    setEditingConta(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (conta: Conta) => {
    setEditingConta(conta)
    setFormData({
      nome: conta.nome,
      descricao: conta.descricao,
      categoriaId: conta.categoriaId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setContas(contas.filter((conta) => conta.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="text-muted-foreground">Gerencie as contas específicas de gastos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingConta(null)
                setFormData({ nome: "", descricao: "", categoriaId: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingConta ? "Editar Conta" : "Nova Conta"}</DialogTitle>
              <DialogDescription>
                {editingConta ? "Edite os dados da conta" : "Adicione uma nova conta de gastos"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: MANUTENÇÃO DE MÁQ/EQUIP"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: Manutenção de máquinas e equipamentos"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={formData.categoriaId}
                    onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingConta ? "Salvar Alterações" : "Criar Conta"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas</CardTitle>
          <CardDescription>
            {contas.length} conta{contas.length !== 1 ? "s" : ""} cadastrada{contas.length !== 1 ? "s" : ""}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Lançamentos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContas.map((conta) => (
                <TableRow key={conta.id}>
                  <TableCell className="font-medium">{conta.nome}</TableCell>
                  <TableCell>{conta.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conta.categoria}</Badge>
                  </TableCell>
                  <TableCell>{conta.lancamentosCount} lançamentos</TableCell>
                  <TableCell>
                    <Badge variant={conta.status === "ativo" ? "default" : "secondary"}>{conta.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(conta)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(conta.id)}>
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
