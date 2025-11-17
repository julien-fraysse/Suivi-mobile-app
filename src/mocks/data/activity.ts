/**
 * Activity Mock Data
 * 
 * Données mockées pour les activités récentes dans Suivi.
 * 
 * Couvre :
 * - Plusieurs workspaces : IT / Cyber, PMO, Product / R&D, Marketing, HR, Ops
 * - Des boards variés dans chaque workspace
 * - Des portails variés
 * - Des severities mélangées (INFO, IMPORTANT, CRITICAL)
 * - Tous les types d'événements : TASK_*, OBJECTIVE_*, BOARD_*, PORTAL_*
 */

import type {
  SuiviActivityEvent,
  SuiviActivitySeverity,
} from '../../types/activity';

/**
 * Liste complète des événements d'activité mockés
 * 
 * 20 événements réalistes couvrant différents workspaces, boards, portails et severities.
 * Les dates sont récentes (derniers jours) pour simuler un fil d'activité actif.
 */
const MOCK_RECENT_ACTIVITY: SuiviActivityEvent[] = [
  // ===== ÉVÉNEMENTS TÂCHES (BOARD) =====
  {
    id: 'act-001',
    source: 'BOARD',
    eventType: 'TASK_COMPLETED',
    title: 'Tâche complétée : Audit de sécurité infrastructure',
    workspaceName: 'IT / Cyber',
    boardName: 'Sécurité Infrastructure',
    actor: {
      name: 'Sophie Martin',
      avatarUrl: undefined,
      userId: 'user-001',
    },
    createdAt: '2024-11-16T14:30:00Z',
    severity: 'INFO',
    taskInfo: {
      taskId: 'task-101',
      taskTitle: 'Audit de sécurité infrastructure',
    },
  },
  {
    id: 'act-002',
    source: 'BOARD',
    eventType: 'TASK_CREATED',
    title: 'Nouvelle tâche : Migration vers Kubernetes',
    workspaceName: 'IT / Cyber',
    boardName: 'DevOps & Infrastructure',
    actor: {
      name: 'Thomas Dubois',
      avatarUrl: undefined,
      userId: 'user-002',
    },
    createdAt: '2024-11-16T13:15:00Z',
    severity: 'IMPORTANT',
    taskInfo: {
      taskId: 'task-102',
      taskTitle: 'Migration vers Kubernetes',
    },
  },
  {
    id: 'act-003',
    source: 'BOARD',
    eventType: 'TASK_REPLANNED',
    title: 'Tâche replanifiée : Refonte UI Dashboard',
    workspaceName: 'Product / R&D',
    boardName: 'Q4 Product Roadmap',
    actor: {
      name: 'Emma Laurent',
      avatarUrl: undefined,
      userId: 'user-003',
    },
    createdAt: '2024-11-16T12:00:00Z',
    severity: 'IMPORTANT',
    taskInfo: {
      taskId: 'task-103',
      taskTitle: 'Refonte UI Dashboard',
      taskStatus: 'in_progress',
      previousDueDate: '2024-11-20',
      newDueDate: '2024-11-25',
    },
  },
  {
    id: 'act-004',
    source: 'BOARD',
    eventType: 'TASK_COMPLETED',
    title: 'Tâche complétée : Analyse concurrentielle marché mobile',
    workspaceName: 'Marketing',
    boardName: 'Stratégie Q4 2024',
    actor: {
      name: 'Lucas Bernard',
      avatarUrl: undefined,
      userId: 'user-004',
    },
    createdAt: '2024-11-16T11:45:00Z',
    severity: 'INFO',
    taskInfo: {
      taskId: 'task-104',
      taskTitle: 'Analyse concurrentielle marché mobile',
    },
  },
  {
    id: 'act-005',
    source: 'BOARD',
    eventType: 'TASK_CREATED',
    title: 'Nouvelle tâche : Correction bug critique authentification',
    workspaceName: 'Product / R&D',
    boardName: 'Bugs & Corrections',
    actor: {
      name: 'Julien Fraysse',
      avatarUrl: undefined,
      userId: 'user-005',
    },
    createdAt: '2024-11-16T10:20:00Z',
    severity: 'CRITICAL',
    taskInfo: {
      taskId: 'task-105',
      taskTitle: 'Correction bug critique authentification',
    },
  },

  // ===== ÉVÉNEMENTS OBJECTIFS (BOARD) =====
  {
    id: 'act-006',
    source: 'BOARD',
    eventType: 'OBJECTIVE_STATUS_CHANGED',
    title: 'Objectif en retard : Lancement campagne Q4',
    workspaceName: 'Marketing',
    boardName: 'Objectifs Marketing 2024',
    actor: {
      name: 'Lucas Bernard',
      avatarUrl: undefined,
      userId: 'user-004',
    },
    createdAt: '2024-11-16T09:30:00Z',
    severity: 'CRITICAL',
    objectiveInfo: {
      objectiveId: 'obj-201',
      objectiveTitle: 'Lancement campagne Q4',
      previousStatus: 'at_risk',
      newStatus: 'behind',
    },
  },
  {
    id: 'act-007',
    source: 'BOARD',
    eventType: 'OBJECTIVE_STATUS_CHANGED',
    title: 'Objectif atteint : Recrutement 5 développeurs',
    workspaceName: 'HR',
    boardName: 'Recrutement 2024',
    actor: {
      name: 'Marie Dubois',
      avatarUrl: undefined,
      userId: 'user-006',
    },
    createdAt: '2024-11-16T08:15:00Z',
    severity: 'IMPORTANT',
    objectiveInfo: {
      objectiveId: 'obj-202',
      objectiveTitle: 'Recrutement 5 développeurs',
      previousStatus: 'on_track',
      newStatus: 'achieved',
    },
  },
  {
    id: 'act-008',
    source: 'BOARD',
    eventType: 'OBJECTIVE_STATUS_CHANGED',
    title: 'Objectif annulé : Migration datacenter',
    workspaceName: 'Ops',
    boardName: 'Infrastructure 2024',
    actor: {
      name: 'Pierre Moreau',
      avatarUrl: undefined,
      userId: 'user-007',
    },
    createdAt: '2024-11-15T17:00:00Z',
    severity: 'INFO',
    objectiveInfo: {
      objectiveId: 'obj-203',
      objectiveTitle: 'Migration datacenter',
      previousStatus: 'at_risk',
      newStatus: 'cancelled',
    },
  },

  // ===== ÉVÉNEMENTS BOARDS =====
  {
    id: 'act-009',
    source: 'BOARD',
    eventType: 'BOARD_CREATED',
    title: 'Nouveau board créé : Mobile App v2.0',
    workspaceName: 'Product / R&D',
    boardName: 'Mobile App v2.0',
    actor: {
      name: 'Emma Laurent',
      avatarUrl: undefined,
      userId: 'user-003',
    },
    createdAt: '2024-11-15T16:00:00Z',
    severity: 'IMPORTANT',
    boardInfo: {
      boardId: 'board-301',
      boardName: 'Mobile App v2.0',
      boardDescription: 'Refonte complète de l\'application mobile avec nouvelles fonctionnalités',
    },
  },
  {
    id: 'act-010',
    source: 'BOARD',
    eventType: 'BOARD_UPDATED',
    title: 'Board mis à jour : Sécurité Infrastructure',
    workspaceName: 'IT / Cyber',
    boardName: 'Sécurité Infrastructure',
    actor: {
      name: 'Sophie Martin',
      avatarUrl: undefined,
      userId: 'user-001',
    },
    createdAt: '2024-11-15T15:30:00Z',
    severity: 'INFO',
    boardInfo: {
      boardId: 'board-302',
      boardName: 'Sécurité Infrastructure',
      boardDescription: 'Mise à jour des règles de sécurité et des procédures',
    },
  },
  {
    id: 'act-011',
    source: 'BOARD',
    eventType: 'BOARD_ARCHIVED',
    title: 'Board archivé : Projet Legacy 2023',
    workspaceName: 'PMO',
    boardName: 'Projet Legacy 2023',
    actor: {
      name: 'Alexandre Petit',
      avatarUrl: undefined,
      userId: 'user-008',
    },
    createdAt: '2024-11-15T14:00:00Z',
    severity: 'INFO',
    boardInfo: {
      boardId: 'board-303',
      boardName: 'Projet Legacy 2023',
    },
  },
  {
    id: 'act-012',
    source: 'BOARD',
    eventType: 'BOARD_CREATED',
    title: 'Nouveau board créé : Formation équipe DevOps',
    workspaceName: 'HR',
    boardName: 'Formation équipe DevOps',
    actor: {
      name: 'Marie Dubois',
      avatarUrl: undefined,
      userId: 'user-006',
    },
    createdAt: '2024-11-15T13:20:00Z',
    severity: 'INFO',
    boardInfo: {
      boardId: 'board-304',
      boardName: 'Formation équipe DevOps',
      boardDescription: 'Programme de formation pour monter en compétences DevOps',
    },
  },

  // ===== ÉVÉNEMENTS PORTALS =====
  {
    id: 'act-013',
    source: 'PORTAL',
    eventType: 'PORTAL_CREATED',
    title: 'Nouveau portail créé : Vue Exécutive Q4',
    workspaceName: 'PMO',
    portalName: 'Vue Exécutive Q4',
    actor: {
      name: 'Alexandre Petit',
      avatarUrl: undefined,
      userId: 'user-008',
    },
    createdAt: '2024-11-15T12:00:00Z',
    severity: 'IMPORTANT',
    portalInfo: {
      portalId: 'portal-401',
      portalName: 'Vue Exécutive Q4',
      portalDescription: 'Vue consolidée de tous les projets Q4 pour la direction',
      boardsCount: 8,
    },
  },
  {
    id: 'act-014',
    source: 'PORTAL',
    eventType: 'PORTAL_SHARED',
    title: 'Portail partagé : Dashboard IT Security',
    workspaceName: 'IT / Cyber',
    portalName: 'Dashboard IT Security',
    actor: {
      name: 'Sophie Martin',
      avatarUrl: undefined,
      userId: 'user-001',
    },
    createdAt: '2024-11-15T11:30:00Z',
    severity: 'IMPORTANT',
    portalInfo: {
      portalId: 'portal-402',
      portalName: 'Dashboard IT Security',
      sharedWith: {
        name: 'Directeur Technique',
        email: 'directeur.tech@suivi.app',
      },
    },
  },
  {
    id: 'act-015',
    source: 'PORTAL',
    eventType: 'PORTAL_UPDATED',
    title: 'Portail mis à jour : Roadmap Produit 2025',
    workspaceName: 'Product / R&D',
    portalName: 'Roadmap Produit 2025',
    actor: {
      name: 'Emma Laurent',
      avatarUrl: undefined,
      userId: 'user-003',
    },
    createdAt: '2024-11-15T10:15:00Z',
    severity: 'INFO',
    portalInfo: {
      portalId: 'portal-403',
      portalName: 'Roadmap Produit 2025',
      portalDescription: 'Mise à jour avec les nouveaux objectifs Q1 2025',
    },
  },
  {
    id: 'act-016',
    source: 'PORTAL',
    eventType: 'PORTAL_CREATED',
    title: 'Nouveau portail créé : Reporting Marketing',
    workspaceName: 'Marketing',
    portalName: 'Reporting Marketing',
    actor: {
      name: 'Lucas Bernard',
      avatarUrl: undefined,
      userId: 'user-004',
    },
    createdAt: '2024-11-15T09:00:00Z',
    severity: 'INFO',
    portalInfo: {
      portalId: 'portal-404',
      portalName: 'Reporting Marketing',
      portalDescription: 'Vue consolidée des KPIs marketing',
      boardsCount: 5,
    },
  },
  {
    id: 'act-017',
    source: 'PORTAL',
    eventType: 'PORTAL_SHARED',
    title: 'Portail partagé : Vue RH Management',
    workspaceName: 'HR',
    portalName: 'Vue RH Management',
    actor: {
      name: 'Marie Dubois',
      avatarUrl: undefined,
      userId: 'user-006',
    },
    createdAt: '2024-11-14T17:30:00Z',
    severity: 'INFO',
    portalInfo: {
      portalId: 'portal-405',
      portalName: 'Vue RH Management',
      sharedWith: {
        name: 'DRH',
        email: 'drh@suivi.app',
      },
    },
  },

  // ===== ÉVÉNEMENTS TÂCHES SUPPLÉMENTAIRES =====
  {
    id: 'act-018',
    source: 'BOARD',
    eventType: 'TASK_COMPLETED',
    title: 'Tâche complétée : Mise en place monitoring infrastructure',
    workspaceName: 'Ops',
    boardName: 'Monitoring & Observability',
    actor: {
      name: 'Pierre Moreau',
      avatarUrl: undefined,
      userId: 'user-007',
    },
    createdAt: '2024-11-14T16:00:00Z',
    severity: 'INFO',
    taskInfo: {
      taskId: 'task-106',
      taskTitle: 'Mise en place monitoring infrastructure',
    },
  },
  {
    id: 'act-019',
    source: 'BOARD',
    eventType: 'TASK_REPLANNED',
    title: 'Tâche replanifiée : Audit conformité RGPD',
    workspaceName: 'IT / Cyber',
    boardName: 'Conformité & Audit',
    actor: {
      name: 'Sophie Martin',
      avatarUrl: undefined,
      userId: 'user-001',
    },
    createdAt: '2024-11-14T15:20:00Z',
    severity: 'CRITICAL',
    taskInfo: {
      taskId: 'task-107',
      taskTitle: 'Audit conformité RGPD',
      taskStatus: 'in_progress',
      previousDueDate: '2024-11-18',
      newDueDate: '2024-11-22',
    },
  },
  {
    id: 'act-020',
    source: 'BOARD',
    eventType: 'TASK_CREATED',
    title: 'Nouvelle tâche : Préparation budget 2025',
    workspaceName: 'PMO',
    boardName: 'Planification 2025',
    actor: {
      name: 'Alexandre Petit',
      avatarUrl: undefined,
      userId: 'user-008',
    },
    createdAt: '2024-11-14T14:00:00Z',
    severity: 'IMPORTANT',
    taskInfo: {
      taskId: 'task-108',
      taskTitle: 'Préparation budget 2025',
    },
  },
];

