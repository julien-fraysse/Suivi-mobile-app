/**
 * Tasks Service
 * 
 * Service API pour les tâches (placeholder).
 * Utilise apiGet/apiPost pour les appels API réels (non utilisés pour l'instant).
 */

import { apiGet, apiPost } from './api';

// Placeholder functions - NOT USED YET
export async function fetchTasks() {
  return apiGet('/tasks');
}

export async function fetchTaskById(id: string) {
  return apiGet(`/tasks/${id}`);
}

export async function createTask(task: any) {
  return apiPost('/tasks', task);
}

export async function updateTask(id: string, task: any) {
  return apiPost(`/tasks/${id}`, task);
}

// Mock service functions
import { mockTasks } from '../mocks/tasksMock';
import type { Task } from '../api/tasks';

export async function fetchTasksMock(): Promise<Task[]> {
  return mockTasks;
}

export async function fetchTaskByIdMock(id: string): Promise<Task | undefined> {
  return mockTasks.find((task) => task.id === id);
}

