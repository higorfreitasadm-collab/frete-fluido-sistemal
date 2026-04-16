import { AppLayout } from '@/components/AppLayout';

export default function Configuracoes() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
          <p className="text-muted-foreground text-sm">Preferencias do sistema</p>
        </div>

        <div className="glass-card p-6 max-w-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">Informacoes Gerais</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Versao do Sistema</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Banco de Dados</span>
              <span className="text-foreground font-medium">Supabase quando configurado</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-muted-foreground">Autenticacao</span>
              <span className="text-foreground font-medium">Real via Supabase</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Ambiente</span>
              <span className="text-foreground font-medium">Pronto para Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
