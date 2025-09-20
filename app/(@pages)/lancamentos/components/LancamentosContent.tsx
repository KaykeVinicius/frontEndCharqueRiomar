"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useLancamentos } from "../hooks/useLancamentos"

export function LancamentosContent() {
  const {
    lancamentos,
    filteredLancamentos,
    loading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    editingLancamento,
    formData,
    setFormData,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    setEditingLancamento,
    setores,
    usuarios,
    categorias
  } = useLancamentos()

  if (loading) return <p>Carregando lançamentos...</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLancamento) await updateLancamento(editingLancamento.id, formData)
    else await createLancamento(formData)

    setFormData({ setorId: 0, userId: 0, categoriaId: 0, data: "", valor: 0 })
    setEditingLancamento(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: typeof formData) => {
    setEditingLancamento(item as any)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => deleteLancamento(id)

  return (
    <div className="space-y-6">
      {/* Header + Botão */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamentos</h1>
          <p className="text-muted-foreground">Gerencie os lançamentos do sistema</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ setorId: 0, userId: 0, categoriaId: 0, data: "", valor: 0 })}>
              <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLancamento ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Setor */}
                <div className="grid gap-2">
                  <label htmlFor="setorId">Setor</label>
                  <select
                    id="setorId"
                    value={formData.setorId}
                    onChange={e => setFormData({ ...formData, setorId: Number(e.target.value) })}
                    required
                  >
                    <option value="">Selecione um setor</option>
                    {setores.map(s => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Usuário */}
                <div className="grid gap-2">
                  <label htmlFor="userId">Usuário</label>
                  <select
                    id="userId"
                    value={formData.userId}
                    onChange={e => setFormData({ ...formData, userId: Number(e.target.value) })}
                    required
                  >
                    <option value="">Selecione um usuário</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.descricao}</option>
                    ))}
                  </select>
                </div>

                {/* Categoria */}
                <div className="grid gap-2">
                  <label htmlFor="categoriaId">Categoria</label>
                  <select
                    id="categoriaId"
                    value={formData.categoriaId}
                    onChange={e => setFormData({ ...formData, categoriaId: Number(e.target.value) })}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div className="grid gap-2">
                  <label htmlFor="data">Data</label>
                  <Input type="date" id="data" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} required />
                </div>

                {/* Valor */}
                <div className="grid gap-2">
                  <label htmlFor="valor">Valor</label>
                  <Input type="number" step="0.01" id="valor" value={formData.valor} onChange={e => setFormData({ ...formData, valor: Number(e.target.value) })} required />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">{editingLancamento ? "Salvar Alterações" : "Criar Lançamento"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Lançamentos</CardTitle>
          <CardDescription>{filteredLancamentos.length} lançamento(s) cadastrado(s)</CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por data ou valor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setor</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                {/*<TableHead>Status</TableHead>*/}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {filteredLancamentos.map(item => (
    <TableRow key={item.id}>
      <TableCell>{item.setor?.nome || item.setorId}</TableCell>
      <TableCell>{item.user?.descricao || item.userId}</TableCell>
      <TableCell>{item.categoria?.nome || item.categoriaId}</TableCell>
      <TableCell>{item.data}</TableCell>
      <TableCell>{item.valor}</TableCell>
     {/*<TableCell><Badge variant="default">ativo</Badge></TableCell>*/}
      <TableCell className="text-right flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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
