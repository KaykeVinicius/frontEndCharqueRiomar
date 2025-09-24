"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useUsuarios } from "../hooks/useUsuarios"

export function UsuariosContent() {
  const { usuarios, loading, createUsuario, updateUsuario, deleteUsuario } = useUsuarios()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<any>(null)
  const [formData, setFormData] = useState({ nome: "" })

  const filteredUsuarios = usuarios.filter(s => (s.nome || "").toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUsuario) {
      await updateUsuario(editingUsuario.id, formData)
    } else {
      await createUsuario(formData)
    }
    setFormData({ nome: "" })
    setEditingUsuario(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (usuario: any) => {
    setEditingUsuario(usuario)
    setFormData({ nome: usuario.nome })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => deleteUsuario(id)

  if (loading) return <p>Carregando usuarios...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingUsuario(null); setFormData({ nome: "" }) }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuario" : "Novo Usuario"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ nome: e.target.value })}
                placeholder="Ex: Financeiro"
                required
              />
              <DialogFooter>
                <Button type="submit">{editingUsuario ? "Salvar" : "Criar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>{usuarios.length} usuario{usuarios.length !== 1 ? "es" : ""} cadastrad{usuarios.length !== 1 ? "os" : "o"}</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar usuarios..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
              {filteredUsuarios.map(usuario => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell><Badge variant="default">ativo</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)}><Edit className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}><Trash2 className="h-4 w-4"/></Button>
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
