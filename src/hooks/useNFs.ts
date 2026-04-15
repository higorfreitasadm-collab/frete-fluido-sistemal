import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nfService } from '@/services/api';
import { NFFormData } from '@/types';
import { toast } from 'sonner';

export function useNFs() {
  return useQuery({
    queryKey: ['nfs'],
    queryFn: nfService.listar,
  });
}

export function useNF(id: string) {
  return useQuery({
    queryKey: ['nf', id],
    queryFn: () => nfService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NFFormData) => nfService.criar(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nfs'] });
      qc.invalidateQueries({ queryKey: ['activities'] });
      toast.success('NF criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar NF.'),
  });
}

export function useAtualizarNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NFFormData> }) => nfService.atualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nfs'] });
      qc.invalidateQueries({ queryKey: ['activities'] });
      toast.success('NF atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar NF.'),
  });
}

export function useExcluirNF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => nfService.excluir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nfs'] });
      qc.invalidateQueries({ queryKey: ['activities'] });
      toast.success('NF excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir NF.'),
  });
}
