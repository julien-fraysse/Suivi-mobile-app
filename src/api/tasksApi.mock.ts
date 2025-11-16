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

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Implémenter le design system Suivi',
    status: 'in_progress',
    dueDate: '2024-11-20',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
    description: 'Créer un design system complet avec tokens, composants réutilisables et documentation. Inclure les polices Inter et IBM Plex Mono, les couleurs Suivi (violet, jaune, gris, sand), et les composants de base (buttons, cards, inputs, etc.).',
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
  {
    id: '9',
    title: 'Review design mockups',
    status: 'todo',
    dueDate: '2024-11-17',
    projectName: 'Design System',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
  },
  {
    id: '10',
    title: 'Setup CI/CD pipeline',
    status: 'todo',
    dueDate: '2024-11-23',
    projectName: 'Backend API',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:30:00Z',
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
  
  return [...filteredTasks];
}

/**
 * Récupère une tâche par son ID
 * 
 * @param id - ID de la tâche
 * @returns Promise<Task | undefined> La tâche trouvée ou undefined
 */
export async function getTaskById(id: string): Promise<Task | undefined> {
  await delay();
  return MOCK_TASKS.find((t) => t.id === id);
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
  const task = MOCK_TASKS.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  task.status = status;
  task.updatedAt = new Date().toISOString();
  return { ...task };
}

/**
 * Récupère les tâches prioritaires (todo ou in_progress)
 * 
 * @returns Promise<Task[]> Liste des tâches prioritaires
 */
export async function getMyPriorities(): Promise<Task[]> {
  await delay();
  return MOCK_TASKS.filter((t) => t.status === 'todo' || t.status === 'in_progress').slice(0, 5);
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
  return MOCK_TASKS.filter(
    (t) => t.dueDate && t.dueDate >= today && t.dueDate <= nextWeek && t.status !== 'done',
  ).slice(0, 5);
}

/**
 * Récupère les tâches récemment mises à jour
 * 
 * @returns Promise<Task[]> Liste des tâches récemment mises à jour
 */
export async function getRecentlyUpdated(): Promise<Task[]> {
  await delay();
  return [...MOCK_TASKS]
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);
}

/**
 * Récupère les tâches en retard
 * 
 * @returns Promise<Task[]> Liste des tâches en retard
 */
export async function getLate(): Promise<Task[]> {
  await delay();
  const today = new Date().toISOString().split('T')[0];
  return MOCK_TASKS.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(today) && t.status !== 'done',
  );
}

/**
 * Capture rapide d'une tâche minimaliste (Quick Capture)
 * 
 * @param text - Texte de la tâche à capturer
 * @returns Promise<Task> La tâche créée
 */
export async function quickCapture(text: string): Promise<Task> {
  await delay();
  const newTask: Task = {
    id: `qc-${Date.now()}`,
    title: text,
    status: 'todo',
    projectName: 'Inbox',
    updatedAt: new Date().toISOString(),
  };
  MOCK_TASKS.push(newTask);
  return newTask;
}

