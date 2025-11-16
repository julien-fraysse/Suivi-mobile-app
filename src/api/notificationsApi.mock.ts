/**
 * Notifications Mock API
 * 
 * API mockée pour les notifications.
 * Remplacez ce fichier par un vrai client API (même signature) pour migrer vers l'API Suivi réelle.
 * 
 * @see ../config/environment.ts pour le flag USE_MOCK_API
 * @see docs/mobile/mock-data.md pour la documentation complète
 */

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

const delay = (ms: number = 150) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'Nouvelle tâche assignée',
    message: 'La tâche "Implémenter le design system Suivi" vous a été assignée',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    taskId: '1',
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Tâche complétée',
    message: 'La tâche "Créer les composants UI réutilisables" a été complétée',
    read: false,
    createdAt: '2024-11-15T16:30:00Z',
    taskId: '2',
  },
  {
    id: '3',
    type: 'task_overdue',
    title: 'Tâche en retard',
    message: 'La tâche "Intégrer les polices Inter et IBM Plex Mono" est en retard',
    read: true,
    createdAt: '2024-11-14T14:20:00Z',
    taskId: '3',
  },
  {
    id: '4',
    type: 'project_update',
    title: 'Mise à jour du projet',
    message: 'Le projet "Mobile App" a été mis à jour',
    read: true,
    createdAt: '2024-11-13T12:00:00Z',
    projectId: '1',
  },
  {
    id: '5',
    type: 'comment',
    title: 'Nouveau commentaire',
    message: 'Un commentaire a été ajouté sur la tâche "Configurer la navigation"',
    read: false,
    createdAt: '2024-11-16T08:00:00Z',
    taskId: '4',
  },
];

/**
 * Récupère toutes les notifications
 * 
 * @returns Promise<Notification[]> Liste de toutes les notifications
 */
export async function getNotifications(): Promise<Notification[]> {
  await delay();
  return [...MOCK_NOTIFICATIONS];
}

/**
 * Marque une notification comme lue
 * 
 * @param id - ID de la notification
 * @returns Promise<void>
 */
export async function markNotificationRead(id: string): Promise<void> {
  await delay();
  const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

/**
 * Marque toutes les notifications comme lues
 * 
 * @returns Promise<void>
 */
export async function markAllNotificationsRead(): Promise<void> {
  await delay();
  MOCK_NOTIFICATIONS.forEach((n) => {
    n.read = true;
  });
}

