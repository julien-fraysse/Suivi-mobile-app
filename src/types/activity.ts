/**
 * Activity Types
 * 
 * Types TypeScript pour les activités récentes dans Suivi.
 * 
 * Architecture fonctionnelle Suivi :
 * - Tenant → Workspaces → Boards (projets) → Vues
 * - Portails : construits à partir des boards
 * 
 * Les activités proviennent uniquement de :
 * - Boards (événements liés aux boards et leurs contenus)
 * - Portails (événements liés aux portails)
 */

/**
 * Source de l'activité
 * 
 * Indique si l'événement provient d'un Board ou d'un Portail.
 */
export type SuiviActivitySource = 'BOARD' | 'PORTAL';

/**
 * Type d'événement d'activité
 * 
 * Types d'événements couvrant :
 * - Tâches : création, complétion, replanification
 * - Objectifs : changement de statut (atteint, en retard, annulé)
 * - Boards : création, mise à jour, archivage
 * - Portails : création, mise à jour, partage
 */
export type SuiviActivityEventType =
  // Événements liés aux tâches
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_REPLANNED'
  // Événements liés aux objectifs
  | 'OBJECTIVE_STATUS_CHANGED'
  // Événements liés aux boards
  | 'BOARD_CREATED'
  | 'BOARD_UPDATED'
  | 'BOARD_ARCHIVED'
  // Événements liés aux portails
  | 'PORTAL_CREATED'
  | 'PORTAL_UPDATED'
  | 'PORTAL_SHARED';

/**
 * Sévérité de l'activité
 * 
 * Niveau d'importance de l'événement pour l'utilisateur.
 * - INFO : Information générale, pas d'action requise
 * - IMPORTANT : Événement significatif nécessitant attention
 * - CRITICAL : Événement critique nécessitant action immédiate
 */
export type SuiviActivitySeverity = 'INFO' | 'IMPORTANT' | 'CRITICAL';

/**
 * Acteur de l'activité
 * 
 * Utilisateur ou système ayant déclenché l'événement.
 */
export interface SuiviActivityActor {
  /** Nom complet de l'utilisateur */
  name: string;
  /** URL de l'avatar (optionnel) */
  avatarUrl?: string;
  /** ID de l'utilisateur (optionnel, pour navigation future) */
  userId?: string;
}

/**
 * Informations sur la tâche (pour événements TASK_*)
 */
export interface SuiviActivityTaskInfo {
  /** ID de la tâche */
  taskId: string;
  /** Titre de la tâche */
  taskTitle: string;
  /** Statut de la tâche (pour TASK_REPLANNED) */
  taskStatus?: string;
  /** Date d'échéance précédente (pour TASK_REPLANNED) */
  previousDueDate?: string;
  /** Nouvelle date d'échéance (pour TASK_REPLANNED) */
  newDueDate?: string;
}

/**
 * Informations sur l'objectif (pour OBJECTIVE_STATUS_CHANGED)
 */
export interface SuiviActivityObjectiveInfo {
  /** ID de l'objectif */
  objectiveId: string;
  /** Titre de l'objectif */
  objectiveTitle: string;
  /** Ancien statut */
  previousStatus: 'on_track' | 'at_risk' | 'behind' | 'achieved' | 'cancelled';
  /** Nouveau statut */
  newStatus: 'on_track' | 'at_risk' | 'behind' | 'achieved' | 'cancelled';
}

/**
 * Informations sur le board (pour événements BOARD_*)
 */
export interface SuiviActivityBoardInfo {
  /** ID du board */
  boardId: string;
  /** Nom du board */
  boardName: string;
  /** Description du board (pour BOARD_CREATED, BOARD_UPDATED) */
  boardDescription?: string;
}

/**
 * Informations sur le portail (pour événements PORTAL_*)
 */
export interface SuiviActivityPortalInfo {
  /** ID du portail */
  portalId: string;
  /** Nom du portail */
  portalName: string;
  /** Description du portail (pour PORTAL_CREATED, PORTAL_UPDATED) */
  portalDescription?: string;
  /** Nombre de boards inclus (pour PORTAL_CREATED) */
  boardsCount?: number;
  /** Utilisateur avec qui le portail a été partagé (pour PORTAL_SHARED) */
  sharedWith?: {
    name: string;
    email: string;
  };
}

/**
 * Événement d'activité Suivi
 * 
 * Structure complète d'un événement d'activité dans Suivi.
 * Contient toutes les informations nécessaires pour afficher et comprendre l'événement.
 */
export interface SuiviActivityEvent {
  /** Identifiant unique de l'événement */
  id: string;
  
  /** Source de l'événement (Board ou Portail) */
  source: SuiviActivitySource;
  
  /** Type d'événement */
  eventType: SuiviActivityEventType;
  
  /** Titre de l'événement (pour affichage) */
  title: string;
  
  /** Nom du workspace */
  workspaceName: string;
  
  /** Nom du board (optionnel, présent si source = BOARD ou si portail lié à un board) */
  boardName?: string;
  
  /** Nom du portail (optionnel, présent si source = PORTAL) */
  portalName?: string;
  
  /** Acteur ayant déclenché l'événement */
  actor: SuiviActivityActor;
  
  /** Date de création de l'événement (ISO 8601) */
  createdAt: string;
  
  /** Sévérité de l'événement */
  severity: SuiviActivitySeverity;
  
  /** Informations sur la tâche (si eventType commence par TASK_) */
  taskInfo?: SuiviActivityTaskInfo;
  
  /** Informations sur l'objectif (si eventType = OBJECTIVE_STATUS_CHANGED) */
  objectiveInfo?: SuiviActivityObjectiveInfo;
  
  /** Informations sur le board (si eventType commence par BOARD_) */
  boardInfo?: SuiviActivityBoardInfo;
  
  /** Informations sur le portail (si eventType commence par PORTAL_) */
  portalInfo?: SuiviActivityPortalInfo;
}


