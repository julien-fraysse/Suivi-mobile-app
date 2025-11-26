/**
 * useTaskById Hook
 * 
 * Hook pour récupérer une tâche spécifique par son ID.
 * 
 * Usage:
 *   const { task, isLoading, error } = useTaskById('task-1');
 * 
 * @param taskId - ID de la tâche à récupérer
 * @returns { task, isLoading, error } - Tâche et états
 * 
 * TODO: Quand l'API Suivi sera prête, ce hook peut être amélioré avec react-query
 * pour le cache et la synchronisation automatique.
 */

import { useMemo } from 'react';
import { useTasksContext } from './TasksContext';

/**
 * useTaskById
 * 
 * Retourne une tâche spécifique par son ID depuis TasksProvider.
 * 
 * @param taskId - ID de la tâche à récupérer
 * @returns { task, isLoading, error } - Tâche et états
 */
export function useTaskById(taskId: string) {
  const { tasks, isLoading, error } = useTasksContext();

  // Récupérer la tâche (memoïsé avec tasks comme dépendance pour détecter les changements)
  const task = useMemo(() => {
    return tasks.find((task) => task.id === taskId);
  }, [tasks, taskId]);

  console.log("QA-DIAG: useTaskById() → taskId =", taskId, "result =", task);

  return {
    task,
    isLoading,
    error,
  };
}


