/**
 * Central Task Model
 * 
 * Modèle centralisé pour les tâches dans l'application Suivi.
 * Ce fichier définit le type Task standardisé qui sera utilisé progressivement
 * dans toute l'application pour remplacer les définitions dispersées.
 * 
 * TODO: Migration progressive des autres définitions Task vers ce modèle central.
 */

import type { SuiviActivityEvent } from './activity';

/**
 * Task Status
 * 
 * Statuts possibles pour une tâche dans le système Suivi.
 * Inclut 'cancelled' pour une future utilisation.
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked' | 'cancelled';

/**
 * Task Assignee
 * 
 * Représente l'utilisateur assigné à une tâche.
 */
export interface TaskAssignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Task Location
 * 
 * Localisation de la tâche (workspace et board).
 */
export interface TaskLocation {
  workspaceName: string;
  boardName: string;
}

/**
 * Suivi Tag
 * 
 * Tag associé à une tâche pour la catégorisation.
 */
export interface SuiviTag {
  id: string;
  name: string;
  color: string; // Couleur DS Suivi uniquement (tokens.colors.*)
}

/**
 * Task Quick Action
 * 
 * Action rapide associée à la tâche (commentaire, approbation, notation, etc.).
 */
export interface TaskQuickAction {
  type: string; // Plus de typage spécifique peut venir plus tard
  uiHint?: string;
  payload?: Record<string, unknown>;
}

/**
 * Custom Field
 * 
 * Champ personnalisé associé à une tâche.
 * Compatible avec le futur backend Suivi Desktop.
 */
export interface CustomField {
  /** Identifiant unique du champ personnalisé */
  id: string;
  
  /** Type de champ */
  type: 'text' | 'number' | 'date' | 'enum' | 'boolean' | 'multi';
  
  /** Label du champ (affiché à l'utilisateur) */
  label: string;
  
  /** Valeur actuelle du champ */
  value?: any;
  
  /** Options disponibles (pour type enum et multi) */
  options?: string[];
}

/**
 * Attachment
 * 
 * Pièce jointe associée à une tâche.
 */
export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'spreadsheet' | 'other';
  mime: string;
  url: string;
  size: number;
  createdAt: string;
}

/**
 * Task Interface
 * 
 * Représente une tâche dans l'application Suivi.
 * Structure normalisée compatible avec l'API Suivi et les mocks existants.
 */
export interface Task {
  /** Identifiant unique de la tâche */
  id: string;
  
  /** Titre de la tâche */
  title: string;
  
  /** Statut actuel de la tâche */
  status: TaskStatus;
  
  /** Date d'échéance (format ISO 8601: YYYY-MM-DD) */
  dueDate?: string;
  
  /** Localisation de la tâche (workspace et board) */
  location?: TaskLocation;
  
  /** Utilisateur assigné à la tâche */
  assignee?: TaskAssignee;
  
  /** Actions rapides associées à la tâche */
  quickActions?: TaskQuickAction[];
  
  /** Progression (0-100) pour les tâches avec suivi de progression */
  progress?: number | null;
  
  /** Conditions météo associées (pour les tâches terrain) */
  weather?: string | null;
  
  /** Note/évaluation (1-5) pour les tâches avec notation */
  rating?: number | null;
  
  /** Valeur sélectionnée pour les quick actions de type SELECT */
  selectValue?: string | null;
  
  /** Valeur de checkbox pour les quick actions de type CHECKBOX */
  checkboxValue?: boolean | null;
  
  /** Indicateur de lecture (pour les notifications/tâches) */
  isRead?: boolean;
  
  /** Nom du projet (optionnel, pour affichage) */
  projectName?: string;
  
  /** Description détaillée (optionnelle) */
  description?: string;
  
  /** Date de dernière mise à jour (format ISO 8601) */
  updatedAt?: string | null;
  
  /** Date de création (format ISO 8601, optionnelle) */
  createdAt?: string;
  
  /** Historique des activités et commentaires associés à la tâche */
  activities?: SuiviActivityEvent[];
  
  /** Priorité de la tâche */
  priority?: 'normal' | 'low' | 'high';
  
  /** Tags associés à la tâche (0-2 tags max) */
  tags?: SuiviTag[];
  
  /** Champs personnalisés (compatible API Suivi Desktop) */
  customFields?: CustomField[];
  
  /** Pièces jointes associées à la tâche */
  attachments?: Attachment[];
}

/**
 * Normalize Task
 * 
 * Fonction helper pour convertir un objet "raw" (backend ou mock) en Task normalisé.
 * 
 * Cette fonction est défensive et gère les variations de structure entre
 * les différentes sources de données (API, mocks, etc.).
 * 
 * @param raw - Objet brut à normaliser (peut être de n'importe quelle structure)
 * @returns Task normalisé
 */
