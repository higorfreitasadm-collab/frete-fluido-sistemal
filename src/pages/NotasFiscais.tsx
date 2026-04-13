import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useNFs, useExcluirNF } from '@/hooks/useNFs';
import { mockUsers } from '@/data/mock';
import { NFStatus, NotaFiscal } from '@/types';
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

export default function NotasFiscais() {
  const { data: nfs = [], isLoading } = useNFs();
  const excluirNF = useExcluirNF();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroResponsavel, setFiltroResponsavel] = useState<string>('todos');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof NotaFiscal>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [detalhesNF, setDetalhesNF] = useState<NotaFiscal | null>(null);

  const filtered = useMemo(() => {
    let result = [...nfs];
    if (busca) {
      const q = busca.toLowerCase();
      result = result.filter(nf =>
        nf.numero_nf.toLowerCase().includes(q) ||
        nf.remetente.toLowerCase().includes(q) ||
        nf.destinatario.toLowerCase().includes(q)
      );
    }
    if (filtroStatus !== 'todos') result = result.filter(nf => nf.status === filtroStatus);
    if (filtroResponsavel !== 'todos') result = result.filter(nf => nf.responsavel_id === filtroResponsavel);
    result.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return result;
  }, [nfs, busca, filtroStatus, filtroResponsavel, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedNFs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: keyof NotaFiscal) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const getResponsavel = (id: string) => mockUsers.find(u => u.id === id)?.nome ?? '—';

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta NF?')) {
      excluirNF.mutate(id);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notas Fiscais</h1>
            <p className="text-muted-foreground text-sm">Gerencie todas as notas fiscais de transporte</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exportação em desenvolvimento')}>
              <Download className="h-4 w-4 mr-1" /> Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> Imprimir
            </Button>
            <Link to="/nova-nf">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Nova NF
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
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
                    { key: 'numero_nf' as const, label: 'Número da NF' },
                    { key: 'remetente' as const, label: 'Remetente' },
                    { key: 'destinatario' as const, label: 'Destinatário' },
                    { key: 'data_chegada' as const, label: 'Chegada' },
                    { key: 'data_entrega' as const, label: 'Entrega' },
                    { key: 'frete' as const, label: 'Frete' },
                    { key: 'status' as const, label: 'Status' },
                  ].map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort(col.key)}>
                      {col.label} {sortKey === col.key && (sortAsc ? '↑' : '↓')}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responsável</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Carregando...</td></tr>
                ) : paginatedNFs.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Nenhuma NF encontrada.</td></tr>
                ) : paginatedNFs.map(nf => (
                  <tr key={nf.id} className={`border-b border-border/30 hover:bg-secondary/50 transition-colors ${nf.status === 'atrasada' ? 'border-l-2 border-l-destructive' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{nf.numero_nf}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nf.remetente}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nf.destinatario}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(nf.data_chegada).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nf.data_entrega ? new Date(nf.data_entrega).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{formatCurrency(nf.frete)}</td>
                    <td className="px-4 py-3"><StatusBadge status={nf.status} /></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{getResponsavel(nf.responsavel_id)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-info" onClick={() => setDetalhesNF(nf)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Link to={`/editar-nf/${nf.id}`}><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-warning"><Pencil className="h-3.5 w-3.5" /></Button></Link>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleExcluir(nf.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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

      <Dialog open={!!detalhesNF} onOpenChange={() => setDetalhesNF(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Detalhes da NF</DialogTitle></DialogHeader>
          {detalhesNF && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{detalhesNF.numero_nf}</span>
                <StatusBadge status={detalhesNF.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Remetente</p><p className="text-foreground font-medium">{detalhesNF.remetente}</p></div>
                <div><p className="text-muted-foreground">Destinatário</p><p className="text-foreground font-medium">{detalhesNF.destinatario}</p></div>
                <div><p className="text-muted-foreground">Data de Chegada</p><p className="text-foreground font-medium">{new Date(detalhesNF.data_chegada).toLocaleDateString('pt-BR')}</p></div>
                <div><p className="text-muted-foreground">Data de Entrega</p><p className="text-foreground font-medium">{detalhesNF.data_entrega ? new Date(detalhesNF.data_entrega).toLocaleDateString('pt-BR') : 'Não entregue'}</p></div>
                <div><p className="text-muted-foreground">Valor do Frete</p><p className="text-foreground font-medium">{formatCurrency(detalhesNF.frete)}</p></div>
                <div><p className="text-muted-foreground">Responsável</p><p className="text-foreground font-medium">{getResponsavel(detalhesNF.responsavel_id)}</p></div>
              </div>
              {detalhesNF.observacoes && (
                <div><p className="text-muted-foreground text-sm">Observações</p><p className="text-foreground text-sm mt-1 bg-secondary p-3 rounded-lg">{detalhesNF.observacoes}</p></div>
              )}
              {!detalhesNF.observacoes && (
                <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 p-3 rounded-lg">
                  ⚠️ Sem observações registradas
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Criado em: {new Date(detalhesNF.created_at).toLocaleString('pt-BR')} · Atualizado em: {new Date(detalhesNF.updated_at).toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
