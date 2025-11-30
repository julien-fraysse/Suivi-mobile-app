/**
 * Tasks Mock Data - Mock DB Unique
 * 
 * Cette mock DB remplace suiviData.ts pendant le MVP.
 * Une seule source de vérité en mémoire, destinée à être remplacée par l'API réelle.
 * 
 * Le store TASKS_STORE est initialisé une seule fois au boot avec les tâches normalisées.
 * Toutes les opérations (get, set, delete, update) modifient ce store unique.
 * 
 * RÈGLE ABSOLUE :
 * - Toutes les lectures passent par getMockTasks()
 * - Toutes les écritures passent par setMockTasks(), deleteMockTask(), updateMockTask()
 * - Aucune autre source de vérité ne doit exister
 */

import type { Task } from '../types/task';
import { TASKS } from './suiviData';

// Store unique en mémoire (Mock DB)
let TASKS_STORE: Task[] = [...TASKS];

/**
 * Récupérer toutes les tâches depuis le store
 * 
 * @returns Task[] Liste de toutes les tâches (référence directe, pas de copie)
 */
export function getMockTasks(): Task[] {
  return TASKS_STORE;
}

/**
 * Remplacer complètement le store
 * 
 * @param next - Nouvelle liste de tâches
 */
export function setMockTasks(next: Task[]): void {
  TASKS_STORE = next;
}

/**
 * Supprimer une tâche du store
 * 
 * @param id - ID de la tâche à supprimer
 * @returns boolean true si la tâche a été supprimée, false si non trouvée
 */
export function deleteMockTask(id: string): boolean {
  const index = TASKS_STORE.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }
  TASKS_STORE.splice(index, 1);
  return true;
}

/**
 * Mettre à jour une tâche dans le store
 * 
 * @param id - ID de la tâche à mettre à jour
 * @param patch - Champs partiels à fusionner
 * @returns Task | undefined La tâche mise à jour ou undefined si non trouvée
 */
export function updateMockTask(id: string, patch: Partial<Task>): Task | undefined {
  const index = TASKS_STORE.findIndex((task) => task.id === id);
  if (index === -1) {
    return undefined;
  }
  const updatedTask: Task = {
    ...TASKS_STORE[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  TASKS_STORE[index] = updatedTask;
  return updatedTask;
}

// Export pour compatibilité (déprécié, utiliser getMockTasks() à la place)
export const mockTasks: Task[] = TASKS_STORE;

