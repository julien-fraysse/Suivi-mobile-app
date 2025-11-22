/**
 * Tasks Query Hook
 * 
 * Hook React Query pour les tâches.
 * S'active uniquement en mode API (API_MODE === 'api').
 * En mode mock, le hook est désactivé car les mocks sont utilisés directement.
 */

import { useQuery } from '@tanstack/react-query';
import { API_MODE } from '../../config/apiMode';
import { fetchTasks } from '../../services/tasksService';

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: API_MODE === 'api', // Actif uniquement en mode API
  });
}

