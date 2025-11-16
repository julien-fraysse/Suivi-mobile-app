/**
 * Tasks Mock Data
 * 
 * Données mockées pour les tâches.
 * Stockage en mémoire simple pour le MVP.
 */

import type { Task, TaskStatus } from '../../api/tasks';

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

function filterTasks(tasks: Task[], filters?: { status?: TaskStatus | 'all' }): Task[] {
  if (!filters?.status || filters.status === 'all') {
    return tasks;
  }
  return tasks.filter((task) => task.status === filters.status);
}

export async function getTasks(params: {
  page?: number;
  pageSize?: number;
  filters?: { status?: TaskStatus | 'all' };
} = {}): Promise<{ items: Task[]; page: number; pageSize: number; total: number }> {
  await delay();
  const { page = 1, pageSize = 20, filters } = params;
  const filteredTasks = filterTasks(MOCK_TASKS, filters);
  const total = filteredTasks.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filteredTasks.slice(startIndex, endIndex);

  return { items, page, pageSize, total };
}

export async function getTaskById(taskId: string): Promise<Task> {
  await delay();
  const task = MOCK_TASKS.find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  return task;
}

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<Task> {
  await delay();
  const task = MOCK_TASKS.find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
  return { ...task };
}

export function getMyPriorities(): Task[] {
  return MOCK_TASKS.filter((t) => t.status === 'todo' || t.status === 'in_progress').slice(0, 5);
}

export function getDueSoon(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return MOCK_TASKS.filter(
    (t) => t.dueDate && t.dueDate >= today && t.dueDate <= nextWeek && t.status !== 'done',
  ).slice(0, 5);
}

export function getRecentlyUpdated(): Task[] {
  return [...MOCK_TASKS]
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);
}

export function getLate(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return MOCK_TASKS.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(today) && t.status !== 'done',
  );
}

export const mockTasks = MOCK_TASKS;

