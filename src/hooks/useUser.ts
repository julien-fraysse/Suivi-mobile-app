import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as usersAPI from '../api/users';
import type { User } from '../api/users';

/**
 * Hook pour récupérer l'utilisateur actuel
 */
export function useUser(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['user', 'me'],
    enabled: !!accessToken,
    queryFn: () => usersAPI.getUser(accessToken),
    ...options,
  });
}


