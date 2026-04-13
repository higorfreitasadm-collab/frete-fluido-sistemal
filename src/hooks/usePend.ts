import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pendService } from '@/services/api';
import { PendFormData, PendModuleType } from '@/types';
import { toast } from 'sonner';

export function usePendItems(module: PendModuleType) {
  return useQuery({
    queryKey: ['pend', module],
    queryFn: () => pendService.listar(module),
  });
}

export function usePendItem(module: PendModuleType, id: string) {
  return useQuery({
    queryKey: ['pend', module, id],
    queryFn: () => pendService.buscarPorId(module, id),
    enabled: !!id,
  });
}

export function useCriarPend(module: PendModuleType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PendFormData) => pendService.criar(module, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pend', module] }); toast.success('Registro criado com sucesso!'); },
    onError: () => toast.error('Erro ao criar registro.'),
  });
}

export function useAtualizarPend(module: PendModuleType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PendFormData> }) => pendService.atualizar(module, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pend', module] }); toast.success('Registro atualizado com sucesso!'); },
    onError: () => toast.error('Erro ao atualizar registro.'),
  });
}

export function useExcluirPend(module: PendModuleType) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pendService.excluir(module, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pend', module] }); toast.success('Registro excluído com sucesso!'); },
    onError: () => toast.error('Erro ao excluir registro.'),
  });
}
