import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useCriarPend } from '@/hooks/usePend';
import { mockUsers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { PendModuleType } from '@/types';

export default function NFForm() {
  const navigate = useNavigate();
  const criarPTE = useCriarPend('pend-pte');
  const criarSAL = useCriarPend('pend-sal');

  const [form, setForm] = useState({
    numero_nf: '',
    remetente: '',
    destinatario: '',
    data_chegada: '',
    data_entrega: '',
    frete: '',
    data_pagamento: '',
    responsavel_id: '',
    observacoes: '',
    categoria: '' as '' | PendModuleType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.numero_nf.trim()) e.numero_nf = 'Número da NF é obrigatório';
    if (!form.remetente.trim()) e.remetente = 'Remetente é obrigatório';
    if (!form.destinatario.trim()) e.destinatario = 'Destinatário é obrigatório';
    if (!form.data_chegada) e.data_chegada = 'Data de chegada é obrigatória';
    if (!form.frete || isNaN(Number(form.frete.replace(',', '.')))) e.frete = 'Valor do frete inválido';
    if (!form.responsavel_id) e.responsavel_id = 'Selecione um responsável';
    if (!form.categoria) e.categoria = 'Selecione uma categoria';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      numero_nf: form.numero_nf,
      remetente: form.remetente,
      destinatario: form.destinatario,
      data_chegada: form.data_chegada,
      data_entrega: form.data_entrega,
      frete: Number(form.frete.replace(',', '.')),
      data_pagamento: form.data_pagamento,
      responsavel_id: form.responsavel_id,
      observacoes: form.observacoes,
    };

    try {
      if (form.categoria === 'pend-pte') {
        await criarPTE.mutateAsync(data);
        navigate('/pend-pte');
      } else {
        await criarSAL.mutateAsync(data);
        navigate('/pend-sal');
      }
    } catch {
      toast.error('Erro ao salvar NF.');
    }
  };

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const isPending = criarPTE.isPending || criarSAL.isPending;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nova Nota Fiscal</h1>
          <p className="text-muted-foreground text-sm">Preencha os dados da nova nota fiscal de transporte</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="numero_nf">Número da NF *</Label>
              <Input id="numero_nf" placeholder="Ex: NF-2024-011" value={form.numero_nf} onChange={e => update('numero_nf', e.target.value)} className="bg-secondary" />
              {errors.numero_nf && <p className="text-xs text-destructive">{errors.numero_nf}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={form.categoria} onValueChange={v => update('categoria', v)}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pend-sal">Pendência SAL</SelectItem>
                  <SelectItem value="pend-pte">Pendência PTE</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-xs text-destructive">{errors.categoria}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="remetente">Remetente *</Label>
              <Input id="remetente" placeholder="Nome do remetente" value={form.remetente} onChange={e => update('remetente', e.target.value)} className="bg-secondary" />
              {errors.remetente && <p className="text-xs text-destructive">{errors.remetente}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinatario">Destinatário *</Label>
              <Input id="destinatario" placeholder="Nome do destinatário" value={form.destinatario} onChange={e => update('destinatario', e.target.value)} className="bg-secondary" />
              {errors.destinatario && <p className="text-xs text-destructive">{errors.destinatario}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável *</Label>
              <Select value={form.responsavel_id} onValueChange={v => update('responsavel_id', v)}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Selecione o responsável" /></SelectTrigger>
                <SelectContent>
                  {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.responsavel_id && <p className="text-xs text-destructive">{errors.responsavel_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="frete">Valor do Frete (R$) *</Label>
              <Input id="frete" placeholder="0,00" value={form.frete} onChange={e => update('frete', e.target.value)} className="bg-secondary" />
              {errors.frete && <p className="text-xs text-destructive">{errors.frete}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="data_chegada">Data de Chegada *</Label>
              <Input id="data_chegada" type="date" value={form.data_chegada} onChange={e => update('data_chegada', e.target.value)} className="bg-secondary" />
              {errors.data_chegada && <p className="text-xs text-destructive">{errors.data_chegada}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_entrega">Data de Entrega</Label>
              <Input id="data_entrega" type="date" value={form.data_entrega} onChange={e => update('data_entrega', e.target.value)} className="bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_pagamento">Data de Pagamento</Label>
              <Input id="data_pagamento" type="date" value={form.data_pagamento} onChange={e => update('data_pagamento', e.target.value)} className="bg-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" placeholder="Observações adicionais sobre a NF..." value={form.observacoes} onChange={e => update('observacoes', e.target.value)} className="bg-secondary min-h-[100px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancelar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
