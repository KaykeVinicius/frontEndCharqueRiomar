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
import { Plus, Search, Edit, Trash2, User } from "lucide-react"

interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  role: "admin" | "gestor" | "usuario"
  status: "ativo" | "inativo"
  ultimoLogin: string
}

const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@charqueriomar.com",
    cpf: "123.456.789-00",
    role: "admin",
    status: "ativo",
    ultimoLogin: "2024-01-15 14:30",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@charqueriomar.com",
    cpf: "987.654.321-00",
    role: "gestor",
    status: "ativo",
    ultimoLogin: "2024-01-15 09:15",
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro@charqueriomar.com",
    cpf: "456.789.123-00",
    role: "usuario",
    status: "ativo",
    ultimoLogin: "2024-01-14 16:45",
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana@charqueriomar.com",
    cpf: "789.123.456-00",
    role: "gestor",
    status: "inativo",
    ultimoLogin: "2024-01-10 11:20",
  },
]

export function UsuariosContent() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({ nome: "", email: "", cpf: "", role: "" })

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.cpf.includes(searchTerm),
  )

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUsuario) {
      setUsuarios(
        usuarios.map((user) =>
          user.id === editingUsuario.id
            ? {
                ...user,
                nome: formData.nome,
                email: formData.email,
                cpf: formatCPF(formData.cpf),
                role: formData.role as "admin" | "gestor" | "usuario",
              }
            : user,
        ),
      )
    } else {
      const newUsuario: Usuario = {
        id: Math.max(...usuarios.map((u) => u.id)) + 1,
        nome: formData.nome,
        email: formData.email,
        cpf: formatCPF(formData.cpf),
        role: formData.role as "admin" | "gestor" | "usuario",
        status: "ativo",
        ultimoLogin: "Nunca",
      }
      setUsuarios([...usuarios, newUsuario])
    }
    setFormData({ nome: "", email: "", cpf: "", role: "" })
    setEditingUsuario(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf.replace(/\D/g, ""),
      role: usuario.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setUsuarios(usuarios.filter((user) => user.id !== id))
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "gestor":
        return "default"
      case "usuario":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUsuario(null)
                setFormData({ nome: "", email: "", cpf: "", role: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUsuario ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
              <DialogDescription>
                {editingUsuario ? "Edite os dados do usuário" : "Adicione um novo usuário ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: joao@charqueriomar.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, "") })}
                    placeholder="12345678900"
                    maxLength={11}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Perfil</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="usuario">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingUsuario ? "Salvar Alterações" : "Criar Usuário"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""} cadastrado{usuarios.length !== 1 ? "s" : ""}
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
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
                <TableHead>Usuário</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{usuario.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.cpf}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(usuario.role)}>
                      {usuario.role === "admin" ? "Administrador" : usuario.role === "gestor" ? "Gestor" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>{usuario.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{usuario.ultimoLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(usuario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(usuario.id)}>
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
