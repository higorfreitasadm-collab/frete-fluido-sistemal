import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FilePlus,
  BarChart3,
  History,
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
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

interface AppSidebarProps {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40 overflow-hidden transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn('border-b border-sidebar-border', collapsed ? 'p-3' : 'p-5')}>
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
          <div className="p-2 rounded-lg bg-primary/20">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className={collapsed ? 'hidden' : ''}>
            <h1 className="text-base font-bold text-foreground">AC Transportes</h1>
            <p className="text-xs text-muted-foreground">Gestão de Notas Fiscais</p>
          </div>
        </div>
      </div>

      <nav className={cn('flex-1 overflow-y-auto', collapsed ? 'p-2 space-y-2' : 'p-3 space-y-1')}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-all duration-150',
                collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={collapsed ? 'sr-only' : ''}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={cn('border-t border-sidebar-border', collapsed ? 'p-3' : 'p-4')}>
        <p className={cn('text-xs text-muted-foreground text-center', collapsed ? 'sr-only' : '')}>© 2024 AC Transportes</p>
      </div>
    </aside>
  );
}
