/**
 * Tasks Service
 * 
 * @deprecated Utiliser directement src/api/tasks.ts à la place
 * 
 * Service API pour les tâches avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 * 
 * MIGRATION :
 * - Remplacer fetchTasks() par getTasks() depuis src/api/tasks.ts
 * - Remplacer fetchTaskById() par getTaskById() depuis src/api/tasks.ts
 * - Remplacer createTask() par createTask() depuis src/api/tasks.ts
 * - Remplacer updateTask() par updateTask() depuis src/api/tasks.ts
 * - Remplacer deleteTask() par deleteTask() depuis src/api/tasks.ts
 */

import * as tasksAPI from '../api/tasks';
import type { Task } from '../api/tasks';

/**
 * @deprecated Utiliser tasksAPI.getTasks() à la place
 */
export async function fetchTasks(): Promise<Task[]> {
  return tasksAPI.getTasks();
}

/**
 * @deprecated Utiliser tasksAPI.getTaskById() à la place
 */
export async function fetchTaskById(id: string): Promise<Task | undefined> {
  try {
    return await tasksAPI.getTaskById(id);
  } catch {
    return undefined;
  }
}

/**
 * @deprecated Utiliser tasksAPI.createTask() à la place
 */
export async function createTask(task: any): Promise<Task> {
  return tasksAPI.createTask(task);
}

/**
 * @deprecated Utiliser tasksAPI.updateTask() à la place
 */
export async function updateTask(id: string, task: any): Promise<Task> {
  return tasksAPI.updateTask(id, task);
}

/**
 * @deprecated Utiliser tasksAPI.deleteTask() à la place
 */
export async function deleteTask(taskId: string): Promise<{ success: boolean }> {
  try {
    await tasksAPI.deleteTask(taskId);
    return { success: true };
  } catch {
    return { success: false };
  }
}

