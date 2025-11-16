/**
 * MOCK STORE for the Suivi mobile MVP - Tasks Feature
 * 
 * This file centralizes in-memory fake data for the Tasks feature.
 * It provides a simple hook-based API (useTasksStore) that can be used
 * throughout the app to access and update tasks.
 * 
 * TODO: When the real Suivi backend API is ready, replace this implementation
 *       by API calls (GET /api/tasks, PATCH /api/tasks/:id/status, etc.)
 *       while keeping the same hook interface (useTasksStore).
 * 
 * The hook signature should remain the same:
 *   - tasks: Task[] - list of all tasks
 *   - updateTaskStatus(taskId: string, status: TaskStatus) - update task status
 *   - getTaskById(taskId: string) - find a task by ID
 *   - stats: { total, activeCount, dueTodayCount } - computed statistics
 * 
 * This way, components using useTasksStore() won't need to change when
 * we switch from mocks to real API calls.
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Task Status
 * 
 * Possible statuses for a task in the Suivi system.
 */
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

/**
 * Task Interface
 * 
 * Represents a task in the Suivi mobile app.
 * This matches the structure expected by the UI components.
 */
export interface Task {
  id: string;
  title: string;
  project?: string; // Keep for backward compatibility, but prefer projectName
  projectName?: string; // Project name (preferred)
  dueDate: string; // ISO string (YYYY-MM-DD format)
  status: TaskStatus;
  description?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  updatedAt?: string;
}

/**
 * INITIAL_TASKS
 * 
 * Mock tasks data for the MVP.
 * TODO: Replace this array with real API calls (GET /api/tasks) when backend is ready.
 */
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Implémenter le design system Suivi',
    status: 'in_progress',
    dueDate: '2024-11-20',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
    description: 'Créer un design system complet avec tokens, composants réutilisables et documentation. Inclure les polices Inter et IBM Plex Mono, les couleurs Suivi (violet, jaune, gris, sand), et les composants de base (buttons, cards, inputs, etc.).',
  },
  {
    id: '2',
    title: 'Créer les composants UI réutilisables',
    status: 'done',
    dueDate: '2024-11-15',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T16:30:00Z',
  },
  {
    id: '3',
    title: 'Intégrer les polices Inter et IBM Plex Mono',
    status: 'done',
    dueDate: '2024-11-14',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-14T14:20:00Z',
  },
  {
    id: '4',
    title: 'Configurer la navigation entre écrans',
    status: 'todo',
    dueDate: '2024-11-21',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T08:00:00Z',
  },
  {
    id: '5',
    title: 'Créer la page de profil utilisateur',
    status: 'todo',
    dueDate: '2024-11-22',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:00:00Z',
  },
  {
    id: '6',
    title: 'Optimiser les performances de la liste des tâches',
    status: 'blocked',
    dueDate: '2024-11-25',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
  },
  {
    id: '7',
    title: 'Ajouter le système de notifications push',
    status: 'todo',
    dueDate: '2024-11-18',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:15:00Z',
  },
  {
    id: '8',
    title: 'Créer les tests unitaires pour les composants',
    status: 'in_progress',
    dueDate: '2024-11-19',
    project: 'Mobile App',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:30:00Z',
  },
  {
    id: '9',
    title: 'Review design mockups',
    status: 'todo',
    dueDate: '2024-11-17',
    project: 'Design System',
    projectName: 'Design System',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
  },
  {
    id: '10',
    title: 'Setup CI/CD pipeline',
    status: 'todo',
    dueDate: '2024-11-23',
    project: 'Backend API',
    projectName: 'Backend API',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:30:00Z',
  },
];

/**
 * useTasksStore
 * 
 * Simple hook-based store for tasks management.
 * 
 * This is the SINGLE SOURCE OF TRUTH for tasks in the app.
 * All components (HomeScreen, MyTasksScreen, TaskDetailScreen) should
 * use this hook to access and update tasks.
 * 
 * MOCK ONLY - replace with real Suivi API later
 * 
 * @returns {Object} Store interface:
 *   - tasks: Task[] - All tasks in memory
 *   - updateTaskStatus(taskId: string, status: TaskStatus) - Update a task's status
 *   - getTaskById(taskId: string) - Find a task by ID
 *   - stats: { total, activeCount, dueTodayCount } - Computed statistics
 * 
 * TODO: When Suivi API is ready, replace internal state by:
 *   1. API call to GET /api/tasks on mount
 *   2. API call to PATCH /api/tasks/:id/status when updateTaskStatus is called
 *   3. Keep the same hook interface so components don't need to change
 */
export function useTasksStore() {
  // MOCK ONLY: In-memory state for tasks
  // TODO: Replace with API calls (GET /api/tasks)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  /**
   * updateTaskStatus
   * 
   * Updates the status of a task in the store.
   * 
   * MOCK ONLY - TODO: Replace with PATCH /api/tasks/:id/status API call
   * 
   * @param taskId - ID of the task to update
   * @param status - New status for the task
   */
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
    // TODO: When Suivi API is ready, add API call here:
    // await api.patch(`/api/tasks/${taskId}/status`, { status });
  }, []);

  /**
   * getTaskById
   * 
   * Finds a task by its ID.
   * 
   * @param taskId - ID of the task to find
   * @returns Task | undefined - The task if found, undefined otherwise
   */
  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return tasks.find((t) => t.id === taskId);
    },
    [tasks]
  );

  /**
   * stats
   * 
   * Computed statistics from the tasks list.
   * Used by HomeScreen to display Quick Actions tiles.
   */
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD format

    // Active tasks: todo, in_progress, blocked (everything except 'done')
    const activeStatuses: TaskStatus[] = ['todo', 'in_progress', 'blocked'];
    const activeCount = tasks.filter((t) => activeStatuses.includes(t.status)).length;

    // Due today: tasks where dueDate matches today (ignoring time)
    const dueTodayCount = tasks.filter((t) => {
      if (!t.dueDate) return false;
      const taskDate = t.dueDate.slice(0, 10); // Extract YYYY-MM-DD part
      return taskDate === todayStr;
    }).length;

    return {
      total: tasks.length,
      activeCount,
      dueTodayCount,
    };
  }, [tasks]);

  return {
    tasks,
    updateTaskStatus,
    getTaskById,
    stats,
    // TODO: when Suivi API is ready, replace internal state by API calls + server state.
  };
}

