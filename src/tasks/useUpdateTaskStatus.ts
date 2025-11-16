/**
 * useUpdateTaskStatus Hook
 * 
 * Hook pour mettre à jour le statut d'une tâche.
 * 
 * Usage:
 *   const { updateStatus, isUpdating } = useUpdateTaskStatus();
 *   await updateStatus('task-1', 'done');
 * 
 * @returns { updateStatus, isUpdating } - Fonction de mise à jour et état
 * 
 * TODO: Quand l'API Suivi sera prête, ce hook peut être amélioré avec react-query
 * pour la gestion optimiste et le rollback automatique.
 */

import { useState, useCallback } from 'react';
import { useTasksContext } from './TasksContext';
import type { TaskStatus } from './tasks.types';

/**
 * useUpdateTaskStatus
 * 
 * Retourne une fonction pour mettre à jour le statut d'une tâche.
 * Gère l'état de chargement localement.
 * 
 * @returns { updateStatus, isUpdating } - Fonction et état de chargement
 */
export function useUpdateTaskStatus() {
  const { updateTaskStatus } = useTasksContext();
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Mettre à jour le statut d'une tâche
   * 
   * @param taskId - ID de la tâche à mettre à jour
   * @param newStatus - Nouveau statut
   */
  const updateStatus = useCallback(
    async (taskId: string, newStatus: TaskStatus): Promise<void> => {
      try {
        setIsUpdating(true);
        await updateTaskStatus(taskId, newStatus);
      } catch (error) {
        console.error('Error updating task status:', error);
        // Re-lancer l'erreur pour que le composant puisse la gérer
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [updateTaskStatus]
  );

  return {
    updateStatus,
    isUpdating,
  };
}

