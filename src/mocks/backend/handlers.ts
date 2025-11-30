/**
 * Mock Backend Handlers
 * 
 * Handlers HTTP-like pour le mock backend.
 * Simule les appels API avec codes de statut et délais réseau.
 */

import type { Task } from '../../types/task';
import type { SuiviActivityEvent } from '../../types/activity';
import * as store from './store';
import { ApiError, HTTP_STATUS, createNotFoundError } from './errors';

/**
 * Simuler un délai réseau variable (100-300ms par défaut)
 * Simule les variations de latence réseau réelles
 */
async function simulateDelay(min: number = 100, max: number = 300): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Réponse API standardisée
 */
export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

/**
 * TASKS HANDLERS
 */

/**
 * GET /tasks
 * Récupère toutes les tâches
 */
export async function handleGetTasks(): Promise<ApiResponse<Task[]>> {
  await simulateDelay();
  return {
    status: HTTP_STATUS.OK,
    data: store.getTasksStore(),
  };
}

/**
 * GET /tasks/:id
 * Récupère une tâche par ID
 */
export async function handleGetTaskById(id: string): Promise<ApiResponse<Task>> {
  await simulateDelay();
  const task = store.getTaskFromStore(id);
  if (!task) {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      error: `Task with id "${id}" not found`,
    };
  }
  return {
    status: HTTP_STATUS.OK,
    data: task,
  };
}

/**
 * POST /tasks
 * Crée une nouvelle tâche
 */
export async function handleCreateTask(taskData: Partial<Task>): Promise<ApiResponse<Task>> {
  await simulateDelay();
  
  // Validation basique
  if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim().length === 0) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      error: 'Task title is required',
    };
  }
  
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: taskData.status || 'todo',
  } as Task;
  store.addTaskToStore(newTask);
  return {
    status: HTTP_STATUS.CREATED,
    data: newTask,
  };
}

/**
 * PATCH /tasks/:id
 * Met à jour une tâche
 */
export async function handleUpdateTask(id: string, updates: Partial<Task>): Promise<ApiResponse<Task>> {
  await simulateDelay();
  
  // Validation : vérifier que la tâche existe
  const existingTask = store.getTaskFromStore(id);
  if (!existingTask) {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      error: `Task with id "${id}" not found`,
    };
  }
  
  // Validation : si title est fourni, il ne doit pas être vide
  if (updates.title !== undefined && (typeof updates.title !== 'string' || updates.title.trim().length === 0)) {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      error: 'Task title cannot be empty',
    };
  }
  
  const updatedTask = store.updateTaskInStore(id, updates);
  if (!updatedTask) {
    return {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error: 'Failed to update task',
    };
  }
  return {
    status: HTTP_STATUS.OK,
    data: updatedTask,
  };
}

/**
 * DELETE /tasks/:id
 * Supprime une tâche
 */
export async function handleDeleteTask(id: string): Promise<ApiResponse<void>> {
  await simulateDelay();
  const deleted = store.deleteTaskFromStore(id);
  if (!deleted) {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      error: `Task with id "${id}" not found`,
    };
  }
  return {
    status: HTTP_STATUS.NO_CONTENT,
  };
}

/**
 * ACTIVITIES HANDLERS
 */

/**
 * GET /tasks/:id/activities
 * Récupère les activités d'une tâche
 */
export async function handleGetTaskActivities(taskId: string): Promise<ApiResponse<SuiviActivityEvent[]>> {
  await simulateDelay();
  const task = store.getTaskFromStore(taskId);
  if (!task) {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      error: `Task with id "${taskId}" not found`,
    };
  }
  const activities = task.activities || [];
  // Trier par createdAt DESC
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // DESC
  });
  return {
    status: HTTP_STATUS.OK,
    data: sortedActivities,
  };
}

/**
 * POST /tasks/:id/activities
 * Ajoute une activité à une tâche
 */
export async function handleAddTaskActivity(
  taskId: string,
  activity: SuiviActivityEvent,
): Promise<ApiResponse<Task>> {
  await simulateDelay();
  const task = store.getTaskFromStore(taskId);
  if (!task) {
    return {
      status: HTTP_STATUS.NOT_FOUND,
      error: `Task with id "${taskId}" not found`,
    };
  }
  const currentActivities = task.activities || [];
  // Dédupliquer par id
  const existingIds = new Set(currentActivities.map(a => a.id));
  if (existingIds.has(activity.id)) {
    return {
      status: HTTP_STATUS.CONFLICT,
      error: `Activity with id "${activity.id}" already exists`,
    };
  }
  const updatedActivities = [...currentActivities, activity].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // DESC
  });
  const updatedTask = store.updateTaskInStore(taskId, { activities: updatedActivities });
  return {
    status: HTTP_STATUS.OK,
    data: updatedTask!,
  };
}

