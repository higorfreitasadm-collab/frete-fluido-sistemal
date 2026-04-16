import { z } from 'zod';
import { supabase, isSupabaseReady } from '@/lib/supabase';
import { mockActivities, mockNFs, mockPendPTE, mockPendSal } from '@/data/mock';
import { NotaFiscal, NFFormData, ActivityLog, PendItem, PendFormData, PendModuleType } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SUPABASE_READ_TIMEOUT_MS = 3500;

async function withReadFallback<T>(remotePromise: Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  let timeoutId: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('Supabase request timed out')), SUPABASE_READ_TIMEOUT_MS);
  });

  try {
    return await Promise.race([remotePromise, timeoutPromise]);
  } catch {
    return await fallback();
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

type PendenciaRow = {
  id: string;
  module: PendModuleType;
  numero_nf: string;
  remetente: string;
  destinatario: string;
  cidade: string;
  data_chegada: string;
  data_entrega: string | null;
  frete: number | string;
  data_pagamento: string | null;
  frete_pago: boolean | null;
  status: NotaFiscal['status'];
  observacoes: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityLogRow = {
  id: string;
  descricao: string;
  usuario: string;
  data: string;
  tipo: ActivityLog['tipo'];
  entidade: ActivityLog['entidade'] | null;
  registro_id: string | null;
  module: PendModuleType | null;
};

const pendFormSchema = z.object({
  numero_nf: z.string().trim().min(1, 'Número é obrigatório'),
  remetente: z.string().trim().min(1, 'Remetente é obrigatório'),
  destinatario: z.string().trim().min(1, 'Destinatário é obrigatório'),
  cidade: z.string().trim().min(1, 'Cidade é obrigatória'),
  data_chegada: z.string().trim().min(1, 'Data de chegada é obrigatória'),
  data_entrega: z.string().trim().optional().nullable(),
  frete: z.number().nonnegative('Frete inválido'),
  data_pagamento: z.string().trim().optional().nullable(),
  frete_pago: z.boolean().optional(),
  observacoes: z.string().default(''),
});

const nfFormSchema = z.object({
  numero_nf: z.string().trim().min(1, 'Número é obrigatório'),
  remetente: z.string().trim().min(1, 'Remetente é obrigatório'),
  destinatario: z.string().trim().min(1, 'Destinatário é obrigatório'),
  cidade: z.string().trim().min(1, 'Cidade é obrigatória'),
  data_chegada: z.string().trim().min(1, 'Data de chegada é obrigatória'),
  data_entrega: z.string().trim().optional().nullable(),
  frete: z.number().nonnegative('Frete inválido'),
  observacoes: z.string().default(''),
});

function getPendStore(module: PendModuleType) {
  return module === 'pend-pte' ? mockPendPTE : mockPendSal;
}

function todayISODate() {
  return new Date().toISOString().split('T')[0];
}

function normalizePaidState(data: { data_pagamento?: string | null; frete_pago?: boolean }, fallbackDate?: string | null) {
  const wantsPaid = data.frete_pago ?? Boolean(data.data_pagamento);
  const paymentDate = wantsPaid ? (data.data_pagamento ?? fallbackDate ?? todayISODate()) : null;
  return { frete_pago: wantsPaid && !!paymentDate, data_pagamento: paymentDate };
}

function createLocalActivity(params: Omit<ActivityLog, 'id' | 'data' | 'usuario'> & { usuario?: string; data?: string }) {
  const entry: ActivityLog = {
    id: String(Date.now() + Math.random()),
    data: params.data ?? new Date().toISOString(),
    usuario: params.usuario ?? 'Sistema',
    descricao: params.descricao,
    tipo: params.tipo,
    entidade: params.entidade,
    registro_id: params.registro_id,
    module: params.module,
  };
  mockActivities.unshift(entry);
  return entry;
}

function parseMaybeDate(date: string | null | undefined) {
  if (!date) return null;
  return date.trim() ? date.trim() : null;
}

function toPendItem(row: PendenciaRow): PendItem {
  return {
    id: row.id,
    numero_nf: row.numero_nf,
    remetente: row.remetente,
    destinatario: row.destinatario,
    cidade: row.cidade,
    data_chegada: row.data_chegada,
    data_entrega: row.data_entrega ?? null,
    frete: Number(row.frete),
    data_pagamento: row.data_pagamento ?? null,
    frete_pago: Boolean(row.frete_pago ?? row.data_pagamento),
    status: row.status,
    observacoes: row.observacoes ?? '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function toNotaFiscal(row: PendenciaRow): NotaFiscal {
  return {
    id: row.id,
    numero_nf: row.numero_nf,
    remetente: row.remetente,
    destinatario: row.destinatario,
    cidade: row.cidade,
    data_chegada: row.data_chegada,
    data_entrega: row.data_entrega ?? null,
    frete: Number(row.frete),
    status: row.status,
    observacoes: row.observacoes ?? '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function toPendInsert(module: PendModuleType, data: PendFormData) {
  const parsed = pendFormSchema.parse({
    ...data,
    data_entrega: parseMaybeDate(data.data_entrega),
    data_pagamento: parseMaybeDate(data.data_pagamento),
    frete_pago: data.frete_pago,
  });
  const paid = normalizePaidState(parsed, parsed.data_pagamento);
  const now = new Date().toISOString();
  return {
    module,
    numero_nf: parsed.numero_nf,
    remetente: parsed.remetente,
    destinatario: parsed.destinatario,
    cidade: parsed.cidade,
    data_chegada: parsed.data_chegada,
    data_entrega: parsed.data_entrega ?? null,
    frete: parsed.frete,
    data_pagamento: paid.data_pagamento,
    frete_pago: paid.frete_pago,
    status: 'pendente' as const,
    observacoes: parsed.observacoes,
    usuario: 'Sistema',
    created_at: now,
    updated_at: now,
  };
}

function toNFInsert(data: NFFormData) {
  const parsed = nfFormSchema.parse({
    ...data,
    data_entrega: parseMaybeDate(data.data_entrega),
  });
  const now = new Date().toISOString();
  return {
    numero_nf: parsed.numero_nf,
    remetente: parsed.remetente,
    destinatario: parsed.destinatario,
    cidade: parsed.cidade,
    data_chegada: parsed.data_chegada,
    data_entrega: parsed.data_entrega ?? null,
    frete: parsed.frete,
    status: 'pendente' as const,
    observacoes: parsed.observacoes,
    usuario: 'Sistema',
    created_at: now,
    updated_at: now,
  };
}

async function listPendSupabase(module: PendModuleType): Promise<PendItem[]> {
  const { data, error } = await supabase
    .from('pendencias')
    .select('*')
    .eq('module', module)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toPendItem);
}

async function fetchPendSupabase(module: PendModuleType, id: string): Promise<PendItem | undefined> {
  const { data, error } = await supabase
    .from('pendencias')
    .select('*')
    .eq('module', module)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? toPendItem(data) : undefined;
}

async function createPendSupabase(module: PendModuleType, data: PendFormData): Promise<PendItem> {
  const payload = toPendInsert(module, data);
  const { data: inserted, error } = await supabase
    .from('pendencias')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return toPendItem(inserted);
}

async function updatePendSupabase(module: PendModuleType, id: string, data: Partial<PendFormData>): Promise<PendItem> {
  const current = await fetchPendSupabase(module, id);
  if (!current) throw new Error('Item não encontrado');

  const merged = {
    numero_nf: data.numero_nf ?? current.numero_nf,
    remetente: data.remetente ?? current.remetente,
    destinatario: data.destinatario ?? current.destinatario,
    cidade: data.cidade ?? current.cidade,
    data_chegada: data.data_chegada ?? current.data_chegada,
    data_entrega: data.data_entrega === undefined ? current.data_entrega : parseMaybeDate(data.data_entrega),
    frete: data.frete ?? current.frete,
    data_pagamento: data.data_pagamento === undefined ? current.data_pagamento : parseMaybeDate(data.data_pagamento),
    frete_pago: data.frete_pago ?? current.frete_pago,
    observacoes: data.observacoes ?? current.observacoes,
  };
  const paid = normalizePaidState(merged, merged.data_pagamento ?? current.data_pagamento);
  const patch = {
    numero_nf: merged.numero_nf,
    remetente: merged.remetente,
    destinatario: merged.destinatario,
    cidade: merged.cidade,
    data_chegada: merged.data_chegada,
    data_entrega: merged.data_entrega,
    frete: merged.frete,
    data_pagamento: paid.data_pagamento,
    frete_pago: paid.frete_pago,
    observacoes: merged.observacoes,
    updated_at: new Date().toISOString(),
  };

  const { data: updated, error } = await supabase
    .from('pendencias')
    .update(patch)
    .eq('module', module)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toPendItem(updated);
}

async function deletePendSupabase(module: PendModuleType, id: string): Promise<void> {
  const { error } = await supabase
    .from('pendencias')
    .delete()
    .eq('module', module)
    .eq('id', id);

  if (error) throw error;
}

async function listActivitiesSupabase(): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('data', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: ActivityLogRow) => ({
    id: row.id,
    descricao: row.descricao,
    usuario: row.usuario,
    data: row.data,
    tipo: row.tipo,
    entidade: row.entidade ?? undefined,
    registro_id: row.registro_id ?? undefined,
    module: row.module ?? undefined,
  }));
}

export const nfService = {
  async listar(): Promise<NotaFiscal[]> {
    if (!isSupabaseReady) {
      await delay(150);
      return [...mockNFs];
    }

    return withReadFallback(
      (async () => {
        const { data, error } = await supabase
          .from('pendencias')
          .select('*')
          .eq('module', 'pend-pte')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data ?? []).map(toNotaFiscal);
      })(),
      async () => [...mockNFs],
    );
  },
  async buscarPorId(id: string): Promise<NotaFiscal | undefined> {
    if (!isSupabaseReady) {
      await delay(100);
      return mockNFs.find(nf => nf.id === id);
    }

    return withReadFallback(
      (async () => {
        const { data, error } = await supabase
          .from('pendencias')
          .select('*')
          .eq('module', 'pend-pte')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        return data ? toNotaFiscal(data) : undefined;
      })(),
      async () => mockNFs.find(nf => nf.id === id),
    );
  },
  async criar(data: NFFormData): Promise<NotaFiscal> {
    if (!isSupabaseReady) {
      await delay(150);
      const now = new Date().toISOString();
      const nova: NotaFiscal = {
        ...data,
        id: String(Date.now()),
        status: 'pendente',
        created_at: now,
        updated_at: now,
        data_entrega: data.data_entrega || null,
      };
      mockNFs.unshift(nova);
      createLocalActivity({
        tipo: 'criacao',
        descricao: `NF ${nova.numero_nf} criada`,
        entidade: 'nf',
        registro_id: nova.id,
      });
      return nova;
    }

    const payload = toNFInsert(data);
    const { data: inserted, error } = await supabase
      .from('pendencias')
      .insert({ ...payload, module: 'pend-pte' })
      .select('*')
      .single();

    if (error) throw error;
    return toNotaFiscal(inserted);
  },
  async atualizar(id: string, data: Partial<NFFormData>): Promise<NotaFiscal> {
    if (!isSupabaseReady) {
      await delay(150);
      const index = mockNFs.findIndex(nf => nf.id === id);
      if (index === -1) throw new Error('NF não encontrada');
      const next = { ...mockNFs[index], ...data, updated_at: new Date().toISOString() };
      mockNFs[index] = next;
      createLocalActivity({
        tipo: 'edicao',
        descricao: `NF ${next.numero_nf} atualizada`,
        entidade: 'nf',
        registro_id: next.id,
      });
      return next;
    }

    const current = await nfService.buscarPorId(id);
    if (!current) throw new Error('NF não encontrada');
    const patch = {
      numero_nf: data.numero_nf ?? current.numero_nf,
      remetente: data.remetente ?? current.remetente,
      destinatario: data.destinatario ?? current.destinatario,
      cidade: data.cidade ?? current.cidade,
      data_chegada: data.data_chegada ?? current.data_chegada,
      data_entrega: data.data_entrega === undefined ? current.data_entrega : parseMaybeDate(data.data_entrega),
      frete: data.frete ?? current.frete,
      observacoes: data.observacoes ?? current.observacoes,
      updated_at: new Date().toISOString(),
    };
    const { data: updated, error } = await supabase
      .from('pendencias')
      .update(patch)
      .eq('id', id)
      .eq('module', 'pend-pte')
      .select('*')
      .single();

    if (error) throw error;
    return toNotaFiscal(updated);
  },
  async excluir(id: string): Promise<void> {
    if (!isSupabaseReady) {
      await delay(100);
      const index = mockNFs.findIndex(nf => nf.id === id);
      if (index !== -1) {
        const [removed] = mockNFs.splice(index, 1);
        createLocalActivity({
          tipo: 'exclusao',
          descricao: `NF ${removed.numero_nf} excluída`,
          entidade: 'nf',
          registro_id: removed.id,
        });
      }
      return;
    }

    const { error } = await supabase
      .from('pendencias')
      .delete()
      .eq('id', id)
      .eq('module', 'pend-pte');

    if (error) throw error;
  },
};

