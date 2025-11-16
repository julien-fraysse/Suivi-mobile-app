/**
 * useTasks Hook
 * 
 * Hook pour récupérer la liste des tâches avec filtres.
 * 
 * Usage:
 *   const { tasks, isLoading, error, refresh } = useTasks('active');
 * 
 * @param filter - Filtre à appliquer ('all', 'active', 'completed', ou un TaskStatus)
 * @returns { tasks, isLoading, error, refresh } - Liste filtrée et états
 * 
 * TODO: Quand l'API Suivi sera prête, ce hook peut être amélioré avec react-query
 * pour le cache et la synchronisation automatique.
 */

import { useMemo } from 'react';
import { useTasksContext } from './TasksContext';
import type { TaskStatus, TaskFilter } from './tasks.types';

type UseTasksFilter = TaskFilter | TaskStatus;

/**
 * useTasks
 * 
 * Retourne la liste des tâches filtrées depuis TasksProvider.
 * 
 * @param filter - Filtre à appliquer (par défaut: 'all')
 * @returns { tasks, isLoading, error, refresh } - Données et états
 */
export function useTasks(filter: UseTasksFilter = 'all') {
  const { getTasksByStatus, isLoading, error, refreshTasks } = useTasksContext();

  // Calculer les tâches filtrées (memoïsé pour éviter les recalculs)
  const tasks = useMemo(() => {
    return getTasksByStatus(filter);
  }, [getTasksByStatus, filter]);

  return {
    tasks,
    isLoading,
    error,
    refresh: refreshTasks,
  };
}

