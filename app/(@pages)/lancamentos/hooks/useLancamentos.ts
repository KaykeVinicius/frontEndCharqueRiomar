import { useState, useEffect } from "react"
import { lancamentoApi } from "../api/lancamentos"
import { setorApi } from "@/app/(@pages)/setores/api/setores" 
import { categoriaApi } from "@/app/(@pages)/categorias/api/categoria"
import { Lancamento } from "@/app/@types/Lancamento"
import { Setor } from "@/app/@types/Setor"
import { User } from "@/app/@types/User"
import { Categoria } from "@/app/@types/Categoria"
import { userApi } from "@/lib/userApi"

// 🔹 Tipo de formulário interno (sem userId)
export type LancamentoForm = {
  setorId: number
  categoriaId: number
  data: string
  valor: string
}

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLancamento, setEditingLancamento] = useState<Lancamento | null>(null)

  // 🔹 Estado do form sem userId
  const [formData, setFormData] = useState<LancamentoForm>({
    setorId: 0,
    categoriaId: 0,
    data: "",
    valor: "",
  })

  const [setores, setSetores] = useState<Setor[]>([])
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    Promise.all([
      lancamentoApi.getAll(),
      setorApi.getAll(),
      userApi.getAll(),
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

  // 🔹 Função para formatar valor em Real
  const formatToReal = (value: string): string => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '')
    
    // Se estiver vazio, retorna vazio
    if (digits === '') return ''
    
    // Converte para número e formata como Real
    const numberValue = parseInt(digits) / 100
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 🔹 Função para lidar com mudanças no campo valor
  const handleValorChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      valor: formatToReal(value)
    }))
  }

  const createLancamento = async (data: LancamentoForm) => {
    // Converte de Real para número (remove formatação)
    const valorNumerico = parseFloat(data.valor.replace(/\./g, '').replace(',', '.'))
    const payload = { 
      ...data, 
      valor: valorNumerico,
      userId: 1 // 🔹 Define um userId padrão ou remove se não for necessário no backend
    }
    const created = await lancamentoApi.create(payload)
    setLancamentos([...lancamentos, created])
    return created
  }

  const updateLancamento = async (id: number, data: LancamentoForm) => {
    // Converte de Real para número (remove formatação)
    const valorNumerico = parseFloat(data.valor.replace(/\./g, '').replace(',', '.'))
    const payload = { 
      ...data, 
      valor: valorNumerico,
      userId: 1 // 🔹 Define um userId padrão ou remove se não for necessário
    }
    const updated = await lancamentoApi.update(id, payload)
    setLancamentos(lancamentos.map(e => e.id === updated.id ? updated : e))
    return updated
  }

  const deleteLancamento = async (id: number) => {
    await lancamentoApi.delete(id)
    setLancamentos(lancamentos.filter(e => e.id !== id))
  }

  // 🔹 Formata os valores para exibição na tabela
  const formatValorForDisplay = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
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
    handleValorChange,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    setEditingLancamento,
    setores,
    usuarios,
    categorias
  }
}