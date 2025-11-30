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
import { getMockTasks, updateMockTask as updateMockTaskInStore, deleteMockTask as deleteMockTaskInStore } from '../tasksMock';

/**
 * Simule un délai réseau
 */
function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Charger toutes les tâches (mock)
 * 
 * Lit depuis le store unique TASKS_STORE.
 * Les tâches sont déjà normalisées au boot, pas besoin de re-normaliser.
 * 
 * TODO: Remplacer par GET /api/tasks
 */
export async function loadMockTasks(): Promise<Task[]> {
  await delay(200);
  // Lire depuis le store unique (déjà normalisé)
  const tasks = getMockTasks();
  console.log("QA-DIAG: loadMockTasks() returning", tasks);
  return tasks;
}

/**
 * Charger une tâche par ID (mock)
 * 
 * Lit depuis le store unique TASKS_STORE.
 * 
 * TODO: Remplacer par GET /api/tasks/:id
 */
export async function loadMockTaskById(id: string): Promise<Task | undefined> {
  await delay(200);
  const tasks = getMockTasks();
  return tasks.find((task) => task.id === id);
}

/**
 * Mettre à jour une tâche (mock)
 * 
 * Modifie le store unique TASKS_STORE.
 * 
 * TODO: Remplacer par PATCH /api/tasks/:id
 */
export async function updateMockTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  await delay(200);
  
  const updatedTask = updateMockTaskInStore(id, updates);
  if (!updatedTask) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  return updatedTask;
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


