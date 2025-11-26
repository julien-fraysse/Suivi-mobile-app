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
import { normalizeTask } from '../types/task';
import type { TaskUpdatePayload } from './tasks.types';
import { applyTaskDependencies } from './taskRules';

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
      const normalizedTasks = await loadMockTasks();
      // loadMockTasks() retourne déjà des Task[] normalisés, pas besoin de re-normaliser
      console.log("QA-DIAG: Tasks loaded from mockTasks.ts →", normalizedTasks);
      console.log("TEST-TASKS", normalizedTasks);
      if (normalizedTasks.length > 0) {
        console.log("TEST-FIRST-TASK quickActions =", normalizedTasks[0].quickActions);
        console.log("TEST-FIRST-TASK customFields =", normalizedTasks[0].customFields);
      }
      setTasks(normalizedTasks);
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
   * Récupérer une tâche par son ID (strict - retourne undefined si non trouvé)
   * 
   * Version stricte de getTaskById pour vérification avant navigation.
   * Ne modifie pas le comportement existant.
   */
  const getTaskByIdStrict = useCallback(
    (id: string): Task | undefined => {
      if (!id) return undefined;
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

  /**
   * Mettre à jour une tâche (champs partiels)
   * 
   * Mise à jour optimiste : met à jour l'UI immédiatement,
   * puis synchronise avec le backend (mock pour le MVP).
   * 
   * Normalise automatiquement la tâche mise à jour via normalizeTask().
   * 
   * TODO: Remplacer par PATCH /api/tasks/:id avec rollback en cas d'erreur
   */
  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>): Promise<void> => {
      // Trouver la tâche existante
      const existingTask = tasks.find((task) => task.id === id);
      if (!existingTask) {
        throw new Error(`Task with id ${id} not found`);
      }

      // Merger les updates avec la tâche existante
      // Gérer le merge spécial des customFields (mettre à jour uniquement les champs modifiés)
      let mergedCustomFields = existingTask.customFields || [];
      if (updates.customFields !== undefined) {
        // updates.customFields contient déjà tous les customFields avec le champ modifié mis à jour
        // (géré dans handleCustomFieldChange de TaskDetailScreen)
        mergedCustomFields = updates.customFields;
      }

      const mergedTask = {
        ...existingTask,
        ...updates,
        customFields: mergedCustomFields,
        updatedAt: new Date().toISOString(),
      };

      // Normaliser la tâche mise à jour (défensif)
      const normalizedTask = normalizeTask(mergedTask);

      // Appliquer les dépendances automatiques (règles métier)
      // Passer updates pour que les règles ne s'appliquent que sur les champs modifiés
      const finalTask = applyTaskDependencies(normalizedTask, updates);

      // Mise à jour optimiste (UI immédiate)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? finalTask : task
        )
      );

      try {
        // TODO: Remplacer par un appel API réel
        // await api.patch(`/api/tasks/${id}`, updates, { headers: { Authorization: `Bearer ${token}` } });
        // Pour l'instant, on utilise updateMockTaskStatus si c'est un statut, sinon on fait rien (mock)
        if (updates.status) {
          await updateMockTaskStatus(id, updates.status);
        }
        // Si succès, la tâche est déjà mise à jour dans l'état local (mise à jour optimiste)
      } catch (err) {
        // Rollback en cas d'erreur
        console.error('Error updating task:', err);
        // Recharger les tâches pour récupérer l'état correct du serveur
        await loadTasks();
        // TODO: Afficher une notification d'erreur à l'utilisateur
        throw err;
      }
    },
    [tasks, loadTasks]
  );

  const value: TasksContextValue = {
    tasks,
    isLoading,
    error,
    getTaskById,
    getTaskByIdStrict,
    getTasksByStatus,
    updateTaskStatus,
    updateTask,
    refreshTasks,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}


