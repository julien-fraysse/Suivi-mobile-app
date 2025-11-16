/**
 * MOCK STORE for the Suivi mobile MVP - Notifications Feature
 * 
 * This file centralizes in-memory fake data for the Notifications feature.
 * 
 * TODO: When the real Suivi backend API is ready, replace this implementation
 *       by API calls (GET /api/notifications, PATCH /api/notifications/:id/read, etc.)
 *       while keeping the same hook interface (useNotificationsStore).
 * 
 * The hook signature should remain the same:
 *   - notifications: Notification[] - list of all notifications
 *   - markAsRead(id: string) - mark a notification as read
 *   - markAllAsRead() - mark all notifications as read
 * 
 * This way, components using useNotificationsStore() won't need to change when
 * we switch from mocks to real API calls.
 */

import { useState, useCallback } from 'react';

/**
 * Notification Type
 */
export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_overdue'
  | 'project_update'
  | 'comment';

/**
 * Notification Interface
 * 
 * Represents a notification in the Suivi mobile app.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  taskId?: string; // ID de la tâche liée (pour navigation vers TaskDetail)
  projectId?: string; // ID du projet lié (pour navigation future)
}

/**
 * INITIAL_NOTIFICATIONS
 * 
 * Mock notifications data for the MVP.
 * TODO: Replace this array with real API calls (GET /api/notifications) when backend is ready.
 */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'You have been assigned to "Implémenter le design system Suivi"',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    taskId: '1',
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Task completed',
    message: '"Créer les composants UI réutilisables" has been completed',
    read: false,
    createdAt: '2024-11-15T16:30:00Z',
    taskId: '2',
  },
  {
    id: '3',
    type: 'task_overdue',
    title: 'Task overdue',
    message: '"Review design mockups" is overdue',
    read: true,
    createdAt: '2024-11-16T08:00:00Z',
    taskId: '9',
  },
  {
    id: '4',
    type: 'project_update',
    title: 'Project update',
    message: 'New update on project "Mobile App"',
    read: false,
    createdAt: '2024-11-16T09:00:00Z',
    projectId: 'mobile-app',
  },
  {
    id: '5',
    type: 'comment',
    title: 'New comment',
    message: 'Julien commented on "Configurer la navigation entre écrans"',
    read: true,
    createdAt: '2024-11-16T11:00:00Z',
    taskId: '4',
  },
];

/**
 * useNotificationsStore
 * 
 * Simple hook-based store for notifications management.
 * 
 * MOCK ONLY - replace with real Suivi API later
 * 
 * @returns {Object} Store interface:
 *   - notifications: Notification[] - All notifications in memory
 *   - markAsRead(id: string) - Mark a notification as read
 *   - markAllAsRead() - Mark all notifications as read
 * 
 * TODO: When Suivi API is ready, replace internal state by:
 *   1. API call to GET /api/notifications on mount
 *   2. API call to PATCH /api/notifications/:id/read when markAsRead is called
 *   3. API call to PATCH /api/notifications/read-all when markAllAsRead is called
 *   4. Keep the same hook interface so components don't need to change
 */
export function useNotificationsStore() {
  // MOCK ONLY: In-memory state for notifications
  // TODO: Replace with API calls (GET /api/notifications)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  /**
   * markAsRead
   * 
   * Marks a notification as read.
   * 
   * MOCK ONLY - TODO: Replace with PATCH /api/notifications/:id/read API call
   * 
   * @param id - ID of the notification to mark as read
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: When Suivi API is ready, add API call here:
    // await api.patch(`/api/notifications/${id}/read`);
  }, []);

  /**
   * markAllAsRead
   * 
   * Marks all notifications as read.
   * 
   * MOCK ONLY - TODO: Replace with PATCH /api/notifications/read-all API call
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: When Suivi API is ready, add API call here:
    // await api.patch('/api/notifications/read-all');
  }, []);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    // TODO: when Suivi API is ready, replace internal state by API calls + server state.
  };
}

