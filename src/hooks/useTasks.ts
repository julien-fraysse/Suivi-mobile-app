import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../auth';
import * as tasksAPI from '../api/tasks';
import type { Task, TaskStatus, MyTasksFilters } from '../api/tasks';

/**
 * Hook pour récupérer les tâches avec pagination infinie
 */
export function useTasks(options: {
  filters?: MyTasksFilters;
  pageSize?: number;
} = {}) {
  const { accessToken } = useAuth();
  const { filters, pageSize = 20 } = options;

  return useInfiniteQuery({
    queryKey: ['tasks', filters, pageSize],
    enabled: !!accessToken,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return tasksAPI.getMyTasks(accessToken, {
        page: pageParam as number,
        pageSize,
        filters,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pageSize: lastPageSize, total } = lastPage;
      const maxPage = Math.ceil(total / lastPageSize);
      if (page >= maxPage) return undefined;
      return page + 1;
    },
    // Refetch automatiquement quand les données changent (après invalidation)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

/**
 * Hook pour récupérer une tâche par ID
 */
export function useTask(
  taskId: string | null,
  options?: Omit<UseQueryOptions<Task>, 'queryKey' | 'queryFn'>,
) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['task', taskId],
    enabled: !!accessToken && !!taskId,
    queryFn: () => {
      if (!taskId) throw new Error('Task ID is required');
      return tasksAPI.getTaskById(taskId, accessToken);
    },
    ...options,
  });
}

/**
 * Hook pour récupérer les tâches prioritaires
 */
export function useMyPriorities(options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'priorities'],
    enabled: !!accessToken,
    queryFn: () => tasksAPI.getMyPriorities(accessToken),
    ...options,
  });
}

/**
 * Hook pour récupérer les tâches dues bientôt
 */
export function useDueSoon(options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'due-soon'],
    enabled: !!accessToken,
    queryFn: () => tasksAPI.getDueSoon(accessToken),
    ...options,
  });
}

/**
 * Hook pour récupérer les tâches récemment mises à jour
 */
export function useRecentlyUpdated(options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'recently-updated'],
    enabled: !!accessToken,
    queryFn: () => tasksAPI.getRecentlyUpdated(accessToken),
    ...options,
  });
}

/**
 * Hook pour récupérer les tâches en retard
 */
export function useLate(options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['tasks', 'late'],
    enabled: !!accessToken,
    queryFn: () => tasksAPI.getLate(accessToken),
    ...options,
  });
}

