import { NotaFiscal, User, ActivityLog } from '@/types';

export const mockUsers: User[] = [
  { id: '1', nome: 'Carlos Silva', email: 'carlos@empresa.com', role: 'administrador', avatar_url: '' },
  { id: '2', nome: 'Ana Souza', email: 'ana@empresa.com', role: 'usuario', avatar_url: '' },
  { id: '3', nome: 'Roberto Lima', email: 'roberto@empresa.com', role: 'usuario', avatar_url: '' },
  { id: '4', nome: 'Juliana Costa', email: 'juliana@empresa.com', role: 'administrador', avatar_url: '' },
];

export const mockNFs: NotaFiscal[] = [
  {
    id: '1', numero_nf: 'NF-2024-001', remetente: 'Transportadora ABC', destinatario: 'Loja Central',
    data_chegada: '2024-12-01', data_entrega: '2024-12-05', frete: 1250.00, status: 'entregue',
    responsavel_id: '1', observacoes: 'Entrega realizada sem problemas.', created_at: '2024-12-01T08:00:00Z', updated_at: '2024-12-05T14:00:00Z',
  },
  {
    id: '2', numero_nf: 'NF-2024-002', remetente: 'Logística Express', destinatario: 'Filial Norte',
    data_chegada: '2024-12-03', data_entrega: null, frete: 3450.75, status: 'pendente',
    responsavel_id: '2', observacoes: 'Aguardando confirmação do destinatário.', created_at: '2024-12-03T10:30:00Z', updated_at: '2024-12-03T10:30:00Z',
  },
  {
    id: '3', numero_nf: 'NF-2024-003', remetente: 'Frete Rápido Ltda', destinatario: 'CD São Paulo',
    data_chegada: '2024-11-15', data_entrega: null, frete: 8900.00, status: 'atrasada',
    responsavel_id: '3', observacoes: '', created_at: '2024-11-15T09:00:00Z', updated_at: '2024-11-20T09:00:00Z',
  },
  {
    id: '4', numero_nf: 'NF-2024-004', remetente: 'Transportes União', destinatario: 'Depósito Sul',
    data_chegada: '2024-12-08', data_entrega: '2024-12-10', frete: 2100.50, status: 'entregue',
    responsavel_id: '1', observacoes: 'Carga frágil manuseada com cuidado.', created_at: '2024-12-08T07:45:00Z', updated_at: '2024-12-10T16:00:00Z',
  },
  {
    id: '5', numero_nf: 'NF-2024-005', remetente: 'Cargas Brasil', destinatario: 'Loja Centro',
    data_chegada: '2024-12-10', data_entrega: null, frete: 1780.30, status: 'pendente',
    responsavel_id: '4', observacoes: 'Previsão de entrega para sexta-feira.', created_at: '2024-12-10T11:00:00Z', updated_at: '2024-12-10T11:00:00Z',
  },
  {
    id: '6', numero_nf: 'NF-2024-006', remetente: 'Expresso Nordeste', destinatario: 'Filial Recife',
    data_chegada: '2024-11-20', data_entrega: null, frete: 5600.00, status: 'atrasada',
    responsavel_id: '2', observacoes: 'Problemas na rota. Verificar com motorista.', created_at: '2024-11-20T08:00:00Z', updated_at: '2024-11-25T08:00:00Z',
  },
  {
    id: '7', numero_nf: 'NF-2024-007', remetente: 'Transportadora ABC', destinatario: 'CD Minas',
    data_chegada: '2024-12-12', data_entrega: '2024-12-14', frete: 3200.00, status: 'entregue',
    responsavel_id: '3', observacoes: 'Entrega antecipada.', created_at: '2024-12-12T09:30:00Z', updated_at: '2024-12-14T10:00:00Z',
  },
  {
    id: '8', numero_nf: 'NF-2024-008', remetente: 'Logística Express', destinatario: 'Loja Central',
    data_chegada: '2024-12-14', data_entrega: null, frete: 980.00, status: 'pendente',
    responsavel_id: '1', observacoes: '', created_at: '2024-12-14T14:00:00Z', updated_at: '2024-12-14T14:00:00Z',
  },
  {
    id: '9', numero_nf: 'NF-2024-009', remetente: 'Frete Rápido Ltda', destinatario: 'Filial Norte',
    data_chegada: '2024-11-28', data_entrega: null, frete: 4300.00, status: 'atrasada',
    responsavel_id: '4', observacoes: 'Carga retida na fiscalização.', created_at: '2024-11-28T07:00:00Z', updated_at: '2024-12-02T07:00:00Z',
  },
  {
    id: '10', numero_nf: 'NF-2024-010', remetente: 'Cargas Brasil', destinatario: 'Depósito Sul',
    data_chegada: '2024-12-15', data_entrega: '2024-12-16', frete: 1500.00, status: 'entregue',
    responsavel_id: '2', observacoes: 'Tudo certo.', created_at: '2024-12-15T10:00:00Z', updated_at: '2024-12-16T15:00:00Z',
  },
];

export const mockActivities: ActivityLog[] = [
  { id: '1', descricao: 'NF-2024-010 marcada como entregue', usuario: 'Ana Souza', data: '2024-12-16T15:00:00Z', tipo: 'entrega' },
  { id: '2', descricao: 'NF-2024-008 criada', usuario: 'Carlos Silva', data: '2024-12-14T14:00:00Z', tipo: 'criacao' },
  { id: '3', descricao: 'NF-2024-007 entregue com antecedência', usuario: 'Roberto Lima', data: '2024-12-14T10:00:00Z', tipo: 'entrega' },
  { id: '4', descricao: 'NF-2024-005 criada', usuario: 'Juliana Costa', data: '2024-12-10T11:00:00Z', tipo: 'criacao' },
  { id: '5', descricao: 'NF-2024-004 atualizada', usuario: 'Carlos Silva', data: '2024-12-10T16:00:00Z', tipo: 'edicao' },
];

export const currentUser: User = mockUsers[0];
