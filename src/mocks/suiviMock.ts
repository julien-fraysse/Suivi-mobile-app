/**
 * Suivi Mobile Mock Data
 * 
 * Module centralisé contenant toutes les données mockées pour le MVP Suivi mobile.
 * 
 * RÈGLE ABSOLUE : 
 * - Toutes les données sont mockées ici
 * - Les hooks utilisent ces mocks via `/src/services/api.ts`
 * - Pour remplacer par les vraies API : changer UNIQUEMENT `/src/services/api.ts`
 * 
 * @see /src/services/api.ts pour la migration vers les vraies API
 */

import { Task, TaskStatus } from '../api/tasks';

// ============================================================================
// TYPES
// ============================================================================

export type Project = {
  id: string;
  name: string;
  color?: string;
  taskCount: number;
};

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

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
};

export type QuickStats = {
  activeTasks: number;
  completedToday: number;
  dueToday: number;
  overdue: number;
  totalProjects: number;
};

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

export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Implémenter le design system Suivi',
    status: 'in_progress',
    dueDate: '2024-11-20',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
  },
  {
    id: '2',
    title: 'Créer les composants UI réutilisables',
    status: 'done',
    dueDate: '2024-11-15',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T16:30:00Z',
  },
  {
    id: '3',
    title: 'Intégrer les polices Inter et IBM Plex Mono',
    status: 'done',
    dueDate: '2024-11-14',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-14T14:20:00Z',
  },
  {
    id: '4',
    title: 'Configurer la navigation entre écrans',
    status: 'todo',
    dueDate: '2024-11-21',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T08:00:00Z',
  },
  {
    id: '5',
    title: 'Créer la page de profil utilisateur',
    status: 'todo',
    dueDate: '2024-11-22',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:00:00Z',
  },
  {
    id: '6',
    title: 'Optimiser les performances de la liste des tâches',
    status: 'blocked',
    dueDate: '2024-11-25',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
  },
  {
    id: '7',
    title: 'Ajouter le système de notifications push',
    status: 'todo',
    dueDate: '2024-11-18',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:15:00Z',
  },
  {
    id: '8',
    title: 'Créer les tests unitaires pour les composants',
    status: 'in_progress',
    dueDate: '2024-11-19',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:30:00Z',
  },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Mobile App',
    color: '#4F5DFF',
    taskCount: 8,
  },
  {
    id: '2',
    name: 'Backend API',
    color: '#FDD447',
    taskCount: 12,
  },
  {
    id: '3',
    name: 'Design System',
    color: '#00C853',
    taskCount: 5,
  },
  {
    id: '4',
    name: 'Documentation',
    color: '#98928C',
    taskCount: 3,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
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

const MOCK_USER: User = {
  id: '1',
  email: 'julien@suivi.app',
  firstName: 'Julien',
  lastName: 'Suivi',
  avatarUrl: undefined,
  role: 'admin',
};

const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    actor: {
      name: 'Julien Suivi',
    },
    target: {
      type: 'task',
      id: '2',
      name: 'Créer les composants UI réutilisables',
    },
    message: 'a complété la tâche',
    createdAt: '2024-11-15T16:30:00Z',
  },
  {
    id: '2',
    type: 'task_created',
    actor: {
      name: 'Julien Suivi',
    },
    target: {
      type: 'task',
      id: '4',
      name: 'Configurer la navigation entre écrans',
    },
    message: 'a créé la tâche',
    createdAt: '2024-11-16T08:00:00Z',
  },
  {
    id: '3',
    type: 'task_updated',
    actor: {
      name: 'Julien Suivi',
    },
    target: {
      type: 'task',
      id: '1',
      name: 'Implémenter le design system Suivi',
    },
    message: 'a mis à jour la tâche',
    createdAt: '2024-11-16T10:00:00Z',
  },
  {
    id: '4',
    type: 'project_created',
    actor: {
      name: 'Julien Suivi',
    },
    target: {
      type: 'project',
      id: '1',
      name: 'Mobile App',
    },
    message: 'a créé le projet',
    createdAt: '2024-11-10T09:00:00Z',
  },
];

// ============================================================================
// MOCK FUNCTIONS
// ============================================================================

/**
 * Simule un délai réseau (pour rendre les mocks plus réalistes)
 */
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Filtre les tâches selon les critères donnés
 */
function filterTasks(
  tasks: Task[],
  filters?: { status?: TaskStatus | 'all' },
): Task[] {
  if (!filters?.status || filters.status === 'all') {
    return tasks;
  }
  return tasks.filter((task) => task.status === filters.status);
}

/**
 * Mock API: Récupère les tâches de l'utilisateur
 */
export async function getTasks(
  params: {
    page?: number;
    pageSize?: number;
    filters?: { status?: TaskStatus | 'all' };
  } = {},
): Promise<MyTasksPage> {
  await delay(200);

  const { page = 1, pageSize = 20, filters } = params;
  const filteredTasks = filterTasks(MOCK_TASKS, filters);
  const total = filteredTasks.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredTasks.slice(startIndex, endIndex);

  return {
    items,
    page,
    pageSize,
    total,
  };
}

/**
 * Mock API: Récupère une tâche par ID
 */
export async function getTaskById(taskId: string): Promise<Task> {
  await delay(150);

  const task = MOCK_TASKS.find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  return task;
}

/**
 * Mock API: Récupère tous les projets
 */
export async function getProjects(): Promise<Project[]> {
  await delay(200);
  return [...MOCK_PROJECTS];
}

/**
 * Mock API: Récupère toutes les notifications
 */
export async function getNotifications(): Promise<Notification[]> {
  await delay(150);
  return [...MOCK_NOTIFICATIONS];
}

/**
 * Mock API: Récupère l'utilisateur actuel
 */
export async function getUser(): Promise<User> {
  await delay(100);
  return { ...MOCK_USER };
}

/**
 * Mock API: Récupère les statistiques rapides
 */
export async function getQuickStats(): Promise<QuickStats> {
  await delay(150);

  const activeTasks = MOCK_TASKS.filter(
    (t) => t.status === 'todo' || t.status === 'in_progress',
  ).length;
  const completedToday = MOCK_TASKS.filter(
    (t) => t.status === 'done' && t.updatedAt?.startsWith(new Date().toISOString().split('T')[0]),
  ).length;
  const dueToday = MOCK_TASKS.filter(
    (t) => t.dueDate === new Date().toISOString().split('T')[0],
  ).length;
  const overdue = MOCK_TASKS.filter((t) => {
    if (!t.dueDate || t.status === 'done') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return {
    activeTasks,
    completedToday,
    dueToday,
    overdue,
    totalProjects: MOCK_PROJECTS.length,
  };
}

/**
 * Mock API: Récupère le fil d'activité
 */
export async function getActivityFeed(limit: number = 10): Promise<ActivityItem[]> {
  await delay(200);
  return [...MOCK_ACTIVITY_FEED].slice(0, limit);
}

/**
 * Export de toutes les fonctions mockées
 */
export const mock = {
  getTasks,
  getTaskById,
  getProjects,
  getNotifications,
  getUser,
  getQuickStats,
  getActivityFeed,
};

export default mock;


