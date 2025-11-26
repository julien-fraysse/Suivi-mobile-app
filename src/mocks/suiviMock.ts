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

import type { Task, TaskStatus } from '../types/task';
import { normalizeTask } from '../types/task';

/**
 * Type intermédiaire pour les mocks (accepte les deux formats : ancien et nouveau)
 * Les mocks peuvent utiliser assigneeName/workspaceName/boardName directement,
 * et seront normalisés via normalizeTask() avant utilisation.
 */
type RawTaskMock = Omit<Task, 'assignee' | 'location' | 'quickActions'> & {
  assigneeName?: string;
  workspaceName?: string;
  boardName?: string;
  quickActions?: Array<{
    actionType?: string;
    type?: string;
    uiHint?: string;
    payload?: Record<string, any>;
  }>;
};

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


export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};

// ============================================================================
// MOCK DATA
// ============================================================================

// Les tâches sont définies avec l'ancien format et seront normalisées lors de l'utilisation
const rawTasks: RawTaskMock[] = [
  {
    id: '1',
    title: 'Répondre à un commentaire sur le design system',
    status: 'in_progress',
    dueDate: '2024-11-20',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
    quickActions: [
      { type: "RATING", uiHint: "stars_1_to_5" },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
  {
    id: '2',
    title: 'Approuver ou refuser la demande de composants UI',
    status: 'done',
    dueDate: '2024-11-15',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T16:30:00Z',
    quickActions: [
      { type: "APPROVAL", uiHint: "approval_dual_button", payload: { requestId: "req_1" } },
      { type: "COMMENT", uiHint: "comment_input" },
      { type: "CALENDAR", uiHint: "calendar_picker" },
    ],
    customFields: [
      { id: "cf1", type: "text", label: "Client", value: "Decathlon" },
      { id: "cf2", type: "enum", label: "Complexité", value: "Moyenne", options: ["Faible", "Moyenne", "Haute"] },
    ],
  },
  {
    id: '3',
    title: 'Noter l\'intégration des polices Inter et IBM Plex Mono',
    status: 'done',
    dueDate: '2024-11-14',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-14T14:20:00Z',
    quickActions: [
      { type: "RATING", uiHint: "stars_1_to_5" },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
  {
    id: '4',
    title: 'Marquer la progression de la configuration de navigation',
    status: 'todo',
    dueDate: '2024-11-21',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T08:00:00Z',
    quickActions: [
      { type: "PROGRESS", uiHint: "progress_slider", payload: { min: 0, max: 100 } },
      { type: "CHECKBOX", uiHint: "simple_checkbox" },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
  {
    id: '5',
    title: 'Indiquer la météo pour la page de profil',
    status: 'todo',
    dueDate: '2024-11-22',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:00:00Z',
    quickActions: [
      { type: "WEATHER", uiHint: "weather_picker", payload: { options: ["sunny", "cloudy", "storm"] } },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
    customFields: [
      { id: "cf3", type: "number", label: "Budget", value: 5000 },
      { id: "cf4", type: "boolean", label: "Urgent", value: true },
      { id: "cf5", type: "date", label: "Date de début", value: "2024-11-20" },
    ],
  },
  {
    id: '6',
    title: 'Définir l\'échéance pour l\'optimisation des performances',
    status: 'blocked',
    dueDate: '2024-11-25',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
    quickActions: [
      { type: "CALENDAR", uiHint: "calendar_picker" },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
  {
    id: '7',
    title: 'Cocher les étapes du système de notifications push',
    status: 'todo',
    dueDate: '2024-11-18',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:15:00Z',
    quickActions: [
      { type: "CHECKBOX", uiHint: "simple_checkbox" },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
  {
    id: '8',
    title: 'Sélectionner le type de tests unitaires à créer',
    status: 'in_progress',
    dueDate: '2024-11-19',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:30:00Z',
    quickActions: [
      { type: "SELECT", uiHint: "dropdown_select", payload: { options: ["Option A", "Option B", "Option C"] } },
      { type: "COMMENT", uiHint: "comment_input" },
    ],
  },
];

// Normaliser toutes les tâches vers le type Task central
export const tasks: Task[] = rawTasks.map((rawTask) => normalizeTask(rawTask));

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
  const filteredTasks = filterTasks(tasks, filters);
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

  const task = tasks.find((t) => t.id === taskId);
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

  const activeTasks = tasks.filter(
    (t) => t.status === 'todo' || t.status === 'in_progress',
  ).length;
  const completedToday = tasks.filter(
    (t) => t.status === 'done' && t.updatedAt?.startsWith(new Date().toISOString().split('T')[0]),
  ).length;
  const dueToday = tasks.filter(
    (t) => t.dueDate === new Date().toISOString().split('T')[0],
  ).length;
  const overdue = tasks.filter((t) => {
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
 * Export de toutes les fonctions mockées
 */
export const mock = {
  getTasks,
  getTaskById,
  getProjects,
  getNotifications,
  getUser,
  getQuickStats,
};

export default mock;


