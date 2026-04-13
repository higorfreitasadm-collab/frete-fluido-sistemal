import { AppLayout } from '@/components/AppLayout';

export default function Configuracoes() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm">Preferências do sistema</p>
        </div>

        <div className="glass-card p-6 max-w-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">Informações Gerais</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Versão do Sistema</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Banco de Dados</span>
              <span className="text-foreground font-medium">Supabase (não conectado)</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Autenticação</span>
              <span className="text-foreground font-medium">Simulada (mock)</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Ambiente</span>
              <span className="text-foreground font-medium">Desenvolvimento</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