export const pendService = {
  async listar(module: PendModuleType): Promise<PendItem[]> {
    if (!isSupabaseReady) {
      await delay(150);
      return [...getPendStore(module)];
    }
    return withReadFallback(listPendSupabase(module), async () => [...getPendStore(module)]);
  },
  async buscarPorId(module: PendModuleType, id: string): Promise<PendItem | undefined> {
    if (!isSupabaseReady) {
      await delay(100);
      return getPendStore(module).find(p => p.id === id);
    }
    return withReadFallback(fetchPendSupabase(module, id), async () => getPendStore(module).find(p => p.id === id));
  },
  async criar(module: PendModuleType, data: PendFormData): Promise<PendItem> {
    if (!isSupabaseReady) {
      await delay(150);
      const store = getPendStore(module);
      const now = new Date().toISOString();
      const parsed = pendFormSchema.parse({
        ...data,
        data_entrega: parseMaybeDate(data.data_entrega),
        data_pagamento: parseMaybeDate(data.data_pagamento),
      });
      const paid = normalizePaidState(parsed, parsed.data_pagamento);
      const nova: PendItem = {
        ...parsed,
        id: String(Date.now()),
        status: 'pendente',
        created_at: now,
        updated_at: now,
        data_entrega: parsed.data_entrega ?? null,
        data_pagamento: paid.data_pagamento,
        frete_pago: paid.frete_pago,
      };
      store.unshift(nova);
      createLocalActivity({
        tipo: 'criacao',
        descricao: `Registro ${nova.numero_nf} criado no módulo ${module === 'pend-pte' ? 'PTE' : 'SAL'}`,
        entidade: 'pendencia',
        registro_id: nova.id,
        module,
      });
      if (nova.frete_pago) {
        createLocalActivity({
          tipo: 'edicao',
          descricao: `Registro ${nova.numero_nf} salvo como frete pago`,
          entidade: 'pendencia',
          registro_id: nova.id,
          module,
        });
      }
      return nova;
    }

    return createPendSupabase(module, data);
  },
  async atualizar(module: PendModuleType, id: string, data: Partial<PendFormData>): Promise<PendItem> {
    if (!isSupabaseReady) {
      await delay(150);
      const store = getPendStore(module);
      const index = store.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Item não encontrado');
      const previous = store[index];
      const payload = {
        numero_nf: data.numero_nf ?? previous.numero_nf,
        remetente: data.remetente ?? previous.remetente,
        destinatario: data.destinatario ?? previous.destinatario,
        cidade: data.cidade ?? previous.cidade,
        data_chegada: data.data_chegada ?? previous.data_chegada,
        data_entrega: data.data_entrega === undefined ? previous.data_entrega : parseMaybeDate(data.data_entrega),
        frete: data.frete ?? previous.frete,
        data_pagamento: data.data_pagamento === undefined ? previous.data_pagamento : parseMaybeDate(data.data_pagamento),
        frete_pago: data.frete_pago ?? previous.frete_pago,
        observacoes: data.observacoes ?? previous.observacoes,
      };
      const paid = normalizePaidState(payload, payload.data_pagamento ?? previous.data_pagamento);
      const next: PendItem = {
        ...previous,
        ...payload,
        data_entrega: payload.data_entrega ?? null,
        data_pagamento: paid.data_pagamento,
        frete_pago: paid.frete_pago,
        updated_at: new Date().toISOString(),
      };
      store[index] = next;
      createLocalActivity({
        tipo: 'edicao',
        descricao: `Registro ${next.numero_nf} atualizado no módulo ${module === 'pend-pte' ? 'PTE' : 'SAL'}`,
        entidade: 'pendencia',
        registro_id: next.id,
        module,
      });
      if (previous.data_pagamento !== next.data_pagamento) {
        createLocalActivity({
          tipo: next.frete_pago ? 'entrega' : 'edicao',
          descricao: next.frete_pago
            ? `Registro ${next.numero_nf} marcado como frete pago`
            : `Registro ${next.numero_nf} desmarcado como frete pago`,
          entidade: 'pendencia',
          registro_id: next.id,
          module,
        });
      }
      return next;
    }

    return updatePendSupabase(module, id, data);
  },
  async excluir(module: PendModuleType, id: string): Promise<void> {
    if (!isSupabaseReady) {
      await delay(100);
      const store = getPendStore(module);
      const index = store.findIndex(p => p.id === id);
      if (index !== -1) {
        const [removed] = store.splice(index, 1);
        createLocalActivity({
          tipo: 'exclusao',
          descricao: `Registro ${removed.numero_nf} excluído do módulo ${module === 'pend-pte' ? 'PTE' : 'SAL'}`,
          entidade: 'pendencia',
          registro_id: removed.id,
          module,
        });
      }
      return;
    }

    await deletePendSupabase(module, id);
  },
};

export const activityService = {
  async listar(): Promise<ActivityLog[]> {
    if (!isSupabaseReady) {
      await delay(100);
      return [...mockActivities];
    }

    return withReadFallback(listActivitiesSupabase(), async () => [...mockActivities]);
  },
};
