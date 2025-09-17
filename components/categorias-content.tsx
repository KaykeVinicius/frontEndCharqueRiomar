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
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Categoria {
  id: number
  nome: string
  descricao: string
  contasCount: number
  status: "ativo" | "inativo"
}

const mockCategorias: Categoria[] = [
  { id: 1, nome: "Marketing", descricao: "Gastos com marketing e publicidade", contasCount: 5, status: "ativo" },
  { id: 2, nome: "Produção", descricao: "Gastos relacionados à produção", contasCount: 12, status: "ativo" },
  { id: 3, nome: "Administrativo", descricao: "Gastos administrativos gerais", contasCount: 8, status: "ativo" },
  { id: 4, nome: "Manutenção", descricao: "Manutenção de equipamentos e instalações", contasCount: 6, status: "ativo" },
]

export function CategoriasContent() {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({ nome: "", descricao: "" })

  const filteredCategorias = categorias.filter(
    (categoria) =>
      categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategoria) {
      setCategorias(
        categorias.map((cat) =>
          cat.id === editingCategoria.id ? { ...cat, nome: formData.nome, descricao: formData.descricao } : cat,
        ),
      )
    } else {
      const newCategoria: Categoria = {
        id: Math.max(...categorias.map((c) => c.id)) + 1,
        nome: formData.nome,
        descricao: formData.descricao,
        contasCount: 0,
        status: "ativo",
      }
      setCategorias([...categorias, newCategoria])
    }
    setFormData({ nome: "", descricao: "" })
    setEditingCategoria(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({ nome: categoria.nome, descricao: categoria.descricao })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setCategorias(categorias.filter((cat) => cat.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias de gastos do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategoria(null)
                setFormData({ nome: "", descricao: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription>
                {editingCategoria ? "Edite os dados da categoria" : "Adicione uma nova categoria de gastos"}
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
                    placeholder="Ex: Marketing"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Ex: Gastos com marketing e publicidade"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingCategoria ? "Salvar Alterações" : "Criar Categoria"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            {categorias.length} categoria{categorias.length !== 1 ? "s" : ""} cadastrada
            {categorias.length !== 1 ? "s" : ""}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
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
                <TableHead>Contas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell>{categoria.descricao}</TableCell>
                  <TableCell>{categoria.contasCount} contas</TableCell>
                  <TableCell>
                    <Badge variant={categoria.status === "ativo" ? "default" : "secondary"}>{categoria.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(categoria.id)}>
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
