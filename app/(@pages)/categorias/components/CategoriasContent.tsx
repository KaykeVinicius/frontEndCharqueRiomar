"use client"

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
import { useCategorias } from "../hooks/useCategoria"

export function CategoriasContent() {
  const {
    categorias,
    filteredCategorias,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingCategoria,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
  } = useCategorias()

  if (loading) return <p>Carregando categorias...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias do sistema</p>
        </div>

        {/* Botão + Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setFormData({ nome: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription>
                {editingCategoria ? "Edite a descrição da categoria" : "Adicione uma nova categoria"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Descrição</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ nome: e.target.value })}
                    placeholder="Ex: Marketing"
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

      {/* Lista */}
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell>
                    <Badge variant="default">ativo</Badge>
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
