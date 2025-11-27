import { USE_MOCK_API } from '../config/environment';
import { apiFetch } from './client';
import * as mockTasks from './tasksApi.mock';
import type { Task, TaskStatus } from '../types/task';
import { normalizeTask } from '../types/task';

// Ré-exporter Task et TaskStatus pour compatibilité avec les fichiers qui importent depuis './tasks'
export type { Task, TaskStatus };

export type MyTasksFilters = {
  status?: TaskStatus | 'all';
  // Note: 'active' n'est pas un TaskStatus valide, mais peut être utilisé
  // pour filtrer les tâches actives (todo, in_progress, blocked)
  // La conversion est gérée dans getMyTasks()
};

export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Récupère les tâches de l'utilisateur avec pagination et filtres
 */
export async function getMyTasks(
  _accessToken?: string | null,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  if (USE_MOCK_API) {
    // Convertir les filtres pour tasksApi.mock.ts
    // Note: 'active' dans tasksApi.mock.ts inclut todo, in_progress, blocked
    // Si on reçoit 'todo', 'in_progress', ou 'blocked', on les traite comme 'active'
    const filter = params.filters?.status === 'all' || !params.filters?.status
      ? 'all'
      : params.filters.status === 'done'
        ? 'completed'
        : 'active'; // 'todo', 'in_progress', 'blocked' → tous traités comme 'active'
    const rawTasks = await mockTasks.getMyTasks(filter);
    
    // Normaliser toutes les tâches vers le type Task central
    const tasks = rawTasks.map((rawTask) => normalizeTask(rawTask));
    
    // Paginer manuellement
    const { page = 1, pageSize = 20 } = params;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = tasks.slice(startIndex, endIndex);
    
    return {
      items,
      page,
      pageSize,
      total: tasks.length,
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
 * Récupère une tâche par ID
 */
export async function getTaskById(
  taskId: string,
  _accessToken?: string | null,
): Promise<Task> {
  if (USE_MOCK_API) {
    const rawTask = await mockTasks.getTaskById(taskId);
    if (!rawTask) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    // Normaliser la tâche vers le type Task central
    return normalizeTask(rawTask);
  }

  const path = `/tasks/${encodeURIComponent(taskId)}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task>(path, {}, _accessToken);
}

/**
 * Met à jour le statut d'une tâche
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  _accessToken?: string | null,
): Promise<Task> {
  if (USE_MOCK_API) {
    const rawTask = await mockTasks.updateTaskStatus(taskId, newStatus);
    // Normaliser la tâche vers le type Task central
    return normalizeTask(rawTask);
  }

  const path = `/tasks/${encodeURIComponent(taskId)}/status`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task>(
    path,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    },
    _accessToken,
  );
}

/**
 * Récupère les tâches prioritaires (todo + in_progress)
 */
export async function getMyPriorities(_accessToken?: string | null): Promise<Task[]> {
  if (USE_MOCK_API) {
    const rawTasks = await mockTasks.getMyPriorities();
    // Normaliser toutes les tâches vers le type Task central
    return rawTasks.map((rawTask) => normalizeTask(rawTask));
  }

  const path = '/me/tasks/priorities';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches dues bientôt (dans les 7 prochains jours)
 */
export async function getDueSoon(_accessToken?: string | null): Promise<Task[]> {
  if (USE_MOCK_API) {
    const rawTasks = await mockTasks.getDueSoon();
    // Normaliser toutes les tâches vers le type Task central
    return rawTasks.map((rawTask) => normalizeTask(rawTask));
  }

  const path = '/me/tasks/due-soon';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches récemment mises à jour
 */
export async function getRecentlyUpdated(_accessToken?: string | null): Promise<Task[]> {
  if (USE_MOCK_API) {
    const rawTasks = await mockTasks.getRecentlyUpdated();
    // Normaliser toutes les tâches vers le type Task central
    return rawTasks.map((rawTask) => normalizeTask(rawTask));
  }

  const path = '/me/tasks/recently-updated';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}

/**
 * Récupère les tâches en retard
 */
export async function getLate(_accessToken?: string | null): Promise<Task[]> {
  if (USE_MOCK_API) {
    const rawTasks = await mockTasks.getLate();
    // Normaliser toutes les tâches vers le type Task central
    return rawTasks.map((rawTask) => normalizeTask(rawTask));
  }

  const path = '/me/tasks/late';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Task[]>(path, {}, _accessToken);
}


