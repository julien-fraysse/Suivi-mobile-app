/**
 * Tasks Service
 * 
 * Service API pour les tâches avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 * 
 * TODO: align this with central Task type from src/types/task.ts
 */

import { API_MODE } from '../config/apiMode';
import { apiGet, apiPost } from './api';
import { getMockTasks, deleteMockTask, updateMockTask, setMockTasks } from '../mocks/tasksMock';
import type { Task } from '../api/tasks';

export async function fetchTasks(): Promise<Task[]> {
  if (API_MODE === 'mock') {
    return getMockTasks();
  }
  return apiGet('/tasks');
}

export async function fetchTaskById(id: string): Promise<Task | undefined> {
  if (API_MODE === 'mock') {
    const tasks = getMockTasks();
    return tasks.find((task) => task.id === id);
  }
  return apiGet(`/tasks/${id}`);
}

export async function createTask(task: any) {
  if (API_MODE === 'mock') {
    // Mock: ajouter la tâche au store
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const currentTasks = getMockTasks();
    setMockTasks([...currentTasks, newTask]);
    return newTask;
  }
  return apiPost('/tasks', task);
}

export async function updateTask(id: string, task: any) {
  if (API_MODE === 'mock') {
    // Mock: mettre à jour la tâche dans le store
    const updatedTask = updateMockTask(id, task);
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    return updatedTask;
  }
  return apiPost(`/tasks/${id}`, task);
}

export async function deleteTask(taskId: string): Promise<{ success: boolean }> {
  if (API_MODE === 'mock') {
    // Mock: supprimer la tâche du store unique
    const deleted = deleteMockTask(taskId);
    return { success: deleted };
  }
  // TODO: API réelle
  return apiPost(`/tasks/${taskId}/delete`, {});
}