export function normalizeTask(raw: unknown): Task {
  const r = raw as Record<string, unknown>;
  
  // Normaliser le statut avec fallback
  const normalizeStatus = (status: unknown): TaskStatus => {
    if (typeof status === 'string') {
      const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done', 'blocked', 'cancelled'];
      if (validStatuses.includes(status as TaskStatus)) {
        return status as TaskStatus;
      }
    }
    return 'todo'; // Fallback par défaut
  };
  
  // Normaliser la localisation
  const normalizeLocation = (): TaskLocation | undefined => {
    const workspaceName = (r.workspaceName as string) ?? (r.workspace as string) ?? '';
    const boardName = (r.boardName as string) ?? (r.board as string) ?? '';
    
    if (workspaceName || boardName) {
      return {
        workspaceName: workspaceName || '',
        boardName: boardName || '',
      };
    }
    return undefined;
  };
  
  // Normaliser l'assigné
  const normalizeAssignee = (): TaskAssignee | undefined => {
    // Cas 1: assignee est un objet avec id, name, avatarUrl
    if (r.assignee && typeof r.assignee === 'object') {
      const assignee = r.assignee as Record<string, unknown>;
      const id = String(assignee.id ?? r.assigneeId ?? '');
      const name = String(assignee.name ?? assignee.assigneeName ?? '');
      const avatarUrl = assignee.avatarUrl ?? assignee.avatar;
      
      if (id || name) {
        return {
          id: id || '',
          name: name || '',
          avatarUrl: typeof avatarUrl === 'string' ? avatarUrl : undefined,
        };
      }
    }
    
    // Cas 2: assigneeName existe directement
    if (r.assigneeName && typeof r.assigneeName === 'string') {
      return {
        id: String(r.assigneeId ?? ''),
        name: r.assigneeName,
        avatarUrl: undefined,
      };
    }
    
    return undefined;
  };
  
  // Normaliser les quickActions (support rétrocompatibilité : quickAction ou quickActions)
  const normalizeQuickActions = (): TaskQuickAction[] | undefined => {
    // Cas 1: quickActions est un tableau (nouveau format)
    if (Array.isArray(r.quickActions)) {
      return r.quickActions
        .filter((qa) => qa && typeof qa === 'object')
        .map((qa) => {
          const action = qa as Record<string, unknown>;
          return {
            type: String(action.type ?? action.actionType ?? ''),
            uiHint: typeof action.uiHint === 'string' ? action.uiHint : undefined,
            payload: typeof action.payload === 'object' && action.payload !== null 
              ? (action.payload as Record<string, unknown>)
              : undefined,
          };
        });
    }
    
    // Cas 2: quickAction est un objet unique (ancien format - rétrocompatibilité)
    if (r.quickAction !== null && r.quickAction !== undefined && typeof r.quickAction === 'object') {
      const qa = r.quickAction as Record<string, unknown>;
      const normalized = {
        type: String(qa.type ?? qa.actionType ?? ''),
        uiHint: typeof qa.uiHint === 'string' ? qa.uiHint : undefined,
        payload: typeof qa.payload === 'object' && qa.payload !== null 
          ? (qa.payload as Record<string, unknown>)
          : undefined,
      };
      // Retourner un tableau avec un seul élément si le type est valide
      if (normalized.type) {
        return [normalized];
      }
    }
    
    return undefined;
  };
  
  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? r.name ?? 'Untitled task'),
    status: normalizeStatus(r.status),
    dueDate: typeof r.dueDate === 'string' 
      ? r.dueDate 
      : typeof r.due_date === 'string' 
        ? r.due_date 
        : undefined,
    location: normalizeLocation(),
    assignee: normalizeAssignee(),
    quickActions: normalizeQuickActions(),
    progress: typeof r.progress === 'number' ? r.progress : r.progress === null ? null : undefined,
    weather: typeof r.weather === 'string' ? r.weather : r.weather === null ? null : undefined,
    rating: typeof r.rating === 'number' ? r.rating : r.rating === null ? null : undefined,
    selectValue: typeof r.selectValue === 'string' ? r.selectValue : r.selectValue === null ? null : undefined,
    checkboxValue: typeof r.checkboxValue === 'boolean' ? r.checkboxValue : r.checkboxValue === null ? null : undefined,
    isRead: typeof r.isRead === 'boolean' ? r.isRead : false,
    activities: Array.isArray(r.activities) ? r.activities : undefined,
    projectName: typeof r.projectName === 'string' ? r.projectName : undefined,
    description: typeof r.description === 'string' ? r.description : undefined,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : undefined,
    priority:
      r.priority === 'normal' ||
      r.priority === 'low' ||
      r.priority === 'high'
        ? (r.priority as 'normal' | 'low' | 'high')
        : undefined,
    tags: Array.isArray(r.tags)
      ? r.tags
          .filter((tag) => tag && typeof tag === 'object')
          .map((tag) => {
            const t = tag as Record<string, unknown>;
            return {
              id: String(t.id ?? ''),
              name: String(t.name ?? ''),
              color: String(t.color ?? ''),
            };
          })
      : undefined,
    customFields: Array.isArray(r.customFields)
      ? r.customFields
          .filter((cf) => cf && typeof cf === 'object')
          .map((cf) => {
            const field = cf as Record<string, unknown>;
            return {
              id: String(field.id ?? ''),
              type: String(field.type ?? 'text') as CustomField['type'],
              label: String(field.label ?? ''),
              value: field.value,
              options: Array.isArray(field.options)
                ? field.options.map((opt) => String(opt))
                : undefined,
            };
          })
      : undefined,
    attachments: Array.isArray(r.attachments) ? r.attachments : undefined,
  };
}

