import { useState, useEffect } from "react"
import { lancamentoApi } from "../api/lancamentos"
import { setorApi } from "@/app/(@pages)/setores/api/setores" 
import { categoriaApi } from "@/app/(@pages)/categorias/api/categoria"
import { Lancamento } from "@/app/@types/Lancamento"
import { Setor } from "@/app/@types/Setor"
import { User } from "@/app/@types/User"
import { Categoria } from "@/app/@types/Categoria"
import { userApi } from "@/lib/userApi" // API centralizada para usuários (sem page)

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null)
  const [formData, setFormData] = useState<Partial<Lancamento>>({
    setorId: 0,
    userId: 0,
    categoriaId: 0,
    data: "",
    valor: 0,
  })

  const [setores, setSetores] = useState<Setor[]>([])
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    Promise.all([
      lancamentoApi.getAll(),
      setorApi.getAll(),
      userApi.getAll(),      // API centralizada para buscar users
      categoriaApi.getAll()
    ])
      .then(([lanc, sets, usrs, cats]) => {
        setLancamentos(lanc)
        setSetores(sets)
        setUsuarios(usrs)
        setCategorias(cats)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const createLancamento = async (data: Partial<Lancamento>) => {
    const created = await lancamentoApi.create(data)
    setLancamentos([...lancamentos, created])
    return created
  }

  const updateLancamento = async (id: number, data: Partial<Lancamento>) => {
    const updated = await lancamentoApi.update(id, data)
    setLancamentos(lancamentos.map(e => e.id === updated.id ? updated : e))
    return updated
  }

  const deleteLancamento = async (id: number) => {
    await lancamentoApi.delete(id)
    setLancamentos(lancamentos.filter(e => e.id !== id))
  }

  const filteredLancamentos = lancamentos.filter(l =>
    (l.data || "").includes(searchTerm) ||
    (l.valor || 0).toString().includes(searchTerm)
  )

  return {
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
  }
}
