import { Search, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { isSupabaseReady } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AppTopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AppTopbar({ sidebarOpen, onToggleSidebar }: AppTopbarProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground">
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>

        <div className="relative hidden md:block w-full max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar NFs, remetentes, destinatarios..."
            className="pl-10 bg-secondary border-border/50 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${isSupabaseReady ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{isSupabaseReady ? 'Supabase ativo' : 'Modo local'}</span>
        </div>
      </div>
    </header>
  );
}
