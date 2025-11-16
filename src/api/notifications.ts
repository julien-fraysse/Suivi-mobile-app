import { USE_MOCK_API } from '../config/environment';
import { apiFetch } from './client';
import * as mockNotifications from './notificationsApi.mock';

export type Notification = {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_update' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string; // ID de la tâche liée (pour navigation)
  projectId?: string; // ID du projet lié (pour navigation future)
};

/**
 * Récupère toutes les notifications
 */
export async function getNotifications(_accessToken?: string | null): Promise<Notification[]> {
  if (USE_MOCK_API) {
    return mockNotifications.getNotifications();
  }

  const path = '/me/notifications';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<Notification[]>(path, {}, _accessToken);
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(
  notificationId: string,
  _accessToken?: string | null,
): Promise<void> {
  if (USE_MOCK_API) {
    return mockNotifications.markNotificationRead(notificationId);
  }

  const path = `/me/notifications/${encodeURIComponent(notificationId)}/read`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<void>(
    path,
    {
      method: 'PUT',
    },
    _accessToken,
  );
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsRead(_accessToken?: string | null): Promise<void> {
  if (USE_MOCK_API) {
    return mockNotifications.markAllNotificationsRead();
  }

  const path = '/me/notifications/read-all';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<void>(
    path,
    {
      method: 'PUT',
    },
    _accessToken,
  );
}

