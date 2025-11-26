/**
 * Tasks Mock API
 * 
 * API mockée pour les tâches. 
 * Remplacez ce fichier par un vrai client API (même signature) pour migrer vers l'API Suivi réelle.
 * 
 * @see ../config/environment.ts pour le flag USE_MOCK_API
 * @see docs/mobile/mock-data.md pour la documentation complète
 */

import type { Task, TaskStatus, MyTasksFilters, MyTasksPage } from './tasks';
import { normalizeTask } from '../types/task';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

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

// Export MOCK_TASKS pour permettre l'import dans suiviData.ts (source unique de vérité)
// Les tâches sont définies avec l'ancien format et seront normalisées lors de l'utilisation
export let MOCK_TASKS: RawTaskMock[] = [
  {
    id: '1',
    title: 'Implémenter le design system Suivi',
    status: 'in_progress',
    dueDate: '2024-11-20',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
    description: 'Créer un design system complet avec tokens, composants réutilisables et documentation. Inclure les polices Inter et IBM Plex Mono, les couleurs Suivi (violet, jaune, gris, sand), et les composants de base (buttons, cards, inputs, etc.).',
    quickActions: [
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '2',
    title: 'Créer les composants UI réutilisables',
    status: 'done',
    dueDate: '2024-11-15',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T16:30:00Z',
    quickActions: [
      { actionType: 'RATING', uiHint: 'stars_1_to_5' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
    customFields: [
      { id: "cf1", type: "text", label: "Client", value: "Decathlon" },
      { id: "cf2", type: "enum", label: "Complexité", value: "Moyenne", options: ["Faible", "Moyenne", "Haute"] },
    ],
  },
  {
    id: '3',
    title: 'Intégrer les polices Inter et IBM Plex Mono',
    status: 'done',
    dueDate: '2024-11-14',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-14T14:20:00Z',
    quickActions: [
      { actionType: 'RATING', uiHint: 'stars_1_to_5' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '4',
    title: 'Configurer la navigation entre écrans',
    status: 'todo',
    dueDate: '2024-11-21',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T08:00:00Z',
    quickActions: [
      { actionType: 'PROGRESS', uiHint: 'progress_slider', payload: { value: 25 } },
      { actionType: 'CHECKBOX', uiHint: 'simple_checkbox' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '5',
    title: 'Créer la page de profil utilisateur',
    status: 'todo',
    dueDate: '2024-11-22',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:00:00Z',
    quickActions: [
      { actionType: 'CALENDAR', uiHint: 'calendar_picker' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
    customFields: [
      { id: "cf3", type: "number", label: "Budget", value: 5000 },
      { id: "cf4", type: "boolean", label: "Urgent", value: true },
      { id: "cf5", type: "date", label: "Date de début", value: "2024-11-20" },
    ],
  },
  {
    id: '6',
    title: 'Optimiser les performances de la liste des tâches',
    status: 'blocked',
    dueDate: '2024-11-25',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
    quickActions: [
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '7',
    title: 'Ajouter le système de notifications push',
    status: 'todo',
    dueDate: '2024-11-18',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:15:00Z',
    quickActions: [
      { actionType: 'CHECKBOX', uiHint: 'simple_checkbox' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '8',
    title: 'Créer les tests unitaires pour les composants',
    status: 'in_progress',
    dueDate: '2024-11-19',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:30:00Z',
    quickActions: [
      { actionType: 'PROGRESS', uiHint: 'progress_slider', payload: { value: 65 } },
      { actionType: 'CHECKBOX', uiHint: 'simple_checkbox' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '9',
    title: 'Review design mockups',
    status: 'todo',
    dueDate: '2024-11-17',
    projectName: 'Design System',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
    quickActions: [
      { actionType: 'APPROVAL', uiHint: 'approval_dual_button', payload: { requestId: 'design-review-001' } },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '10',
    title: 'Setup CI/CD pipeline',
    status: 'todo',
    dueDate: '2024-11-23',
    projectName: 'Backend API',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:30:00Z',
    quickActions: [
      { actionType: 'SELECT', uiHint: 'dropdown_select', payload: { options: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI'] } },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  // Tâches pour couvrir toutes les sections chronologiques
  {
    id: '11',
    title: 'Valider les spécifications API avec le backend',
    status: 'todo',
    dueDate: (() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    })(),
    projectName: 'Backend API',
    assigneeName: 'Julien',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    quickActions: [
      { actionType: 'APPROVAL', uiHint: 'approval_dual_button', payload: { requestId: 'api-spec-001' } },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
      { actionType: 'CALENDAR', uiHint: 'calendar_picker' },
    ],
  },
  {
    id: '12',
    title: 'Finaliser la documentation technique',
    status: 'in_progress',
    dueDate: new Date().toISOString().split('T')[0],
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: new Date().toISOString(),
    quickActions: [
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '13',
    title: 'Préparer la présentation client pour la revue de sprint',
    status: 'todo',
    dueDate: (() => {
      const in3Days = new Date();
      in3Days.setDate(in3Days.getDate() + 3);
      return in3Days.toISOString().split('T')[0];
    })(),
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: new Date().toISOString(),
    quickActions: [
      { actionType: 'CALENDAR', uiHint: 'calendar_picker' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '14',
    title: 'Planifier la migration vers la nouvelle architecture',
    status: 'todo',
    dueDate: (() => {
      const in10Days = new Date();
      in10Days.setDate(in10Days.getDate() + 10);
      return in10Days.toISOString().split('T')[0];
    })(),
    projectName: 'Backend API',
    assigneeName: 'Julien',
    updatedAt: new Date().toISOString(),
    quickActions: [
      { actionType: 'SELECT', uiHint: 'dropdown_select', payload: { options: ['Migration progressive', 'Big bang', 'Par module', 'Par fonctionnalité'] } },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '15',
    title: 'Audit de sécurité de l\'application mobile',
    status: 'todo',
    dueDate: (() => {
      const in25Days = new Date();
      in25Days.setDate(in25Days.getDate() + 25);
      return in25Days.toISOString().split('T')[0];
    })(),
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: new Date().toISOString(),
    quickActions: [
      { actionType: 'WEATHER', uiHint: 'weather_picker', payload: { options: ['sunny', 'cloudy', 'storm'] } },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
  {
    id: '16',
    title: 'Explorer les nouvelles fonctionnalités React Native',
    status: 'todo',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: new Date().toISOString(),
    quickActions: [
      { actionType: 'CHECKBOX', uiHint: 'simple_checkbox' },
      { actionType: 'COMMENT', uiHint: 'comment_input' },
    ],
  },
];

function filterTasks(tasks: Task[], filters?: MyTasksFilters): Task[] {
  if (!filters?.status || filters.status === 'all') {
    return tasks;
  }
  return tasks.filter((task) => task.status === filters.status);
}

/**
 * Récupère les tâches de l'utilisateur avec pagination et filtres
 * 
 * @param filter - Filtre par statut ('all' | 'active' | 'completed')
 * @returns Promise<Task[]> Liste des tâches filtrées
 */
export async function getMyTasks(
  filter: 'all' | 'active' | 'completed' = 'all',
): Promise<Task[]> {
  await delay();
  
  let filteredTasks = MOCK_TASKS;
  
  // Appliquer le filtre
  if (filter === 'active') {
    filteredTasks = MOCK_TASKS.filter((t) => t.status === 'todo' || t.status === 'in_progress' || t.status === 'blocked');
  } else if (filter === 'completed') {
    filteredTasks = MOCK_TASKS.filter((t) => t.status === 'done');
  }
  
  // Normaliser toutes les tâches vers le type Task central
  return filteredTasks.map((rawTask) => normalizeTask(rawTask));
}

/**
 * Récupère une tâche par son ID
 * 
 * @param id - ID de la tâche
 * @returns Promise<Task | undefined> La tâche trouvée ou undefined
 */
export async function getTaskById(id: string): Promise<Task | undefined> {
  await delay();
  const rawTask = MOCK_TASKS.find((t) => t.id === id);
  if (!rawTask) {
    return undefined;
  }
  // Normaliser la tâche vers le type Task central
  return normalizeTask(rawTask);
}

/**
 * Met à jour le statut d'une tâche
 * 
 * @param id - ID de la tâche
 * @param status - Nouveau statut
 * @returns Promise<Task> La tâche mise à jour
 */
export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  await delay();
  const rawTask = MOCK_TASKS.find((t) => t.id === id);
  if (!rawTask) {
    throw new Error(`Task with id ${id} not found`);
  }
  rawTask.status = status;
  rawTask.updatedAt = new Date().toISOString();
  // Normaliser la tâche vers le type Task central
  return normalizeTask(rawTask);
}

/**
 * Récupère les tâches prioritaires (todo ou in_progress)
 * 
 * @returns Promise<Task[]> Liste des tâches prioritaires
 */
export async function getMyPriorities(): Promise<Task[]> {
  await delay();
  const rawTasks = MOCK_TASKS.filter((t) => t.status === 'todo' || t.status === 'in_progress').slice(0, 5);
  // Normaliser toutes les tâches vers le type Task central
  return rawTasks.map((rawTask) => normalizeTask(rawTask));
}

/**
 * Récupère les tâches dues bientôt (dans les 7 prochains jours)
 * 
 * @returns Promise<Task[]> Liste des tâches dues bientôt
 */
export async function getDueSoon(): Promise<Task[]> {
  await delay();
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const rawTasks = MOCK_TASKS.filter(
    (t) => t.dueDate && t.dueDate >= today && t.dueDate <= nextWeek && t.status !== 'done',
  ).slice(0, 5);
  // Normaliser toutes les tâches vers le type Task central
  return rawTasks.map((rawTask) => normalizeTask(rawTask));
}

/**
 * Récupère les tâches récemment mises à jour
 * 
 * @returns Promise<Task[]> Liste des tâches récemment mises à jour
 */
export async function getRecentlyUpdated(): Promise<Task[]> {
  await delay();
  const rawTasks = [...MOCK_TASKS]
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);
  // Normaliser toutes les tâches vers le type Task central
  return rawTasks.map((rawTask) => normalizeTask(rawTask));
}

/**
 * Récupère les tâches en retard
 * 
 * @returns Promise<Task[]> Liste des tâches en retard
 */
export async function getLate(): Promise<Task[]> {
  await delay();
  const today = new Date().toISOString().split('T')[0];
  const rawTasks = MOCK_TASKS.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(today) && t.status !== 'done',
  );
  // Normaliser toutes les tâches vers le type Task central
  return rawTasks.map((rawTask) => normalizeTask(rawTask));
}

/**
 * Capture rapide d'une tâche minimaliste (Quick Capture)
 * 
 * @param text - Texte de la tâche à capturer
 * @returns Promise<Task> La tâche créée
 */
export async function quickCapture(text: string): Promise<Task> {
  await delay();
  const newRawTask: RawTaskMock = {
    id: `qc-${Date.now()}`,
    title: text,
    status: 'todo',
    projectName: 'Inbox',
    updatedAt: new Date().toISOString(),
  };
  MOCK_TASKS.push(newRawTask);
  // Normaliser la tâche vers le type Task central
  return normalizeTask(newRawTask);
}

