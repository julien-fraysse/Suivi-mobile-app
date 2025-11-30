/**
 * Tasks Types
 * 
 * Types normalisés pour les tâches dans l'application Suivi.
 * Ces types correspondent à la structure attendue par l'API Suivi.
 * 
 * Utilise maintenant le type Task central depuis src/types/task.ts
 */

import type { Task, TaskStatus } from '../types/task';

/**
 * Task Filter
 * 
 * Filtres disponibles pour la liste des tâches.
 */
export type TaskFilter = 'all' | 'active' | 'completed';

// Ré-exporter Task et TaskStatus depuis le type central pour compatibilité
export type { Task, TaskStatus };

/**
 * Task Update Payload
 * 
 * Structure pour mettre à jour une tâche.
 * Utilisée par useUpdateTaskStatus et l'API Suivi.
 */
export interface TaskUpdatePayload {
  status?: TaskStatus;
  title?: string;
  description?: string;
  dueDate?: string;
  projectId?: string;
}

/**
 * Tasks Context Value
 * 
 * Interface du contexte TasksProvider.
 * Expose les données et méthodes pour manipuler les tâches.
 */
export interface TasksContextValue {
  /** Liste complète de toutes les tâches */
  tasks: Task[];
  
  /** Indicateur de chargement */
  isLoading: boolean;
  
  /** Erreur éventuelle */
  error: Error | null;
  
  /** Récupérer une tâche par son ID */
  getTaskById: (id: string) => Task | undefined;
  
  /** Récupérer une tâche par son ID (strict - retourne undefined si non trouvé) */
  getTaskByIdStrict: (id: string) => Task | undefined;
  
  /** Récupérer les tâches filtrées par statut */
  getTasksByStatus: (status: TaskStatus | 'all' | 'active' | 'completed') => Task[];
  
  /** Mettre à jour le statut d'une tâche */
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  
  /** Mettre à jour une tâche (champs partiels) */
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  
  /** Supprimer une tâche (mise à jour optimiste) */
  deleteTaskInContext: (id: string) => Promise<void>;
  
  /** Rafraîchir la liste des tâches */
  refreshTasks: () => Promise<void>;
}


