/**
 * Tasks API Adapter
 * 
 * API unifiée pour les tâches.
 * Respecte API_MODE pour basculer entre mock et API réelle.
 * 
 * Migration vers API réelle :
 * 1. Mettre API_MODE = 'api' dans src/config/apiMode.ts
 * 2. Les appels utiliseront automatiquement l'API réelle
 */

import { API_MODE } from '../config/apiMode';
import { apiFetch } from './client';
import * as mockBackend from '../mocks/backend';
import { ApiError } from '../mocks/backend/errors';
import type { Task, TaskStatus } from '../types/task';
import { normalizeTask } from '../types/task';

// Ré-exporter Task et TaskStatus pour compatibilité
export type { Task, TaskStatus };

export type MyTasksFilters = {
  status?: TaskStatus | 'all';
};

export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Récupère toutes les tâches
 */
export async function getTasks(_accessToken?: string | null): Promise<Task[]> {
  if (API_MODE === 'mock') {
    const response = await mockBackend.handleGetTasks();
    if (response.status !== 200) {
      throw new ApiError(response.status, response.error || 'Failed to get tasks');
    }
    return response.data || [];
  }

  const path = '/api/tasks';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère une tâche par ID
 */
export async function getTaskById(
  taskId: string,
  _accessToken?: string | null,
): Promise<Task> {
  if (API_MODE === 'mock') {
    const response = await mockBackend.handleGetTaskById(taskId);
    if (response.status !== 200) {
      throw new ApiError(response.status, response.error || `Task with id "${taskId}" not found`);
    }
    return response.data!;
  }

  const path = `/api/tasks/${encodeURIComponent(taskId)}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task>(path, {}, _accessToken);
}

/**
 * Crée une nouvelle tâche
 */
export async function createTask(
  taskData: Partial<Task>,
  _accessToken?: string | null,
): Promise<Task> {
  if (API_MODE === 'mock') {
    const response = await mockBackend.handleCreateTask(taskData);
    if (response.status !== 201) {
      throw new ApiError(response.status, response.error || 'Failed to create task');
    }
    return response.data!;
  }

  const path = '/api/tasks';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task>(
    path,
    {
      method: 'POST',
      body: JSON.stringify(taskData),
    },
    _accessToken,
  );
}

/**
 * Met à jour une tâche
 */
export async function updateTask(
  id: string,
  updates: Partial<Task>,
  _accessToken?: string | null,
): Promise<Task> {
  if (API_MODE === 'mock') {
    const response = await mockBackend.handleUpdateTask(id, updates);
    if (response.status !== 200) {
      throw new ApiError(response.status, response.error || `Failed to update task "${id}"`);
    }
    return response.data!;
  }

  const path = `/api/tasks/${encodeURIComponent(id)}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task>(
    path,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    },
    _accessToken,
  );
}

/**
 * Supprime une tâche
 */
export async function deleteTask(
  id: string,
  _accessToken?: string | null,
): Promise<void> {
  if (API_MODE === 'mock') {
    const response = await mockBackend.handleDeleteTask(id);
    if (response.status !== 204 && response.status !== 200) {
      throw new ApiError(response.status, response.error || `Failed to delete task "${id}"`);
    }
    return;
  }

  const path = `/api/tasks/${encodeURIComponent(id)}`;
  if (!_accessToken) throw new Error('Access token required');
  await apiFetch<void>(
    path,
    {
      method: 'DELETE',
    },
    _accessToken,
  );
}

/**
 * Met à jour le statut d'une tâche
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  _accessToken?: string | null,
): Promise<Task> {
  return updateTask(taskId, { status: newStatus }, _accessToken);
}

/**
 * Récupère les tâches de l'utilisateur avec pagination et filtres
 * (Compatibilité avec l'ancienne API)
 */
export async function getMyTasks(
  _accessToken?: string | null,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  if (API_MODE === 'mock') {
    const allTasks = await getTasks(_accessToken);
    
    // Filtrer par statut
    let filteredTasks = allTasks;
    if (params.filters?.status && params.filters.status !== 'all') {
      if (params.filters.status === 'done') {
        filteredTasks = allTasks.filter(t => t.status === 'done');
      } else {
        // 'active' = todo, in_progress, blocked
        filteredTasks = allTasks.filter(t => 
          t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked'
        );
      }
    }
    
    // Paginer
    const { page = 1, pageSize = 20 } = params;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredTasks.slice(startIndex, endIndex);
    
    return {
      items,
      page,
      pageSize,
      total: filteredTasks.length,
    };
  }

  const { page = 1, pageSize = 20, filters } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (filters?.status && filters.status !== 'all') {
    searchParams.set('status', filters.status);
  }

  const path = `/me/tasks?${searchParams.toString()}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<MyTasksPage>(path, {}, _accessToken);
}

/**
 * Récupère les tâches prioritaires (todo + in_progress)
 */
export async function getMyPriorities(_accessToken?: string | null): Promise<Task[]> {
  if (API_MODE === 'mock') {
    const allTasks = await getTasks(_accessToken);
    return allTasks.filter(t => t.status === 'todo' || t.status === 'in_progress');
  }

  const path = '/me/tasks/priorities';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches dues bientôt (dans les 7 prochains jours)
 */
export async function getDueSoon(_accessToken?: string | null): Promise<Task[]> {
  if (API_MODE === 'mock') {
    const allTasks = await getTasks(_accessToken);
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return allTasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= now && dueDate <= in7Days;
    });
  }

  const path = '/me/tasks/due-soon';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches récemment mises à jour
 */
export async function getRecentlyUpdated(_accessToken?: string | null): Promise<Task[]> {
  if (API_MODE === 'mock') {
    const allTasks = await getTasks(_accessToken);
    return allTasks
      .filter(t => t.updatedAt)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA; // DESC
      })
      .slice(0, 10);
  }

  const path = '/me/tasks/recently-updated';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches en retard
 */
export async function getLate(_accessToken?: string | null): Promise<Task[]> {
  if (API_MODE === 'mock') {
    const allTasks = await getTasks(_accessToken);
    const now = new Date();
    return allTasks.filter(t => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < now && t.status !== 'done';
    });
  }

  const path = '/me/tasks/late';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}
