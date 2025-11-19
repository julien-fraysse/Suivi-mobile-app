/**
 * Tasks Types
 * 
 * Types normalisés pour les tâches dans l'application Suivi.
 * Ces types correspondent à la structure attendue par l'API Suivi.
 */

/**
 * Task Status
 * 
 * Statuts possibles pour une tâche dans le système Suivi.
 */
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

/**
 * Task Filter
 * 
 * Filtres disponibles pour la liste des tâches.
 */
export type TaskFilter = 'all' | 'active' | 'completed';

/**
 * Task Interface
 * 
 * Représente une tâche dans l'application Suivi.
 * Structure normalisée compatible avec l'API Suivi.
 */
export interface Task {
  /** Identifiant unique de la tâche */
  id: string;
  
  /** Titre de la tâche */
  title: string;
  
  /** Description détaillée (optionnelle) */
  description?: string;
  
  /** Statut actuel de la tâche */
  status: TaskStatus;
  
  /** Date d'échéance (format ISO 8601: YYYY-MM-DD) */
  dueDate?: string;
  
  /** Identifiant du projet (optionnel) */
  projectId?: string;
  
  /** Nom du projet (optionnel, pour affichage) */
  projectName?: string;
  
  /** Nom du workspace (optionnel, pour affichage du fil d'Ariane) */
  workspaceName?: string;
  
  /** Nom du board (optionnel, pour affichage du fil d'Ariane) */
  boardName?: string;
  
  /** Nom de l'assigné (optionnel) */
  assigneeName?: string;
  
  /** Initiales de l'assigné (optionnel) */
  assigneeInitials?: string;
  
  /** Date de création (format ISO 8601) */
  createdAt: string;
  
  /** Date de dernière mise à jour (format ISO 8601) */
  updatedAt: string;
}

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
  
  /** Récupérer les tâches filtrées par statut */
  getTasksByStatus: (status: TaskStatus | 'all' | 'active' | 'completed') => Task[];
  
  /** Mettre à jour le statut d'une tâche */
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  
  /** Rafraîchir la liste des tâches */
  refreshTasks: () => Promise<void>;
}


