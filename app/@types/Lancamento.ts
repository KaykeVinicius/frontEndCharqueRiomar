import { Setor } from "./Setor";
import { Categoria } from "./Categoria";

export interface Lancamento {
  id: number;
  setorId: number;
  categoriaId: number;
  data: string;
  valor: number;

  // Adicionar os relacionamentos que vêm do backend
  setor?: Setor;
  categoria?: Categoria;
}
