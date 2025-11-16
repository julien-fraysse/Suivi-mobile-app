/**
 * Notifications Mock Data
 * 
 * Données mockées pour les notifications.
 * Stockage en mémoire simple pour le MVP.
 */

export type Notification = {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_update' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: 'task' | 'project';
};

const delay = (ms: number = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'Nouvelle tâche assignée',
    message: 'La tâche "Implémenter le design system Suivi" vous a été assignée',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    relatedId: '1',
    relatedType: 'task',
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Tâche complétée',
    message: 'La tâche "Créer les composants UI réutilisables" a été complétée',
    read: false,
    createdAt: '2024-11-15T16:30:00Z',
    relatedId: '2',
    relatedType: 'task',
  },
  {
    id: '3',
    type: 'task_overdue',
    title: 'Tâche en retard',
    message: 'La tâche "Intégrer les polices Inter et IBM Plex Mono" est en retard',
    read: true,
    createdAt: '2024-11-14T14:20:00Z',
    relatedId: '3',
    relatedType: 'task',
  },
  {
    id: '4',
    type: 'project_update',
    title: 'Mise à jour du projet',
    message: 'Le projet "Mobile App" a été mis à jour',
    read: true,
    createdAt: '2024-11-13T12:00:00Z',
    relatedId: '1',
    relatedType: 'project',
  },
  {
    id: '5',
    type: 'comment',
    title: 'Nouveau commentaire',
    message: 'Un commentaire a été ajouté sur la tâche "Configurer la navigation"',
    read: false,
    createdAt: '2024-11-16T08:00:00Z',
    relatedId: '4',
    relatedType: 'task',
  },
];

export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return [...MOCK_NOTIFICATIONS];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await delay();
  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
}

export const mockNotifications = MOCK_NOTIFICATIONS;


