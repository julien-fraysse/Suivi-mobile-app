import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as activityAPI from '../api/activity';
import type { ActivityItem } from '../api/activity';

/**
 * Hook pour récupérer le fil d'activité
 */
export function useActivityFeed(
  limit: number = 10,
  options?: Omit<UseQueryOptions<ActivityItem[]>, 'queryKey' | 'queryFn'>,
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['activity', 'feed', limit],
    enabled: !!accessToken,
    queryFn: () => activityAPI.getActivityFeed(limit, accessToken),
    ...options,
  });
}

/**
 * Hook pour récupérer l'activité d'une tâche spécifique
 */
export function useTaskActivity(
  taskId: string | null,
  options?: Omit<UseQueryOptions<ActivityItem[]>, 'queryKey' | 'queryFn'>,
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['activity', 'task', taskId],
    enabled: !!accessToken && !!taskId,
    queryFn: () => {
      if (!taskId) throw new Error('Task ID is required');
      return activityAPI.getTaskActivity(taskId, accessToken);
    },
    ...options,
  });
}


