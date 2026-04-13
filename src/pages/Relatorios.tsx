import { AppLayout } from '@/components/AppLayout';
import { useNFs } from '@/hooks/useNFs';
import { usePendItems } from '@/hooks/usePend';
import { mockUsers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(270, 70%, 60%)'];
const tooltipStyle = { backgroundColor: 'hsl(217, 33%, 17%)', border: '1px solid hsl(217, 33%, 22%)', borderRadius: '8px', color: '#fff' };

export default function Relatorios() {
  const { data: nfs = [] } = useNFs();
  const { data: pendPTE = [] } = usePendItems('pend-pte');
  const { data: pendSal = [] } = usePendItems('pend-sal');
  const allPend = [...pendPTE, ...pendSal];

  const statusData = [
    { name: 'Pendentes', valor: nfs.filter(n => n.status === 'pendente').length },
    { name: 'Entregues', valor: nfs.filter(n => n.status === 'entregue').length },
    { name: 'Atrasadas', valor: nfs.filter(n => n.status === 'atrasada').length },
  ];

  const remetenteRanking = Object.entries(nfs.reduce((acc, nf) => { acc[nf.remetente] = (acc[nf.remetente] || 0) + nf.frete; return acc; }, {} as Record<string, number>)).map(([name, valor]) => ({ name, valor })).sort((a, b) => b.valor - a.valor);
  const destinatarioRanking = Object.entries(nfs.reduce((acc, nf) => { acc[nf.destinatario] = (acc[nf.destinatario] || 0) + nf.frete; return acc; }, {} as Record<string, number>)).map(([name, valor]) => ({ name, valor })).sort((a, b) => b.valor - a.valor);
  const responsavelRanking = Object.entries(nfs.reduce((acc, nf) => { const nome = mockUsers.find(u => u.id === nf.responsavel_id)?.nome ?? 'Desconhecido'; acc[nome] = (acc[nome] || 0) + 1; return acc; }, {} as Record<string, number>)).map(([name, valor]) => ({ name, valor })).sort((a, b) => b.valor - a.valor);

  const freteData = [
    { mes: 'Out', frete: 12500 },
    { mes: 'Nov', frete: 18900 },
    { mes: 'Dez', frete: nfs.reduce((s, n) => s + n.frete, 0) },
  ];

  const pagoPorPeriodo = [
    { mes: 'Out', pago: 8500, pendente: 4000 },
    { mes: 'Nov', pago: 12000, pendente: 6900 },
    { mes: 'Dez', pago: allPend.filter(p => !!p.data_pagamento).reduce((s, p) => s + p.frete, 0), pendente: allPend.filter(p => !p.data_pagamento).reduce((s, p) => s + p.frete, 0) },
  ];

  const fretePorPagamento = [
    { name: 'Pago', valor: allPend.filter(p => !!p.data_pagamento).reduce((s, p) => s + p.frete, 0) },
    { name: 'Pgto. Pendente', valor: allPend.filter(p => !p.data_pagamento).reduce((s, p) => s + p.frete, 0) },
  ];

  const pagamentoRanking = Object.entries(allPend.filter(p => !!p.data_pagamento).reduce((acc, p) => {
    const nome = mockUsers.find(u => u.id === p.responsavel_id)?.nome ?? 'Desconhecido';
    acc[nome] = (acc[nome] || 0) + p.frete;
    return acc;
  }, {} as Record<string, number>)).map(([name, valor]) => ({ name, valor })).sort((a, b) => b.valor - a.valor);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground text-sm">Análises e indicadores das notas fiscais e pagamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exportação em desenvolvimento')}>
              <Download className="h-4 w-4 mr-1" /> Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> Imprimir Relatório
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frete ao Longo do Tempo</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={freteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                <XAxis dataKey="mes" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="frete" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(217, 91%, 60%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">NFs por Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="valor" label={({ name, valor }) => `${name}: ${valor}`}>
                  {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Pagamentos por Período (PTE + Sal)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pagoPorPeriodo}>
                <XAxis dataKey="mes" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="pago" name="Pago" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="pendente" name="Pendente" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Frete por Status de Pagamento</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={fretePorPagamento} cx="50%" cy="50%" outerRadius={90} dataKey="valor" label={({ name, valor }) => `${name}: ${formatCurrency(valor)}`}>
                  <Cell fill="hsl(142, 71%, 45%)" />
                  <Cell fill="hsl(38, 92%, 50%)" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Ranking de Remetentes (por frete)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={remetenteRanking} layout="vertical">
                <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} width={140} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="valor" fill="hsl(217, 91%, 60%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Ranking de Destinatários (por frete)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={destinatarioRanking} layout="vertical">
                <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} width={140} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="valor" fill="hsl(142, 71%, 45%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Ranking de Responsáveis (por quantidade)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={responsavelRanking}>
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="valor" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Ranking por Pagamento (PTE + Sal)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pagamentoRanking}>
                <XAxis dataKey="name" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="valor" fill="hsl(270, 70%, 60%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
