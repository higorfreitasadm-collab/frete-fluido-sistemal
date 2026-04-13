import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useCriarNF, useAtualizarNF, useNF } from '@/hooks/useNFs';
import { mockUsers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function NFForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const criarNF = useCriarNF();
  const atualizarNF = useAtualizarNF();
  const { data: nfExistente } = useNF(id ?? '');

  const [form, setForm] = useState({
    numero_nf: nfExistente?.numero_nf ?? '',
    remetente: nfExistente?.remetente ?? '',
    destinatario: nfExistente?.destinatario ?? '',
    data_chegada: nfExistente?.data_chegada ?? '',
    data_entrega: nfExistente?.data_entrega ?? '',
    frete: nfExistente?.frete?.toString() ?? '',
    responsavel_id: nfExistente?.responsavel_id ?? '',
    observacoes: nfExistente?.observacoes ?? '',
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...form,
      frete: Number(form.frete.replace(',', '.')),
    };

    try {
      if (isEditing && id) {
        await atualizarNF.mutateAsync({ id, data });
      } else {
        await criarNF.mutateAsync(data);
      }
      navigate('/notas-fiscais');
    } catch {
      toast.error('Erro ao salvar NF.');
    }
  };

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEditing ? 'Editar NF' : 'Nova Nota Fiscal'}</h1>
          <p className="text-muted-foreground text-sm">{isEditing ? 'Atualize as informações da nota fiscal' : 'Preencha os dados da nova nota fiscal de transporte'}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="numero_nf">Número da NF *</Label>
              <Input id="numero_nf" placeholder="Ex: NF-2024-011" value={form.numero_nf} onChange={e => update('numero_nf', e.target.value)} className="bg-secondary" />
              {errors.numero_nf && <p className="text-xs text-destructive">{errors.numero_nf}</p>}
            </div>
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
              <Label htmlFor="frete">Valor do Frete (R$) *</Label>
              <Input id="frete" placeholder="0,00" value={form.frete} onChange={e => update('frete', e.target.value)} className="bg-secondary" />
              {errors.frete && <p className="text-xs text-destructive">{errors.frete}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" placeholder="Observações adicionais sobre a NF..." value={form.observacoes} onChange={e => update('observacoes', e.target.value)} className="bg-secondary min-h-[100px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={criarNF.isPending || atualizarNF.isPending}>
              {(criarNF.isPending || atualizarNF.isPending) ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/notas-fiscais')}>Cancelar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
