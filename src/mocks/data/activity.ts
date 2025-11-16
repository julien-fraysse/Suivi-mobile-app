/**
 * Activity Mock Data
 * 
 * Données mockées pour l'activité.
 * Stockage en mémoire simple pour le MVP.
 */

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

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    actor: { name: 'Julien Suivi' },
    target: { type: 'task', id: '2', name: 'Créer les composants UI réutilisables' },
    message: 'a complété la tâche',
    createdAt: '2024-11-15T16:30:00Z',
  },
  {
    id: '2',
    type: 'task_created',
    actor: { name: 'Julien Suivi' },
    target: { type: 'task', id: '4', name: 'Configurer la navigation entre écrans' },
    message: 'a créé la tâche',
    createdAt: '2024-11-16T08:00:00Z',
  },
  {
    id: '3',
    type: 'task_updated',
    actor: { name: 'Julien Suivi' },
    target: { type: 'task', id: '1', name: 'Implémenter le design system Suivi' },
    message: 'a mis à jour la tâche',
    createdAt: '2024-11-16T10:00:00Z',
  },
  {
    id: '4',
    type: 'project_created',
    actor: { name: 'Julien Suivi' },
    target: { type: 'project', id: '1', name: 'Mobile App' },
    message: 'a créé le projet',
    createdAt: '2024-11-10T09:00:00Z',
  },
  {
    id: '5',
    type: 'comment_added',
    actor: { name: 'Julien Suivi' },
    target: { type: 'task', id: '4', name: 'Configurer la navigation entre écrans' },
    message: 'a ajouté un commentaire',
    createdAt: '2024-11-16T08:30:00Z',
  },
];

export async function getActivityFeed(limit: number = 10): Promise<ActivityItem[]> {
  await delay();
  return [...MOCK_ACTIVITY_FEED].slice(0, limit);
}

export async function getTaskActivity(taskId: string): Promise<ActivityItem[]> {
  await delay();
  return MOCK_ACTIVITY_FEED.filter(
    (activity) => activity.target.type === 'task' && activity.target.id === taskId,
  ).slice(0, 3);
}

export const mockActivity = MOCK_ACTIVITY_FEED;


