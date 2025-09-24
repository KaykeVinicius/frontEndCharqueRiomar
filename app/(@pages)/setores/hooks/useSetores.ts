import { useState, useEffect } from "react"
import { setorApi } from "../api/setores"
import { Setor } from "@/app/@types/Setor"

export function useSetores() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setorApi.getAll()
      .then(setSetores)
      .catch(err => console.error("Erro ao buscar setores:", err))
      .finally(() => setLoading(false))
  }, [])

  const createSetor = async (data: Partial<Setor>) => {
    const created = await setorApi.create(data)
    setSetores([...setores, created])
    return created
  }

  const updateSetor = async (id: number, data: Partial<Setor>) => {
    const updated = await setorApi.update(id, data)
    setSetores(setores.map(s => s.id === updated.id ? updated : s))
    return updated
  }

  const deleteSetor = async (id: number) => {
    await setorApi.delete(id)
    setSetores(setores.filter(s => s.id !== id))
  }

  return { setores, loading, createSetor, updateSetor, deleteSetor }
}
