// Service layer prepared for Supabase integration
import { mockNFs, mockUsers, mockActivities, mockPendPTE, mockPendSal } from '@/data/mock';
import { NotaFiscal, User, NFFormData, ActivityLog, PendItem, PendFormData, PendModuleType } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function getPendStore(module: PendModuleType) {
  return module === 'pend-pte' ? mockPendPTE : mockPendSal;
}

export const nfService = {
  async listar(): Promise<NotaFiscal[]> { await delay(300); return [...mockNFs]; },
  async buscarPorId(id: string): Promise<NotaFiscal | undefined> { await delay(200); return mockNFs.find(nf => nf.id === id); },
  async criar(data: NFFormData): Promise<NotaFiscal> {
    await delay(400);
    const nova: NotaFiscal = { ...data, id: String(Date.now()), status: 'pendente', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), data_entrega: data.data_entrega || null };
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
  async excluir(id: string): Promise<void> { await delay(300); const i = mockNFs.findIndex(nf => nf.id === id); if (i !== -1) mockNFs.splice(i, 1); },
};

export const pendService = {
  async listar(module: PendModuleType): Promise<PendItem[]> { await delay(300); return [...getPendStore(module)]; },
  async buscarPorId(module: PendModuleType, id: string): Promise<PendItem | undefined> { await delay(200); return getPendStore(module).find(p => p.id === id); },
  async criar(module: PendModuleType, data: PendFormData): Promise<PendItem> {
    await delay(400);
    const store = getPendStore(module);
    const nova: PendItem = { ...data, id: String(Date.now()), status: 'pendente', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), data_entrega: data.data_entrega || null, data_pagamento: data.data_pagamento || null };
    store.unshift(nova);
    return nova;
  },
  async atualizar(module: PendModuleType, id: string, data: Partial<PendFormData>): Promise<PendItem> {
    await delay(400);
    const store = getPendStore(module);
    const index = store.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Item não encontrado');
    store[index] = { ...store[index], ...data, updated_at: new Date().toISOString() };
    return store[index];
  },
  async excluir(module: PendModuleType, id: string): Promise<void> {
    await delay(300);
    const store = getPendStore(module);
    const i = store.findIndex(p => p.id === id);
    if (i !== -1) store.splice(i, 1);
  },
};

export const userService = { async listar(): Promise<User[]> { await delay(200); return [...mockUsers]; } };
export const activityService = { async listar(): Promise<ActivityLog[]> { await delay(200); return [...mockActivities]; } };
