import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.listar,
  });
}
