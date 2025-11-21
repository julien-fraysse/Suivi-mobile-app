/**
 * Mock Task Helpers
 * 
 * Fonctions utilitaires pour générer et manipuler des tâches mock.
 * Utilisé par TasksProvider pour simuler des appels API.
 * 
 * TODO: Remplacer par de vrais appels API Suivi quand le backend sera prêt.
 */

import type { Task, TaskStatus, TaskUpdatePayload } from '../../tasks/tasks.types';
import { loadTasks, TASKS as MOCK_TASKS } from '../suiviData';

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
  const tasks = await loadTasks();
  console.log("QA-DIAG: loadMockTasks() returning", tasks);
  return tasks;
}

/**
 * Charger une tâche par ID (mock)
 * 
 * TODO: Remplacer par GET /api/tasks/:id
 */
export async function loadMockTaskById(id: string): Promise<Task | undefined> {
  await delay(200);
  return MOCK_TASKS.find((task) => task.id === id);
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
  
  const task = MOCK_TASKS[taskIndex];
  const updatedTask: Task = {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Mettre à jour dans le tableau mock
  MOCK_TASKS[taskIndex] = updatedTask;
  
  return { ...updatedTask };
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


