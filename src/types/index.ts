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

// Extended type with data_pagamento for PendPTE and PendSal modules
export interface PendItem {
  id: string;
  numero_nf: string;
  remetente: string;
  destinatario: string;
  data_chegada: string;
  data_entrega: string | null;
  frete: number;
  data_pagamento: string | null;
  status: NFStatus;
  responsavel_id: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
}

export interface PendFormData {
  numero_nf: string;
  remetente: string;
  destinatario: string;
  data_chegada: string;
  data_entrega: string;
  frete: number;
  data_pagamento: string;
  responsavel_id: string;
  observacoes: string;
}

export type PendModuleType = 'pend-pte' | 'pend-sal';

export interface ActivityLog {
  id: string;
  descricao: string;
  usuario: string;
  data: string;
  tipo: 'criacao' | 'edicao' | 'entrega' | 'exclusao';
}
