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
 * 
 * ARCHITECTURE: Uses React Context API to share state globally across all components.
 * This ensures that MainTabNavigator and NotificationsScreen share the same state,
 * so the badge updates immediately when notifications are marked as read.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { loadNotifications, type SuiviNotification, type NotificationType } from '../../mocks/suiviData';

/**
 * NotificationType est maintenant importé depuis suiviData.ts (source unique de vérité)
 * 
 * Types de notifications orientées "sollicitations utilisateur" uniquement.
 * Les événements globaux (board_created, task_completed_by_someone_else, etc.)
 * sont exclus car ils apparaissent dans le flux Home, pas dans Notifications.
 */
export type { NotificationType } from '../../mocks/suiviData';

/**
 * Notification Interface
 * 
 * Represents a notification in the Suivi mobile app.
 * 
 * Notifications are user-focused events (sollicitations directes).
 * Global events (board_created, task_completed_by_someone_else, etc.) appear
 * in the Home feed, not in Notifications.
 * 
 * IMPORTANT: Cette interface correspond à SuiviNotification de suiviData.ts
 * (source unique de vérité). Les notifications sont chargées via loadNotifications().
 * 
 * TODO: When Suivi backend API is ready, the relatedTaskId field will come from
 * the backend response. The linking mechanism (navigation to TaskDetail when
 * relatedTaskId is set) will remain unchanged.
 */
export type Notification = SuiviNotification;

/**
 * Les notifications sont maintenant chargées depuis suiviData.ts (source unique de vérité).
 * 
 * IMPORTANT: 
 * - relatedTaskId dans les notifications DOIT correspondre EXACTEMENT aux IDs des tâches dans suiviData.ts
 * - Format des IDs : '1', '2', '3', etc. (plus jamais 'task-1', 'task-2')
 * - Aucune notification ne pointe vers une tâche inexistante
 * 
 * TODO: When Suivi backend API is ready:
 *   - Replace loadNotifications() by GET /api/notifications
 *   - The backend will provide notifications with relatedTaskId fields that link to real tasks
 *   - Tasks will come from GET /api/tasks (also from backend)
 *   - The linking mechanism (navigation to TaskDetail when relatedTaskId is set) remains unchanged
 */

/**
 * NotificationsContextValue
 * 
 * Interface for the notifications context value.
 */
interface NotificationsContextValue {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

/**
 * NotificationsContext
 * 
 * React Context for sharing notifications state globally.
 */
const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/**
 * NotificationsProvider
 * 
 * Provider component that manages notifications state and exposes it via Context.
 * 
 * MOCK ONLY - replace with real Suivi API later
 * 
 * @param children - React children components
 * 
 * TODO: When Suivi API is ready, replace internal state by:
 *   1. API call to GET /api/notifications on mount
 *   2. API call to PATCH /api/notifications/:id/read when markAsRead is called
 *   3. API call to PATCH /api/notifications/read-all when markAllAsRead is called
 *   4. Keep the same hook interface so components don't need to change
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  // MOCK ONLY: In-memory state for notifications
  // TODO: Replace with API calls (GET /api/notifications)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Charger les notifications depuis suiviData.ts (source unique de vérité)
   * 
   * TODO: Replace by GET /api/notifications with authentification
   */
  useEffect(() => {
    const loadInitialNotifications = async () => {
      try {
        setIsLoading(true);
        const loadedNotifications = await loadNotifications();
        setNotifications(loadedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // En cas d'erreur, on garde un tableau vide pour éviter les crashes
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialNotifications();
  }, []);

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

  /**
   * deleteNotification
   * 
   * Deletes a notification from the list.
   * 
   * MOCK ONLY - TODO: Replace with DELETE /api/notifications/:id API call
   * 
   * @param id - ID of the notification to delete
   */
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: When Suivi API is ready, add API call here:
    // await api.delete(`/api/notifications/${id}`);
  }, []);

  const value: NotificationsContextValue = {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

/**
 * useNotificationsStore
 * 
 * Hook to access the notifications context.
 * 
 * @returns {Object} Store interface:
 *   - notifications: Notification[] - All notifications in memory
 *   - markAsRead(id: string) - Mark a notification as read
 *   - markAllAsRead() - Mark all notifications as read
 *   - deleteNotification(id: string) - Delete a notification
 * 
 * @throws {Error} If used outside of NotificationsProvider
 */
export function useNotificationsStore(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  
  if (!context) {
    throw new Error(
      'useNotificationsStore must be used within a NotificationsProvider. ' +
      'Make sure to wrap your app with <NotificationsProvider> in App.tsx'
    );
  }
  
  return context;
}

