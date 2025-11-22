/**
 * Tasks Query Hook
 * 
 * Hook React Query pour les tâches (désactivé volontairement).
 * Ne s'exécute jamais car enabled = false.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchTasks, fetchTasksMock } from '../../services/tasksService';

export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: false, // INACTIF volontairement
  });
}

export function useTasksMockQuery() {
  return useQuery({
    queryKey: ['tasksMock'],
    queryFn: fetchTasksMock,
    enabled: false, // INACTIF volontairement
  });
}

