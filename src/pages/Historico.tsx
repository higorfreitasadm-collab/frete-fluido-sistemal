import { AppLayout } from '@/components/AppLayout';
import { mockActivities } from '@/data/mock';

export default function Historico() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground text-sm">Registro de todas as atividades do sistema</p>
        </div>

        <div className="glass-card p-5">
          <div className="space-y-0">
            {mockActivities.map((act, idx) => (
              <div key={act.id} className="flex gap-4 pb-6 relative">
                {idx < mockActivities.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
                )}
                <div className={`mt-1.5 h-3.5 w-3.5 rounded-full shrink-0 z-10 ring-4 ring-card ${
                  act.tipo === 'entrega' ? 'bg-success' : act.tipo === 'criacao' ? 'bg-info' : act.tipo === 'exclusao' ? 'bg-destructive' : 'bg-warning'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{act.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{act.usuario} · {new Date(act.data).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
