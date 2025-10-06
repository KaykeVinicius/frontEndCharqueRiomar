export interface Usuario {
  id: number;
  descricao: string;
  cpf: string;
  password_digest: string;
  tipo_usuario_id: number;
  email: string;
}