/**
 * Récupère la liste complète des activités récentes mockées
 * 
 * @returns {SuiviActivityEvent[]} Liste de tous les événements d'activité mockés
 */
export function getMockRecentActivity(): SuiviActivityEvent[] {
  // Retourner une copie pour éviter les mutations
  return [...MOCK_RECENT_ACTIVITY];
}

/**
 * Récupère les activités récentes avec une limite
 * 
 * @param {number} limit - Nombre maximum d'événements à retourner (par défaut: 10)
 * @returns {SuiviActivityEvent[]} Liste limitée des événements les plus récents
 */
export function getMockRecentActivityLimited(limit: number = 10): SuiviActivityEvent[] {
  // Les événements sont déjà triés par date décroissante (plus récent en premier)
  return MOCK_RECENT_ACTIVITY.slice(0, limit);
}

/**
 * Récupère les activités filtrées par workspace
 * 
 * @param {string} workspaceName - Nom du workspace
 * @returns {SuiviActivityEvent[]} Liste des événements du workspace
 */
export function getMockActivityByWorkspace(workspaceName: string): SuiviActivityEvent[] {
  return MOCK_RECENT_ACTIVITY.filter(
    (activity) => activity.workspaceName === workspaceName,
  );
}

/**
 * Récupère les activités filtrées par sévérité
 * 
 * @param {SuiviActivitySeverity} severity - Sévérité à filtrer
 * @returns {SuiviActivityEvent[]} Liste des événements avec la sévérité
 */
export function getMockActivityBySeverity(severity: SuiviActivitySeverity): SuiviActivityEvent[] {
  return MOCK_RECENT_ACTIVITY.filter(
    (activity) => activity.severity === severity,
  );
}

/**
 * Export de la liste complète pour compatibilité avec l'ancien système
 * @deprecated Utiliser getMockRecentActivity() à la place
 */
export const mockActivity = MOCK_RECENT_ACTIVITY;
