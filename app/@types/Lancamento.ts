import { Setor } from "./Setor"
import { User } from "./User"
import { Categoria } from "./Categoria"

export interface Lancamento {
  id: number
  setorId: number
  userId: number
  categoriaId: number
  data: string
  valor: number

  // Adicionar os relacionamentos que vêm do backend
  setor?: Setor
  user?: User
  categoria?: Categoria
}
