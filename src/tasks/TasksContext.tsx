/**
 * Tasks Context & Provider
 * 
 * Provider complet pour gérer l'état des tâches dans l'application.
 * Utilise un store interne (mock pour le MVP) qui sera remplacé par l'API Suivi.
 * 
 * Expose :
 * - tasks: Task[] - Liste complète de toutes les tâches
 * - getTaskById(id) - Récupérer une tâche par ID
 * - getTasksByStatus(status) - Récupérer les tâches filtrées par statut
 * - updateTaskStatus(id, status) - Mettre à jour le statut d'une tâche
 * - refreshTasks() - Rafraîchir la liste des tâches
 * 
 * TODO: Quand l'API Suivi sera prête, remplacer les mocks par :
 *   - GET /api/tasks dans refreshTasks()
 *   - PATCH /api/tasks/:id/status dans updateTaskStatus()
 *   - Gérer loading/error states correctement
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Task, TaskStatus, TasksContextValue, TaskFilter } from './tasks.types';
import { loadMockTasks, updateMockTaskStatus } from '../mocks/tasks/mockTaskHelpers';

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * useTasksContext
 * 
 * Hook pour accéder au contexte TasksProvider.
 * Doit être utilisé à l'intérieur d'un TasksProvider.
 */
export function useTasksContext(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}

/**
 * TasksProvider Props
 */
interface TasksProviderProps {
  children: ReactNode;
}

/**
 * TasksProvider
 * 
 * Provider qui gère l'état global des tâches.
 * 
 * Fonctionnalités :
 * - Charge les tâches au démarrage (mock pour le MVP)
 * - Met à jour les tâches de manière optimiste (UI immédiate)
 * - Expose des méthodes pour récupérer et filtrer les tâches
 * - Synchronise automatiquement tous les écrans qui utilisent le contexte
 * 
 * TODO: Remplacer les mocks par l'API Suivi :
 *   1. Remplacer loadMockTasks() par GET /api/tasks
 *   2. Remplacer updateMockTaskStatus() par PATCH /api/tasks/:id/status
 *   3. Ajouter la gestion d'erreur (rollback si l'API échoue)
 *   4. Ajouter react-query pour le cache et la synchronisation
 */
export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Charger les tâches depuis le store (mock pour le MVP)
   * 
   * TODO: Remplacer par GET /api/tasks avec authentification
   */
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Remplacer par un appel API réel
      // const response = await api.get('/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
      // setTasks(response.data);
      const mockTasks = await loadMockTasks();
      setTasks(mockTasks);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load tasks');
      setError(error);
      console.error('Error loading tasks:', err);
      // En cas d'erreur, on garde un tableau vide pour éviter les crashes
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger les tâches au démarrage
   */
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Récupérer une tâche par son ID
   */
  const getTaskById = useCallback(
    (id: string): Task | undefined => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  /**
   * Récupérer les tâches filtrées par statut
   * 
   * Filtres disponibles :
   * - 'all' : toutes les tâches
   * - 'active' : todo, in_progress, blocked (tout sauf done)
   * - 'completed' : done uniquement
   * - TaskStatus spécifique : todo, in_progress, blocked, done
   */
  const getTasksByStatus = useCallback(
    (status: TaskStatus | 'all' | 'active' | 'completed'): Task[] => {
      if (status === 'all') {
        return tasks;
      }
      if (status === 'active') {
        // Active = tout sauf done
        return tasks.filter((task) => task.status !== 'done');
      }
      if (status === 'completed') {
        // Completed = done uniquement
        return tasks.filter((task) => task.status === 'done');
      }
      // Filtre par statut spécifique
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  /**
   * Mettre à jour le statut d'une tâche
   * 
   * Mise à jour optimiste : met à jour l'UI immédiatement,
   * puis synchronise avec le backend (mock pour le MVP).
   * 
   * TODO: Remplacer par PATCH /api/tasks/:id/status avec rollback en cas d'erreur
   */
  const updateTaskStatus = useCallback(
    async (id: string, newStatus: TaskStatus): Promise<void> => {
      // Mise à jour optimiste (UI immédiate)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        )
      );

      try {
        // TODO: Remplacer par un appel API réel
        // await api.patch(`/api/tasks/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
        await updateMockTaskStatus(id, newStatus);
        // Si succès, la tâche est déjà mise à jour dans l'état local
      } catch (err) {
        // Rollback en cas d'erreur
        console.error('Error updating task status:', err);
        // Recharger les tâches pour récupérer l'état correct du serveur
        await loadTasks();
        // TODO: Afficher une notification d'erreur à l'utilisateur
        throw err;
      }
    },
    [loadTasks]
  );

  /**
   * Rafraîchir la liste des tâches
   * 
   * TODO: Remplacer par GET /api/tasks avec cache invalidation
   */
  const refreshTasks = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  const value: TasksContextValue = {
    tasks,
    isLoading,
    error,
    getTaskById,
    getTasksByStatus,
    updateTaskStatus,
    refreshTasks,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}


