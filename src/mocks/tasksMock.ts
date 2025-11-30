/**
 * Tasks Mock Data - Mock DB Unique
 * 
 * @deprecated Utiliser src/mocks/backend/store.ts à la place
 * 
 * Cette mock DB remplace suiviData.ts pendant le MVP.
 * Une seule source de vérité en mémoire, destinée à être remplacée par l'API réelle.
 * 
 * MIGRATION :
 * - Remplacer getMockTasks() par backendStore.getTasksStore()
 * - Remplacer updateMockTask() par backendStore.updateTaskInStore()
 * - Remplacer deleteMockTask() par backendStore.deleteTaskFromStore()
 * - Remplacer setMockTasks() par backendStore.setTasksStore()
 * 
 * Ce fichier est conservé pour compatibilité mais sera supprimé dans une future version.
 */

import type { Task } from '../types/task';
import { TASKS } from './suiviData';
import * as backendStore from './backend/store';

// Store unique en mémoire (Mock DB)
// DÉPRÉCIÉ : Utiliser backendStore.getTasksStore() à la place
let TASKS_STORE: Task[] = [...TASKS];

/**
 * Récupérer toutes les tâches depuis le store
 * 
 * @deprecated Utiliser backendStore.getTasksStore() à la place
 * @returns Task[] Liste de toutes les tâches (référence directe, pas de copie)
 */
export function getMockTasks(): Task[] {
  // Synchroniser avec le backend store pour compatibilité
  return backendStore.getTasksStore();
}

/**
 * Remplacer complètement le store
 * 
 * @deprecated Utiliser backendStore.setTasksStore() à la place
 * @param next - Nouvelle liste de tâches
 */
export function setMockTasks(next: Task[]): void {
  backendStore.setTasksStore(next);
  TASKS_STORE = next; // Garder synchronisé pour compatibilité
}

/**
 * Supprimer une tâche du store
 * 
 * @deprecated Utiliser backendStore.deleteTaskFromStore() à la place
 * @param id - ID de la tâche à supprimer
 * @returns boolean true si la tâche a été supprimée, false si non trouvée
 */
export function deleteMockTask(id: string): boolean {
  return backendStore.deleteTaskFromStore(id);
}

/**
 * Mettre à jour une tâche dans le store
 * 
 * @deprecated Utiliser backendStore.updateTaskInStore() à la place
 * @param id - ID de la tâche à mettre à jour
 * @param patch - Champs partiels à fusionner
 * @returns Task | undefined La tâche mise à jour ou undefined si non trouvée
 */
export function updateMockTask(id: string, patch: Partial<Task>): Task | undefined {
  return backendStore.updateTaskInStore(id, patch);
}

// Export pour compatibilité (déprécié, utiliser getMockTasks() à la place)
export const mockTasks: Task[] = TASKS_STORE;

