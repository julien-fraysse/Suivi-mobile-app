import { USE_MOCK_API } from '../config/environment';
import { apiFetch } from './client';
import * as mockActivity from '../mocks/data/activity';

export type ActivityItem = {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'project_created' | 'comment_added';
  actor: {
    name: string;
    avatarUrl?: string;
  };
  target: {
    type: 'task' | 'project';
    id: string;
    name: string;
  };
  message: string;
  createdAt: string;
};

/**
 * Récupère le fil d'activité
 */
export async function getActivityFeed(
  limit: number = 10,
  _accessToken?: string | null,
): Promise<ActivityItem[]> {
  if (USE_MOCK_API) {
    return mockActivity.getActivityFeed(limit);
  }

  const path = `/me/activity?limit=${limit}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<ActivityItem[]>(path, {}, _accessToken);
}

/**
 * Récupère l'activité d'une tâche spécifique
 */
export async function getTaskActivity(
  taskId: string,
  _accessToken?: string | null,
): Promise<ActivityItem[]> {
  if (USE_MOCK_API) {
    return mockActivity.getTaskActivity(taskId);
  }

  const path = `/tasks/${encodeURIComponent(taskId)}/activity`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<ActivityItem[]>(path, {}, _accessToken);
}


