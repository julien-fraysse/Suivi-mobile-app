/**
 * TasksContext
 * 
 * Contexte simple pour synchroniser les tâches entre les écrans.
 * Source unique de vérité pour les tâches mockées.
 * 
 * Pour l'instant, utilise les mocks directement. Plus tard, peut être remplacé
 * par un vrai state management (Redux, Zustand, etc.) ou React Query.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMyTasks as getMockTasks, updateTaskStatus as updateMockTaskStatus } from '../api/tasksApi.mock';
import type { Task, TaskStatus } from '../api/tasks';

type TasksContextValue = {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function useTasksContext(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
}

interface TasksProviderProps {
  children: ReactNode;
}

/**
 * TasksProvider
 * 
 * Provider pour gérer l'état des tâches de manière centralisée.
 * Charge les tâches au démarrage et expose updateTaskStatus pour les mettre à jour.
 */
export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Charger les tâches au démarrage
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Charger toutes les tâches (sans filtre)
      const allTasks = await getMockTasks('all');
      setTasks(allTasks);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load tasks');
      setError(error);
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Mettre à jour le statut d'une tâche
  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      // Mettre à jour dans le mock (modifie directement MOCK_TASKS)
      await updateMockTaskStatus(id, status);
      
      // Mettre à jour l'état local
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      throw err;
    }
  };

  // Rafraîchir la liste des tâches
  const refreshTasks = async () => {
    await loadTasks();
  };

  const value: TasksContextValue = {
    tasks,
    isLoading,
    error,
    updateTaskStatus,
    refreshTasks,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

