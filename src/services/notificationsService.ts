/**
 * Notifications Service
 * 
 * Service API pour les notifications (placeholder).
 * Utilise apiGet/apiPost pour les appels API réels (non utilisés pour l'instant).
 */

import { apiGet, apiPost } from './api';

// Placeholder functions - NOT USED YET
export async function fetchNotifications() {
  return apiGet('/notifications');
}

export async function markNotificationRead(id: string) {
  return apiPost(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead() {
  return apiPost('/notifications/read-all', {});
}

// Mock service functions
import { mockNotifications } from '../mocks/notificationsMock';
import type { Notification } from '../api/notificationsApi.mock';

export async function fetchNotificationsMock(): Promise<Notification[]> {
  return mockNotifications;
}

export async function markNotificationReadMock(id: string): Promise<void> {
  // Mock implementation - not called yet
  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

export async function markAllNotificationsReadMock(): Promise<void> {
  // Mock implementation - not called yet
  mockNotifications.forEach((n) => {
    n.read = true;
  });
}

