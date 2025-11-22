/**
 * Notifications Service
 * 
 * Service API pour les notifications avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 */

import { API_MODE } from '../config/apiMode';
import { apiGet, apiPost } from './api';
import { mockNotifications } from '../mocks/notificationsMock';
import type { Notification } from '../api/notificationsApi.mock';

export async function fetchNotifications(): Promise<Notification[]> {
  if (API_MODE === 'mock') {
    return mockNotifications;
  }
  return apiGet('/notifications');
}

export async function markNotificationRead(id: string): Promise<void> {
  if (API_MODE === 'mock') {
    // Mock implementation
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
    return;
  }
  return apiPost(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  if (API_MODE === 'mock') {
    // Mock implementation
    mockNotifications.forEach((n) => {
      n.read = true;
    });
    return;
  }
  return apiPost('/notifications/read-all', {});
}

