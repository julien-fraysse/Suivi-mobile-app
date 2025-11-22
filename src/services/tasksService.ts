/**
 * Tasks Service
 * 
 * Service API pour les tâches avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 */

import { API_MODE } from '../config/apiMode';
import { apiGet, apiPost } from './api';
import { mockTasks } from '../mocks/tasksMock';
import type { Task } from '../api/tasks';

export async function fetchTasks(): Promise<Task[]> {
  if (API_MODE === 'mock') {
    return mockTasks;
  }
  return apiGet('/tasks');
}

export async function fetchTaskById(id: string): Promise<Task | undefined> {
  if (API_MODE === 'mock') {
    return mockTasks.find((task) => task.id === id);
  }
  return apiGet(`/tasks/${id}`);
}

export async function createTask(task: any) {
  if (API_MODE === 'mock') {
    // Mock: ajouter la tâche localement
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return newTask;
  }
  return apiPost('/tasks', task);
}

export async function updateTask(id: string, task: any) {
  if (API_MODE === 'mock') {
    // Mock: mettre à jour la tâche localement
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...task };
      return mockTasks[taskIndex];
    }
    throw new Error(`Task with id ${id} not found`);
  }
  return apiPost(`/tasks/${id}`, task);
}

