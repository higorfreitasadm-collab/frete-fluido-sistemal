// Service layer prepared for Supabase integration
// Replace mock implementations with Supabase client calls

import { mockNFs, mockUsers, mockActivities } from '@/data/mock';
import { NotaFiscal, User, NFFormData, ActivityLog } from '@/types';

// Simulates async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const nfService = {
  async listar(): Promise<NotaFiscal[]> {
    await delay(300);
    return [...mockNFs];
  },

  async buscarPorId(id: string): Promise<NotaFiscal | undefined> {
    await delay(200);
    return mockNFs.find(nf => nf.id === id);
  },

  async criar(data: NFFormData): Promise<NotaFiscal> {
    await delay(400);
    const nova: NotaFiscal = {
      ...data,
      id: String(Date.now()),
      status: 'pendente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      data_entrega: data.data_entrega || null,
    };
    mockNFs.unshift(nova);
    return nova;
  },

  async atualizar(id: string, data: Partial<NFFormData>): Promise<NotaFiscal> {
    await delay(400);
    const index = mockNFs.findIndex(nf => nf.id === id);
    if (index === -1) throw new Error('NF não encontrada');
    mockNFs[index] = { ...mockNFs[index], ...data, updated_at: new Date().toISOString() };
    return mockNFs[index];
  },

  async excluir(id: string): Promise<void> {
    await delay(300);
    const index = mockNFs.findIndex(nf => nf.id === id);
    if (index !== -1) mockNFs.splice(index, 1);
  },
};

export const userService = {
  async listar(): Promise<User[]> {
    await delay(200);
    return [...mockUsers];
  },
};

export const activityService = {
  async listar(): Promise<ActivityLog[]> {
    await delay(200);
    return [...mockActivities];
  },
};
