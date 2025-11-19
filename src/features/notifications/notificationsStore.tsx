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

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Notification Type
 * 
 * Types de notifications orientées "sollicitations utilisateur" uniquement.
 * Les événements globaux (board_created, task_completed_by_someone_else, etc.)
 * sont exclus car ils apparaissent dans le flux Home, pas dans Notifications.
 */
export type NotificationType =
  | 'task_assigned'           // Nouvelle tâche assignée à moi
  | 'mention_in_comment'       // Mention dans un commentaire
  | 'comment'                 // Commentaire sur ma tâche
  | 'status_changed'          // Statut changé sur ma tâche
  | 'task_due_today'          // Tâche due aujourd'hui (si concerne l'utilisateur)
  | 'task_overdue';           // Tâche en retard (si concerne l'utilisateur)

/**
 * Notification Interface
 * 
 * Represents a notification in the Suivi mobile app.
 * 
 * Notifications are user-focused events (sollicitations directes).
 * Global events (board_created, task_completed_by_someone_else, etc.) appear
 * in the Home feed, not in Notifications.
 * 
 * TODO: When Suivi backend API is ready, the relatedTaskId field will come from
 * the backend response. The linking mechanism (navigation to TaskDetail when
 * relatedTaskId is set) will remain unchanged.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  relatedTaskId?: string | null; // ID de la tâche liée (pour navigation vers TaskDetail) - Doit référencer un ID réel de MOCK_TASKS
  projectId?: string; // ID du projet lié (pour navigation future)
  // Champs pour les actions humaines (createdBy, assignedBy, commentedBy, updatedBy, etc.)
  actor?: {
    id?: string;
    name?: string;
    avatar?: string;
    avatarUrl?: string; // Alias pour compatibilité
    imageUrl?: string; // Alias supplémentaire
  };
  // Alias pour compatibilité avec l'ancien format
  author?: {
    avatar?: string;
    avatarUrl?: string;
    name?: string;
  };
}

/**
 * INITIAL_NOTIFICATIONS
 * 
 * Mock notifications data for the MVP.
 * 
 * IMPORTANT: 
 * - Only user-focused notifications (sollicitations directes) are included.
 * - Global events (board_created, task_completed_by_someone_else, etc.) are excluded
 *   as they appear in the Home feed, not in Notifications.
 * - relatedTaskId must reference REAL task IDs from MOCK_TASKS (src/mocks/tasks/mockTasks.ts).
 *   Available task IDs: task-1, task-2, task-3, ..., task-16
 * 
 * TODO: When Suivi backend API is ready:
 *   - Replace this array with real API calls (GET /api/notifications)
 *   - The backend will provide notifications with relatedTaskId fields that link to real tasks
 *   - Tasks will come from GET /api/tasks (also from backend)
 *   - The linking mechanism (navigation to TaskDetail when relatedTaskId is set) remains unchanged
 */
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'You have been assigned to "Implémenter le design system Suivi"',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    relatedTaskId: 'task-1',
    actor: {
      id: 'user-admin',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New comment',
    message: 'Julien commented on "Configurer la navigation entre écrans"',
    read: false,
    createdAt: '2024-11-16T11:00:00Z',
    relatedTaskId: 'task-3',
    actor: {
      id: 'user-julien',
      name: 'Julien Fraysse',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
  },
  {
    id: 'notif-3',
    type: 'mention_in_comment',
    title: 'Mentioned in comment',
    message: 'You were mentioned in a comment on "Review design mockups"',
    read: false,
    createdAt: '2024-11-16T09:30:00Z',
    relatedTaskId: 'task-2',
    actor: {
      id: 'user-alice',
      name: 'Alice Dupont',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
  },
  {
    id: 'notif-4',
    type: 'status_changed',
    title: 'Status changed',
    message: 'The status of "Créer les composants UI réutilisables" was changed to "En cours"',
    read: true,
    createdAt: '2024-11-15T16:30:00Z',
    relatedTaskId: 'task-4',
    actor: {
      id: 'user-sarah',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  },
  {
    id: 'notif-5',
    type: 'task_due_today',
    title: 'Task due today',
    message: '"Implémenter le design system Suivi" is due today',
    read: false,
    createdAt: '2024-11-16T08:00:00Z',
    relatedTaskId: 'task-1',
    // Pas d'actor car c'est un événement système (reminder)
  },
  {
    id: 'notif-6',
    type: 'task_overdue',
    title: 'Task overdue',
    message: '"Review design mockups" is overdue',
    read: true,
    createdAt: '2024-11-16T08:00:00Z',
    relatedTaskId: 'task-2',
    // Pas d'actor car c'est un événement système (overdue)
  },
];

/**
 * NotificationsContextValue
 * 
 * Interface for the notifications context value.
 */
interface NotificationsContextValue {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
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

  const value: NotificationsContextValue = {
    notifications,
    markAsRead,
    markAllAsRead,
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

