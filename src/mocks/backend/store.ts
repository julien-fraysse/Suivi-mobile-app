/**
 * Mock Backend Store
 * 
 * Stores unifiés pour le mock backend.
 * Source de vérité unique pour toutes les données mockées.
 */

import type { Task } from '../../types/task';
import type { SuiviActivityEvent } from '../../types/activity';
import { TASKS } from '../suiviData';
import { normalizeTask } from '../../types/task';

// Stores en mémoire (Mock DB)
// Initialiser avec les tâches normalisées
let TASKS_STORE: Task[] = TASKS.map(task => normalizeTask(task));
let ACTIVITIES_STORE: SuiviActivityEvent[] = [];

/**
 * TASKS STORE
 */

export function getTasksStore(): Task[] {
  return TASKS_STORE;
}

export function setTasksStore(tasks: Task[]): void {
  TASKS_STORE = tasks;
}

export function getTaskFromStore(id: string): Task | undefined {
  return TASKS_STORE.find((task) => task.id === id);
}

export function updateTaskInStore(id: string, patch: Partial<Task>): Task | undefined {
  const index = TASKS_STORE.findIndex((task) => task.id === id);
  if (index === -1) {
    return undefined;
  }
  
  // Merge intelligent : ignorer les undefined dans patch pour éviter d'écraser des valeurs existantes
  const cleanPatch = Object.keys(patch).reduce((acc, key) => {
    const patchKey = key as keyof Task;
    const patchValue = patch[patchKey];
    // Ne pas inclure undefined dans le merge (garder la valeur existante)
    if (patchValue !== undefined) {
      acc[patchKey] = patchValue;
    }
    return acc;
  }, {} as Partial<Task>);
  
  const updatedTask: Task = {
    ...TASKS_STORE[index],
    ...cleanPatch,
    updatedAt: new Date().toISOString(),
  };
  TASKS_STORE[index] = updatedTask;
  return updatedTask;
}

export function deleteTaskFromStore(id: string): boolean {
  const index = TASKS_STORE.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }
  TASKS_STORE.splice(index, 1);
  return true;
}

export function addTaskToStore(task: Task): void {
  TASKS_STORE.push(task);
}

/**
 * ACTIVITIES STORE
 * 
 * Note: Les activités sont principalement stockées dans task.activities,
 * mais ce store peut être utilisé pour les activités globales (feed).
 */

export function getActivitiesStore(): SuiviActivityEvent[] {
  return ACTIVITIES_STORE;
}

export function setActivitiesStore(activities: SuiviActivityEvent[]): void {
  ACTIVITIES_STORE = activities;
}

export function addActivityToStore(activity: SuiviActivityEvent): void {
  ACTIVITIES_STORE.push(activity);
}

/**
 * Récupérer les activités d'une tâche depuis task.activities
 */
export function getTaskActivitiesFromStore(taskId: string): SuiviActivityEvent[] {
  const task = getTaskFromStore(taskId);
  return task?.activities || [];
}

