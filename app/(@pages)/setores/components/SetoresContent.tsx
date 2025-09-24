"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useSetores } from "../hooks/useSetores"

export function SetoresContent() {
  const { setores, loading, createSetor, updateSetor, deleteSetor } = useSetores()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSetor, setEditingSetor] = useState<any>(null)
  const [formData, setFormData] = useState({ nome: "" })

  const filteredSetores = setores.filter(s => (s.nome || "").toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSetor) {
      await updateSetor(editingSetor.id, formData)
    } else {
      await createSetor(formData)
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

  const handleDelete = (id: number) => deleteSetor(id)

  if (loading) return <p>Carregando setores...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingSetor(null); setFormData({ nome: "" }) }}>
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
                placeholder="Ex: Financeiro"
                required
              />
              <DialogFooter>
                <Button type="submit">{editingSetor ? "Salvar" : "Criar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Setores</CardTitle>
          <CardDescription>{setores.length} setor{setores.length !== 1 ? "es" : ""} cadastrad{setores.length !== 1 ? "os" : "o"}</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar setores..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                <TableRow key={setor.id}>
                  <TableCell>{setor.nome}</TableCell>
                  <TableCell><Badge variant="default">ativo</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(setor)}><Edit className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(setor.id)}><Trash2 className="h-4 w-4"/></Button>
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
