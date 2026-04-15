import { AppLayout } from '@/components/AppLayout';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentBadge } from '@/components/PaymentBadge';
import { usePendItems } from '@/hooks/usePend';
import { usePendItems } from '@/hooks/usePend';
import { mockActivities } from '@/data/mock';
import { FileText, Clock, CheckCircle, AlertTriangle, DollarSign, CreditCard, Banknote, CalendarClock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard() {
  const { data: pendPTE = [], isLoading: loadingPTE } = usePendItems('pend-pte');
  const { data: pendSal = [], isLoading: loadingSal } = usePendItems('pend-sal');

  const allPend = [...pendPTE, ...pendSal];

  const total = allPend.length;
  const pendentes = allPend.filter(n => n.status === 'pendente').length;
  const entregues = allPend.filter(n => n.status === 'entregue').length;
  const atrasadas = allPend.filter(n => n.status === 'atrasada').length;
  const totalFrete = allPend.reduce((sum, n) => sum + n.frete, 0);

  const pgtosPendentes = allPend.filter(p => !p.data_pagamento).length;
  const valorAReceber = allPend.filter(p => !p.data_pagamento).reduce((s, p) => s + p.frete, 0);
  const valorPago = allPend.filter(p => !!p.data_pagamento).reduce((s, p) => s + p.frete, 0);

  const statusData = [
    { name: 'Pendentes', valor: pendentes, fill: 'hsl(38, 92%, 50%)' },
    { name: 'Entregues', valor: entregues, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Atrasadas', valor: atrasadas, fill: 'hsl(0, 84%, 60%)' },
  ];

  const freteData = [
    { mes: 'Out', frete: 12500 },
    { mes: 'Nov', frete: 18900 },
    { mes: 'Dez', frete: totalFrete },
  ];

  const pagamentoData = [
    { mes: 'Out', pago: 8500, pendente: 4000 },
    { mes: 'Nov', pago: 12000, pendente: 6900 },
    { mes: 'Dez', pago: valorPago, pendente: valorAReceber },
  ];

  const ultimasNFs = [...allPend].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const pendentesAntigas = allPend.filter(n => n.status === 'pendente' || n.status === 'atrasada').sort((a, b) => new Date(a.data_chegada).getTime() - new Date(b.data_chegada).getTime()).slice(0, 5);

  const tooltipStyle = { backgroundColor: 'hsl(217, 33%, 17%)', border: '1px solid hsl(217, 33%, 22%)', borderRadius: '8px', color: '#fff' };

  if (loadingPTE || loadingSal) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral das notas fiscais de transporte</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <MetricCard titulo="Total de NFs" valor={total} icon={FileText} />
          <MetricCard titulo="Pendentes" valor={pendentes} icon={Clock} variante="warning" />
          <MetricCard titulo="Entregues" valor={entregues} icon={CheckCircle} variante="success" />
          <MetricCard titulo="Atrasadas" valor={atrasadas} icon={AlertTriangle} variante="destructive" />
          <MetricCard titulo="Total em Frete" valor={formatCurrency(totalFrete)} icon={DollarSign} />
          <MetricCard titulo="Pgtos. Pendentes" valor={pgtosPendentes} icon={CalendarClock} variante="warning" subtexto="PTE + Sal" />
          <MetricCard titulo="A Receber" valor={formatCurrency(valorAReceber)} icon={Banknote} variante="destructive" subtexto="PTE + Sal" />
          <MetricCard titulo="Total Pago" valor={formatCurrency(valorPago)} icon={CreditCard} variante="success" subtexto="PTE + Sal" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">NFs por Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frete ao Longo do Tempo</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={freteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                <XAxis dataKey="mes" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="frete" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 60%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Pagamentos por Período</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pagamentoData}>
                <XAxis dataKey="mes" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="pago" name="Pago" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="pendente" name="Pendente" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Últimas NFs Lançadas</h3>
            <div className="space-y-3">
              {ultimasNFs.map(nf => (
                <div key={nf.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{nf.numero_nf}</p>
                    <p className="text-xs text-muted-foreground">{nf.remetente}</p>
                  </div>
                  <StatusBadge status={nf.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">NFs Pendentes Há Mais Tempo</h3>
            <div className="space-y-3">
              {pendentesAntigas.map(nf => (
                <div key={nf.id} className={`flex items-center justify-between py-2 border-b last:border-0 ${nf.status === 'atrasada' ? 'border-destructive/30' : 'border-border/50'}`}>
                  <div>
                    <p className="text-sm font-medium text-foreground">{nf.numero_nf}</p>
                    <p className="text-xs text-muted-foreground">Chegada: {new Date(nf.data_chegada).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={nf.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Pagamentos Pendentes (PTE + Sal)</h3>
            <div className="space-y-3">
              {allPend.filter(p => !p.data_pagamento).slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.numero_nf}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.frete)}</p>
                  </div>
                  <PaymentBadge dataPagamento={item.data_pagamento} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Atividade Recente</h3>
          <div className="flex gap-6 overflow-x-auto">
            {mockActivities.slice(0, 5).map(act => (
              <div key={act.id} className="flex gap-3 min-w-[200px]">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${act.tipo === 'entrega' ? 'bg-success' : act.tipo === 'criacao' ? 'bg-info' : 'bg-warning'}`} />
                <div>
                  <p className="text-sm text-foreground">{act.descricao}</p>
                  <p className="text-xs text-muted-foreground">{act.usuario} · {new Date(act.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
