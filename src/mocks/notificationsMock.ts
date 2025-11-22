/**
 * Notifications Mock Data
 * 
 * Export centralisé des données mockées pour les notifications.
 * Reprend EXACTEMENT les mocks actuels sans transformation.
 */

import type { Notification } from '../api/notificationsApi.mock';

// Reprendre EXACTEMENT les mocks de notificationsApi.mock.ts (lignes 24-70)
export const mockNotifications: Notification[] = [
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

