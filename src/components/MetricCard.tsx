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
    <div className="glass-card h-full min-h-[132px] p-4 sm:p-5 animate-fade-in overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight break-words">{titulo}</span>
        <div className={cn('shrink-0 p-2 rounded-lg bg-secondary', variantStyles[variante])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={cn('min-w-0 text-[clamp(1.1rem,1.9vw,1.75rem)] font-bold leading-none tracking-tight tabular-nums break-words', variantStyles[variante])}>
        {valor}
      </div>
      {subtexto && <p className="text-xs text-muted-foreground mt-1">{subtexto}</p>}
    </div>
  );
}
