import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/api';

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: activityService.listar,
  });
}
