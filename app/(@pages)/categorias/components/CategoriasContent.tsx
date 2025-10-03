"use client"

import { useState, useMemo } from "react" // 🔹 Adicionei useMemo
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useCategorias } from "../hooks/useCategoria"

export function CategoriasContent() {
  const {
    categorias,
    filteredCategorias: originalFilteredCategorias,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingCategoria,
    formData,
    setFormData,
    handleSubmit: originalHandleSubmit,
    handleEdit,
    handleDelete,
  } = useCategorias()

  // 🔹 Estado para a modal de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null)

  // 🔹 ORDENAR categorias por nome em ordem alfabética
  const categoriasOrdenadas = useMemo(() => {
    return [...categorias].sort((a, b) => a.nome.localeCompare(b.nome))
  }, [categorias])

  // 🔹 FILTRAR categorias ordenadas
  const filteredCategorias = useMemo(() => {
    return categoriasOrdenadas.filter(categoria => 
      (categoria.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [categoriasOrdenadas, searchTerm])

  // 🔹 Sobrescrever handleSubmit para converter para CAIXA ALTA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🔹 Converter para CAIXA ALTA antes de salvar
    const formDataUpperCase = {
      nome: formData.nome.toUpperCase().trim() // 🔹 .trim() para remover espaços extras
    }
    
    // Chamar a função original com os dados em caixa alta
    await originalHandleSubmit(e, formDataUpperCase)
  }

  // 🔹 Função para abrir a modal de confirmação de exclusão
  const handleOpenDeleteDialog = (id: number) => {
    setCategoriaToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // 🔹 Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (categoriaToDelete) {
      await handleDelete(categoriaToDelete)
      setIsDeleteDialogOpen(false)
      setCategoriaToDelete(null)
    }
  }

  // 🔹 Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setCategoriaToDelete(null)
  }

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
              className="cursor-pointer"
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
                    placeholder="Ex: MARKETING"
                    required
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                ⓘ O texto será convertido para CAIXA ALTA automaticamente
              </p>
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  {editingCategoria ? "Salvar Alterações" : "Criar Categoria"}
                </Button>
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
            {categorias.length > 1 && " • Ordenadas por nome"}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm cursor-text"
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
                <TableRow key={categoria.id} className="cursor-default">
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell>
                    <Badge variant="default">ativo</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(categoria)}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDeleteDialog(categoria.id)}
                        className="cursor-pointer"
                      >
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

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelDelete}
              className="cursor-pointer"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}