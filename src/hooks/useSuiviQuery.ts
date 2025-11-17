/**
 * Suivi Mobile Query Hooks
 * 
 * Hooks génériques React Query pour proxy vers l'API Suivi (mocks ou vraies API).
 * 
 * Utilise `/src/services/api.ts` qui pointe vers les mocks pour l'instant.
 * 
 * Pour migrer vers les vraies API : changer uniquement `/src/services/api.ts`
 * (voir documentation dans ce fichier).
 * 
 * @see /src/services/api.ts pour la migration vers les vraies API
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../auth';
import api, { GetTasksParams } from '../services/api';
import type { Task } from '../api/tasks';
import type {
  MyTasksPage,
  Project,
  Notification,
  User,
  QuickStats,
} from '../mocks/suiviMock';
import type {
  QuickCaptureItem,
  CreateQuickCapturePayload,
} from '../types/quickCapture';

// ============================================================================
// TASKS
// ============================================================================

/**
 * Hook pour récupérer les tâches avec pagination infinie
 */
export function useTasks(options: {
  filters?: GetTasksParams['filters'];
  pageSize?: number;
} = {}) {
  const { accessToken } = useAuth();
  const { filters, pageSize = 20 } = options;

  return useInfiniteQuery<MyTasksPage>({
    queryKey: ['tasks', filters],
    enabled: !!accessToken,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return api.getTasks(
        {
          page: pageParam as number,
          pageSize,
          filters,
        },
        accessToken,
      );
    },
    getNextPageParam: (lastPage) => {
      const { page, pageSize, total } = lastPage;
      const maxPage = Math.ceil(total / pageSize);
      if (page >= maxPage) return undefined;
      return page + 1;
    },
  });
}

/**
 * Hook pour récupérer une tâche par ID
 */
export function useTask(taskId: string | null, options?: Omit<UseQueryOptions<Task>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<Task>({
    queryKey: ['task', taskId],
    enabled: !!accessToken && !!taskId,
    queryFn: () => {
      if (!taskId) throw new Error('Task ID is required');
      return api.getTaskById(taskId, accessToken);
    },
    ...options,
  });
}

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * Hook pour récupérer tous les projets
 */
export function useProjects(options?: Omit<UseQueryOptions<Project[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    enabled: !!accessToken,
    queryFn: () => api.getProjects(accessToken),
    ...options,
  });
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Hook pour récupérer toutes les notifications
 */
export function useNotifications(options?: Omit<UseQueryOptions<Notification[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    enabled: !!accessToken,
    queryFn: () => api.getNotifications(accessToken),
    ...options,
  });
}

// ============================================================================
// USER
// ============================================================================

/**
 * Hook pour récupérer l'utilisateur actuel
 */
export function useUser(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<User>({
    queryKey: ['user', 'me'],
    enabled: !!accessToken,
    queryFn: () => api.getUser(accessToken),
    ...options,
  });
}

// ============================================================================
// STATS
// ============================================================================

/**
 * Hook pour récupérer les statistiques rapides
 */
export function useQuickStats(options?: Omit<UseQueryOptions<QuickStats>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<QuickStats>({
    queryKey: ['quickStats'],
    enabled: !!accessToken,
    queryFn: () => api.getQuickStats(accessToken),
    ...options,
  });
}

// ============================================================================
// ACTIVITY
// ============================================================================

/**
 * @deprecated Legacy query hook (unused)
 * This file is kept only to avoid breaking imports.
 * Safe to remove once all code is migrated.
 */

// ============================================================================
// QUICK CAPTURE (Inbox mobile)
// ============================================================================

/**
 * Hook pour récupérer tous les items Quick Capture de l'inbox mobile
 */
export function useQuickCaptureItems(options?: Omit<UseQueryOptions<QuickCaptureItem[]>, 'queryKey' | 'queryFn'>) {
  const { accessToken } = useAuth();

  return useQuery<QuickCaptureItem[]>({
    queryKey: ['quickCaptureItems'],
    enabled: !!accessToken,
    queryFn: () => api.getQuickCaptureItems(accessToken),
    ...options,
  });
}

/**
 * Hook pour créer un nouvel item Quick Capture
 */
export function useCreateQuickCaptureItem() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<QuickCaptureItem, Error, CreateQuickCapturePayload>({
    mutationFn: (payload) => api.createQuickCaptureItem(payload, accessToken),
    onSuccess: () => {
      // Invalidate la liste des items pour rafraîchir
      queryClient.invalidateQueries({ queryKey: ['quickCaptureItems'] });
    },
  });
}

/**
 * Hook pour vider l'inbox Quick Capture
 */
export function useClearQuickCaptureInbox() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => api.clearQuickCaptureInbox(accessToken),
    onSuccess: () => {
      // Invalidate la liste des items pour rafraîchir
      queryClient.invalidateQueries({ queryKey: ['quickCaptureItems'] });
    },
  });
}

