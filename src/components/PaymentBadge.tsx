import { cn } from '@/lib/utils';

export function PaymentBadge({ dataPagamento }: { dataPagamento: string | null }) {
  const pago = !!dataPagamento;
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
      pago ? 'bg-success/15 text-success border border-success/30' : 'bg-warning/15 text-warning border border-warning/30'
    )}>
      {pago ? 'Pago' : 'Pgto. pendente'}
    </span>
  );
}
