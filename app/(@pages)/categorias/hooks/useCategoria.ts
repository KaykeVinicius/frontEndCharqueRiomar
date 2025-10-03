"use client"

import { useEffect, useState } from "react"
import { Categoria } from "@/app/@types/Categoria"
import { categoriaApi } from "../api/categoria"

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState({ nome: "" })

  useEffect(() => {
    categoriaApi.getAll()
      .then((data: Categoria[]) => setCategorias(data))
      .catch((err: unknown) => console.error("Erro ao buscar categorias:", err))
      .finally(() => setLoading(false))
  }, [])

  const filteredCategorias = categorias.filter((c) =>
    (c.nome || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent, formDataUpperCase?: { nome: string }) => {
    e.preventDefault()
    try {
      // 🔹 CORREÇÃO: Usar formDataUpperCase se fornecido, senão usar formData normal
      const dadosParaSalvar = formDataUpperCase || formData
      
      if (editingCategoria) {
        const updated = await categoriaApi.update(editingCategoria.id, dadosParaSalvar)
        setCategorias(categorias.map((c) => (c.id === updated.id ? updated : c)))
      } else {
        const created = await categoriaApi.create(dadosParaSalvar)
        setCategorias([...categorias, created])
      }
      setFormData({ nome: "" })
      setEditingCategoria(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setFormData({ nome: categoria.nome })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await categoriaApi.delete(id)
      setCategorias(categorias.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Erro ao deletar categoria:", error)
    }
  }

  return {
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
  }
}