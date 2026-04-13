export type NFStatus = 'pendente' | 'entregue' | 'atrasada';

export type UserRole = 'administrador' | 'usuario';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface NotaFiscal {
  id: string;
  numero_nf: string;
  remetente: string;
  destinatario: string;
  data_chegada: string;
  data_entrega: string | null;
  frete: number;
  status: NFStatus;
  responsavel_id: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface NFFormData {
  numero_nf: string;
  remetente: string;
  destinatario: string;
  data_chegada: string;
  data_entrega: string;
  frete: number;
  responsavel_id: string;
  observacoes: string;
}

export interface ActivityLog {
  id: string;
  descricao: string;
  usuario: string;
  data: string;
  tipo: 'criacao' | 'edicao' | 'entrega' | 'exclusao';
}
