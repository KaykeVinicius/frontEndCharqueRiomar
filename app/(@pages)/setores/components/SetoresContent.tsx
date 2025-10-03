"use client"

import { useState, useMemo } from "react" // 🔹 Adicionei useMemo
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useSetores } from "../hooks/useSetores"

export function SetoresContent() {
  const { setores, loading, createSetor, updateSetor, deleteSetor } = useSetores()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSetor, setEditingSetor] = useState<any>(null)
  const [formData, setFormData] = useState({ nome: "" })

  // 🔹 Estado para a modal de confirmação de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [setorToDelete, setSetorToDelete] = useState<number | null>(null)

  // 🔹 ORDENAR setores por nome em ordem alfabética
  const setoresOrdenados = useMemo(() => {
    return [...setores].sort((a, b) => a.nome.localeCompare(b.nome))
  }, [setores])

  // 🔹 FILTRAR setores ordenados
  const filteredSetores = useMemo(() => {
    return setoresOrdenados.filter(s => 
      (s.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [setoresOrdenados, searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🔹 Converter para CAIXA ALTA antes de salvar
    const formDataUpperCase = {
      nome: formData.nome.toUpperCase().trim() // 🔹 .trim() para remover espaços extras
    }
    
    if (editingSetor) {
      await updateSetor(editingSetor.id, formDataUpperCase)
    } else {
      await createSetor(formDataUpperCase)
    }
    setFormData({ nome: "" })
    setEditingSetor(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (setor: any) => {
    setEditingSetor(setor)
    setFormData({ nome: setor.nome })
    setIsDialogOpen(true)
  }

  // 🔹 Função para abrir a modal de confirmação de exclusão
  const handleOpenDeleteDialog = (id: number) => {
    setSetorToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // 🔹 Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (setorToDelete) {
      await deleteSetor(setorToDelete)
      setIsDeleteDialogOpen(false)
      setSetorToDelete(null)
    }
  }

  // 🔹 Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setSetorToDelete(null)
  }

  if (loading) return <p>Carregando setores...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { setEditingSetor(null); setFormData({ nome: "" }) }}
              className="cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSetor ? "Editar Setor" : "Novo Setor"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ nome: e.target.value })}
                placeholder="Ex: FINANCEIRO"
                required
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ⓘ O texto será convertido para CAIXA ALTA automaticamente
              </p>
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  {editingSetor ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Setores</CardTitle>
          <CardDescription>
            {setores.length} setor{setores.length !== 1 ? "es" : ""} cadastrad{setores.length !== 1 ? "os." : "o."}
            {setores.length > 1 && ""}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar setores..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="cursor-text"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSetores.map(setor => (
                <TableRow key={setor.id} className="cursor-default">
                  <TableCell className="font-medium">{setor.nome}</TableCell>
                  <TableCell><Badge variant="default">ativo</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(setor)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenDeleteDialog(setor.id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
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
              Tem certeza que deseja excluir este setor? Esta ação não pode ser desfeita.
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