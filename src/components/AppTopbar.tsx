import { Search, LogOut, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { appUser } from '@/data/mock';
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
            placeholder="Buscar NFs, remetentes, destinatários..."
            className="pl-10 bg-secondary border-border/50 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            {appUser.nome.charAt(0)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{appUser.nome}</p>
            <p className="text-xs text-muted-foreground">Registro único</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
