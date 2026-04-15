import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useCriarPend, useAtualizarPend, usePendItem } from '@/hooks/usePend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PendModuleType } from '@/types';

interface PendFormConfig {
  module: PendModuleType;
  titulo: string;
  tituloEditar: string;
  voltarPath: string;
}

interface PendFormState {
  numero_nf: string;
  remetente: string;
  destinatario: string;
  cidade: string;
  data_chegada: string;
  data_entrega: string;
  frete: string;
  data_pagamento: string;
  observacoes: string;
  frete_pago: boolean;
}

export default function PendForm({ module, titulo, tituloEditar, voltarPath }: PendFormConfig) {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const criar = useCriarPend(module);
  const atualizar = useAtualizarPend(module);
  const { data: existente } = usePendItem(module, id ?? '');

  const [form, setForm] = useState<PendFormState>({
    numero_nf: '',
    remetente: '',
    destinatario: '',
    cidade: '',
    data_chegada: '',
    data_entrega: '',
    frete: '',
    data_pagamento: '',
    observacoes: '',
    frete_pago: false,
  });

  useEffect(() => {
    if (existente) {
      setForm({
        numero_nf: existente.numero_nf ?? '',
        remetente: existente.remetente ?? '',
        destinatario: existente.destinatario ?? '',
        cidade: existente.cidade ?? '',
        data_chegada: existente.data_chegada ?? '',
        data_entrega: existente.data_entrega ?? '',
        frete: existente.frete?.toString() ?? '',
        data_pagamento: existente.data_pagamento ?? '',
        observacoes: existente.observacoes ?? '',
        frete_pago: !!existente.data_pagamento,
      });
    }
  }, [existente]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.numero_nf.trim()) e.numero_nf = 'Número é obrigatório';
    if (!form.remetente.trim()) e.remetente = 'Remetente é obrigatório';
    if (!form.destinatario.trim()) e.destinatario = 'Destinatário é obrigatório';
    if (!form.cidade.trim()) e.cidade = 'Cidade é obrigatória';
    if (!form.data_chegada) e.data_chegada = 'Data de chegada é obrigatória';
    if (!form.frete || isNaN(Number(form.frete.replace(',', '.')))) e.frete = 'Valor do frete inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      ...form,
      frete: Number(form.frete.replace(',', '.')),
      data_pagamento: form.frete_pago ? (form.data_pagamento || new Date().toISOString().split('T')[0]) : null,
      frete_pago: form.frete_pago,
    };
    try {
      if (isEditing && id) {
        await atualizar.mutateAsync({ id, data });
      } else {
        await criar.mutateAsync(data);
      }
      navigate(voltarPath);
    } catch {
      toast.error('Erro ao salvar registro.');
    }
  };

  const update = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (typeof value === 'string' && errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEditing ? tituloEditar : titulo}</h1>
          <p className="text-muted-foreground text-sm">{isEditing ? 'Atualize as informações do registro' : 'Preencha os dados do novo registro'}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="numero_nf">Número da NF *</Label>
              <Input id="numero_nf" placeholder="Ex: PTE-2024-011" value={form.numero_nf} onChange={e => update('numero_nf', e.target.value)} className="bg-secondary" />
              {errors.numero_nf && <p className="text-xs text-destructive">{errors.numero_nf}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input id="cidade" placeholder="Ex: São Paulo" value={form.cidade} onChange={e => update('cidade', e.target.value)} className="bg-secondary" />
              {errors.cidade && <p className="text-xs text-destructive">{errors.cidade}</p>}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <Label htmlFor="frete">Valor do Frete (R$) *</Label>
              <Input id="frete" placeholder="0,00" value={form.frete} onChange={e => update('frete', e.target.value)} className="bg-secondary" />
              {errors.frete && <p className="text-xs text-destructive">{errors.frete}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_pagamento">Data de Pagamento</Label>
              <Input id="data_pagamento" type="date" value={form.data_pagamento} onChange={e => update('data_pagamento', e.target.value)} className="bg-secondary" disabled={!form.frete_pago} />
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border/50">
              <Switch
                id="frete_pago"
                checked={form.frete_pago}
                onCheckedChange={(checked) => update('frete_pago', checked)}
              />
              <Label htmlFor="frete_pago" className="text-sm font-medium cursor-pointer">
                Frete pago
              </Label>
              {form.frete_pago && (
                <span className="text-xs text-success ml-2">✓ Marcado como pago</span>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" placeholder="Observações adicionais..." value={form.observacoes} onChange={e => update('observacoes', e.target.value)} className="bg-secondary min-h-[100px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={criar.isPending || atualizar.isPending}>
              {(criar.isPending || atualizar.isPending) ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(voltarPath)}>Cancelar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
