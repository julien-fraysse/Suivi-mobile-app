/**
 * Mock Task Helpers
 * 
 * Fonctions utilitaires pour générer et manipuler des tâches mock.
 * Utilisé par TasksProvider pour simuler des appels API.
 * 
 * TODO: Remplacer par de vrais appels API Suivi quand le backend sera prêt.
 */

import type { Task, TaskStatus } from '../../types/task';
import type { TaskUpdatePayload } from '../../tasks/tasks.types';
import { loadTasks, TASKS as MOCK_TASKS } from '../suiviData';
import { normalizeTask } from '../../types/task';

/**
 * Simule un délai réseau
 */
function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Charger toutes les tâches (mock)
 * 
 * TODO: Remplacer par GET /api/tasks
 */
export async function loadMockTasks(): Promise<Task[]> {
  // Utilise loadTasks() depuis suiviData.ts (source unique de vérité)
  const rawTasks = await loadTasks();
  // Normaliser toutes les tâches vers le type Task central
  const normalizedTasks = rawTasks.map((rawTask) => normalizeTask(rawTask));
  console.log("QA-DIAG: loadMockTasks() returning", normalizedTasks);
  return normalizedTasks;
}

/**
 * Charger une tâche par ID (mock)
 * 
 * TODO: Remplacer par GET /api/tasks/:id
 */
export async function loadMockTaskById(id: string): Promise<Task | undefined> {
  await delay(200);
  const rawTask = MOCK_TASKS.find((task) => task.id === id);
  if (!rawTask) {
    return undefined;
  }
  // Normaliser la tâche vers le type Task central
  return normalizeTask(rawTask);
}

/**
 * Mettre à jour une tâche (mock)
 * 
 * Modifie directement MOCK_TASKS pour simuler une mise à jour en base.
 * 
 * TODO: Remplacer par PATCH /api/tasks/:id
 */
export async function updateMockTask(
  id: string,
  updates: TaskUpdatePayload
): Promise<Task> {
  await delay(200);
  
  const taskIndex = MOCK_TASKS.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  const rawTask = MOCK_TASKS[taskIndex];
  const updatedRawTask = {
    ...rawTask,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Mettre à jour dans le tableau mock
  MOCK_TASKS[taskIndex] = updatedRawTask;
  
  // Normaliser la tâche vers le type Task central
  return normalizeTask(updatedRawTask);
}

/**
 * Mettre à jour le statut d'une tâche (mock)
 * 
 * TODO: Remplacer par PATCH /api/tasks/:id/status
 */
export async function updateMockTaskStatus(
  id: string,
  status: TaskStatus
): Promise<Task> {
  return updateMockTask(id, { status });
}


