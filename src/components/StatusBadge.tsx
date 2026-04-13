import { NFStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<NFStatus, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'status-pending' },
  entregue: { label: 'Entregue', className: 'status-delivered' },
  atrasada: { label: 'Atrasada', className: 'status-overdue' },
};

export function StatusBadge({ status }: { status: NFStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', config.className)}>
      {config.label}
    </span>
  );
}
