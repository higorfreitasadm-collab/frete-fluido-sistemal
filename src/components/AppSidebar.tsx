import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  BarChart3,
  History,
  Users,
  Settings,
  Truck,
  ClipboardList,
  Wallet,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Nova NF', path: '/nova-nf', icon: FilePlus },
  { label: 'Pend. PTE', path: '/pend-pte', icon: ClipboardList },
  { label: 'Pend. Sal', path: '/pend-sal', icon: Wallet },
  { label: 'Relatórios', path: '/relatorios', icon: BarChart3 },
  { label: 'Histórico', path: '/historico', icon: History },
  { label: 'Usuários', path: '/usuarios', icon: Users },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">AC Transportes</h1>
            <p className="text-xs text-muted-foreground">Gestão de Notas Fiscais</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">© 2024 AC Transportes</p>
      </div>
    </aside>
  );
}
