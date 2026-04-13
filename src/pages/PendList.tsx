import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentBadge } from '@/components/PaymentBadge';
import { usePendItems, useExcluirPend } from '@/hooks/usePend';
import { mockUsers } from '@/data/mock';
import { PendItem, PendModuleType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Download, Printer, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const PAGE_SIZE = 8;

interface PendListConfig {
  module: PendModuleType;
  titulo: string;
  subtitulo: string;
  novaPath: string;
  editarPath: string;
}

export default function PendList({ module, titulo, subtitulo, novaPath, editarPath }: PendListConfig) {
  const { data: items = [], isLoading } = usePendItems(module);
  const excluir = useExcluirPend(module);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroResponsavel, setFiltroResponsavel] = useState('todos');
  const [filtroPagamento, setFiltroPagamento] = useState('todos');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof PendItem>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [detalhes, setDetalhes] = useState<PendItem | null>(null);

  const filtered = useMemo(() => {
    let result = [...items];
    if (busca) {
      const q = busca.toLowerCase();
      result = result.filter(item =>
        item.numero_nf.toLowerCase().includes(q) ||
        item.remetente.toLowerCase().includes(q) ||
        item.destinatario.toLowerCase().includes(q)
      );
    }
    if (filtroStatus !== 'todos') result = result.filter(i => i.status === filtroStatus);
    if (filtroResponsavel !== 'todos') result = result.filter(i => i.responsavel_id === filtroResponsavel);
    if (filtroPagamento === 'pago') result = result.filter(i => !!i.data_pagamento);
    if (filtroPagamento === 'pendente') result = result.filter(i => !i.data_pagamento);
    result.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [items, busca, filtroStatus, filtroResponsavel, filtroPagamento, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: keyof PendItem) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const getResponsavel = (id: string) => mockUsers.find(u => u.id === id)?.nome ?? '—';

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      excluir.mutate(id);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{titulo}</h1>
            <p className="text-muted-foreground text-sm">{subtitulo}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exportação em desenvolvimento')}>
              <Download className="h-4 w-4 mr-1" /> Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> Imprimir
            </Button>
            <Link to={novaPath}>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Registro</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por número, remetente ou destinatário..." className="pl-10 bg-secondary" value={busca} onChange={e => { setBusca(e.target.value); setPage(1); }} />
          </div>
          <Select value={filtroStatus} onValueChange={v => { setFiltroStatus(v); setPage(1); }}>
            <SelectTrigger className="w-40 bg-secondary"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="atrasada">Atrasada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroPagamento} onValueChange={v => { setFiltroPagamento(v); setPage(1); }}>
            <SelectTrigger className="w-44 bg-secondary"><SelectValue placeholder="Pagamento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Pagamentos</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pgto. Pendente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroResponsavel} onValueChange={v => { setFiltroResponsavel(v); setPage(1); }}>
            <SelectTrigger className="w-48 bg-secondary"><SelectValue placeholder="Responsável" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Responsáveis</SelectItem>
              {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {[
                    { key: 'numero_nf' as const, label: 'Número' },
                    { key: 'remetente' as const, label: 'Remetente' },
                    { key: 'destinatario' as const, label: 'Destinatário' },
                    { key: 'data_chegada' as const, label: 'Chegada' },
                    { key: 'data_entrega' as const, label: 'Entrega' },
                    { key: 'frete' as const, label: 'Frete' },
                    { key: 'data_pagamento' as const, label: 'Pagamento' },
                    { key: 'status' as const, label: 'Status' },
                  ].map(col => (
                    <th key={col.key} className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(col.key)}>
                      {col.label} {sortKey === col.key && (sortAsc ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resp.</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={10} className="text-center py-12 text-muted-foreground">Carregando...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12 text-muted-foreground">Nenhum registro encontrado.</td></tr>
                ) : paginated.map(item => (
                  <tr key={item.id} className={`border-b border-border/30 hover:bg-secondary/50 transition-colors ${item.status === 'atrasada' ? 'border-l-2 border-l-destructive' : ''}`}>
                    <td className="px-3 py-3 text-sm font-medium text-foreground">{item.numero_nf}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{item.remetente}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{item.destinatario}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{new Date(item.data_chegada).toLocaleDateString('pt-BR')}</td>
                    <td className="px-3 py-3 text-sm text-muted-foreground">{item.data_entrega ? new Date(item.data_entrega).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-3 py-3 text-sm font-medium text-foreground">{formatCurrency(item.frete)}</td>
                    <td className="px-3 py-3">
                      <PaymentBadge dataPagamento={item.data_pagamento} />
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-3 py-3 text-sm text-muted-foreground truncate max-w-[100px]">{getResponsavel(item.responsavel_id)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-info" onClick={() => setDetalhes(item)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Link to={`${editarPath}/${item.id}`}><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-warning"><Pencil className="h-3.5 w-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleExcluir(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Exibindo {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!detalhes} onOpenChange={() => setDetalhes(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Detalhes do Registro</DialogTitle></DialogHeader>
          {detalhes && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{detalhes.numero_nf}</span>
                <div className="flex gap-2">
                  <StatusBadge status={detalhes.status} />
                  <PaymentBadge dataPagamento={detalhes.data_pagamento} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Remetente</p><p className="text-foreground font-medium">{detalhes.remetente}</p></div>
                <div><p className="text-muted-foreground">Destinatário</p><p className="text-foreground font-medium">{detalhes.destinatario}</p></div>
                <div><p className="text-muted-foreground">Data de Chegada</p><p className="text-foreground font-medium">{new Date(detalhes.data_chegada).toLocaleDateString('pt-BR')}</p></div>
                <div><p className="text-muted-foreground">Data de Entrega</p><p className="text-foreground font-medium">{detalhes.data_entrega ? new Date(detalhes.data_entrega).toLocaleDateString('pt-BR') : 'Não entregue'}</p></div>
                <div><p className="text-muted-foreground">Valor do Frete</p><p className="text-foreground font-medium">{formatCurrency(detalhes.frete)}</p></div>
                <div><p className="text-muted-foreground">Data de Pagamento</p><p className="text-foreground font-medium">{detalhes.data_pagamento ? new Date(detalhes.data_pagamento).toLocaleDateString('pt-BR') : 'Não pago'}</p></div>
                <div><p className="text-muted-foreground">Responsável</p><p className="text-foreground font-medium">{getResponsavel(detalhes.responsavel_id)}</p></div>
              </div>
              {detalhes.observacoes ? (
                <div><p className="text-muted-foreground text-sm">Observações</p><p className="text-foreground text-sm mt-1 bg-secondary p-3 rounded-lg">{detalhes.observacoes}</p></div>
              ) : (
                <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 p-3 rounded-lg">⚠️ Sem observações registradas</div>
              )}
              <div className="text-xs text-muted-foreground">
                Criado em: {new Date(detalhes.created_at).toLocaleString('pt-BR')} · Atualizado em: {new Date(detalhes.updated_at).toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
