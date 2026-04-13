import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  titulo: string;
  valor: string | number;
  icon: LucideIcon;
  variante?: 'default' | 'success' | 'warning' | 'destructive';
  subtexto?: string;
}

const variantStyles = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

export function MetricCard({ titulo, valor, icon: Icon, variante = 'default', subtexto }: MetricCardProps) {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{titulo}</span>
        <div className={cn('p-2 rounded-lg bg-secondary', variantStyles[variante])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={cn('text-2xl font-bold', variantStyles[variante])}>{valor}</div>
      {subtexto && <p className="text-xs text-muted-foreground mt-1">{subtexto}</p>}
    </div>
  );
}
