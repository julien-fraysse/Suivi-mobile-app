/**
 * Suivi Data - Source Unique de Vérité pour les Données Mockées
 * 
 * Ce fichier centralise TOUTES les données mockées pour le MVP Suivi mobile :
 * - Tâches (avec Quick Actions)
 * - Notifications (liées aux tâches via relatedTaskId)
 * 
 * RÈGLE ABSOLUE :
 * - Les IDs des tâches sont des strings numériques : '1', '2', '3', etc.
 * - Les relatedTaskId des notifications DOIVENT correspondre EXACTEMENT aux IDs des tâches
 * - Aucune notification ne doit pointer vers une tâche inexistante
 * 
 * MIGRATION VERS API RÉELLE :
 * 1. Remplacer loadTasks() par GET /api/tasks
 * 2. Remplacer loadNotifications() par GET /api/notifications
 * 3. Les types et structures doivent rester identiques
 * 
 * @see docs/suiviData.md pour la documentation complète
 */

import type { Task, TaskStatus } from '../api/tasks';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Type de notification
 * 
 * Types de notifications orientées "sollicitations utilisateur" uniquement.
 * Les événements globaux (board_created, task_completed_by_someone_else, etc.)
 * sont exclus car ils apparaissent dans le flux Home, pas dans Notifications.
 */
export type NotificationType =
  | 'task_assigned'           // Nouvelle tâche assignée à moi
  | 'mention_in_comment'      // Mention dans un commentaire
  | 'comment'                 // Commentaire sur ma tâche
  | 'status_changed'          // Statut changé sur ma tâche
  | 'task_due_today'          // Tâche due aujourd'hui (si concerne l'utilisateur)
  | 'task_overdue';           // Tâche en retard (si concerne l'utilisateur)

/**
 * Notification Unifiée
 * 
 * Structure unifiée pour les notifications dans l'application Suivi.
 * Les notifications sont liées aux tâches via relatedTaskId qui DOIT
 * correspondre exactement à un ID de tâche dans TASKS.
 */
export type SuiviNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  relatedTaskId?: string | null; // ID de la tâche liée (pour navigation vers TaskDetail) - DOIT correspondre à un ID de TASKS
  projectId?: string; // ID du projet lié (pour navigation future)
  // Champs pour les actions humaines (createdBy, assignedBy, commentedBy, updatedBy, etc.)
  actor?: {
    id?: string;
    name?: string;
    avatar?: string;
    avatarUrl?: string; // Alias pour compatibilité
    imageUrl?: string; // Alias supplémentaire
  };
  // Alias pour compatibilité avec l'ancien format
  author?: {
    avatar?: string;
    avatarUrl?: string;
    name?: string;
  };
};

// ============================================================================
// TÂCHES (10 tâches avec Quick Actions)
// ============================================================================

/**
 * TASKS
 * 
 * Source unique de vérité pour les tâches mockées.
 * 
 * IMPORTANT :
 * - IDs : strings numériques '1', '2', '3', etc. (compatible API backend)
 * - Toutes les tâches ont une quickAction pour le MVP
 * - Les IDs doivent être cohérents avec les relatedTaskId des notifications
 */
export const TASKS: Task[] = [
  {
    id: '1',
    title: 'Répondre à un commentaire sur le design system',
    status: 'in_progress',
    dueDate: '2024-11-20',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:00:00Z',
    quickAction: {
      actionType: "COMMENT",
      uiHint: "comment_input",
    },
  },
  {
    id: '2',
    title: 'Approuver ou refuser la demande de composants UI',
    status: 'done',
    dueDate: '2024-11-15',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T16:30:00Z',
    quickAction: {
      actionType: "APPROVAL",
      uiHint: "approval_dual_button",
      payload: { requestId: "req_1" },
    },
  },
  {
    id: '3',
    title: 'Noter l\'intégration des polices Inter et IBM Plex Mono',
    status: 'done',
    dueDate: '2024-11-14',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-14T14:20:00Z',
    quickAction: {
      actionType: "RATING",
      uiHint: "stars_1_to_5",
    },
  },
  {
    id: '4',
    title: 'Marquer la progression de la configuration de navigation',
    status: 'todo',
    dueDate: '2024-11-21',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T08:00:00Z',
    quickAction: {
      actionType: "PROGRESS",
      uiHint: "stars_1_to_5",
      payload: { min: 0, max: 100 },
    },
  },
  {
    id: '5',
    title: 'Indiquer la météo pour la page de profil',
    status: 'todo',
    dueDate: '2024-11-22',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:00:00Z',
    quickAction: {
      actionType: "WEATHER",
      uiHint: "weather_picker",
      payload: { options: ["sunny", "cloudy", "storm"] },
    },
  },
  {
    id: '6',
    title: 'Définir l\'échéance pour l\'optimisation des performances',
    status: 'blocked',
    dueDate: '2024-11-25',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T11:00:00Z',
    quickAction: {
      actionType: "CALENDAR",
      uiHint: "calendar_picker",
    },
  },
  {
    id: '7',
    title: 'Cocher les étapes du système de notifications push',
    status: 'todo',
    dueDate: '2024-11-18',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T09:15:00Z',
    quickAction: {
      actionType: "CHECKBOX",
      uiHint: "simple_checkbox",
    },
  },
  {
    id: '8',
    title: 'Sélectionner le type de tests unitaires à créer',
    status: 'in_progress',
    dueDate: '2024-11-19',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T10:30:00Z',
    quickAction: {
      actionType: "SELECT",
      uiHint: "dropdown_select",
      payload: { options: ["Option A", "Option B", "Option C"] },
    },
  },
  {
    id: '9',
    title: 'Finaliser le planning trimestriel Q1 2025',
    status: 'in_progress',
    dueDate: '2024-11-20', // Aujourd'hui (pour test)
    projectName: 'Quarterly Planning',
    assigneeName: 'Julien',
    updatedAt: '2024-11-20T10:00:00Z',
    quickAction: {
      actionType: "CALENDAR",
      uiHint: "calendar_picker",
    },
  },
  {
    id: '10',
    title: 'Réviser la roadmap stratégique 2025',
    status: 'blocked',
    dueDate: '2024-11-10', // Date passée
    projectName: 'Roadmap 2025',
    assigneeName: 'Julien',
    updatedAt: '2024-11-15T10:00:00Z',
    quickAction: {
      actionType: "CALENDAR",
      uiHint: "calendar_picker",
    },
  },
];

// ============================================================================
// NOTIFICATIONS (liées aux tâches via relatedTaskId)
// ============================================================================

/**
 * NOTIFICATIONS
 * 
 * Source unique de vérité pour les notifications mockées.
 * 
 * RÈGLE CRITIQUE :
 * - relatedTaskId DOIT correspondre EXACTEMENT à un ID de TASKS ('1', '2', ..., '10')
 * - Plus jamais de format 'task-1', 'task-2', etc.
 * - Aucune notification ne doit pointer vers une tâche inexistante
 * - Chaque notification DOIT être cohérente avec la quickAction de la tâche cible
 * 
 * COHÉRENCE NOTIFICATION ↔ QUICKACTION :
 * - task_assigned → tâche avec quickAction COMMENT ou APPROVAL (action directe)
 * - comment → tâche avec quickAction COMMENT (action attendue)
 * - mention_in_comment → tâche avec quickAction COMMENT (action attendue)
 * - status_changed → n'importe quelle tâche (événement système)
 * - task_due_today → tâche avec dueDate = aujourd'hui
 * - task_overdue → tâche avec dueDate < aujourd'hui
 * 
 * Pour ajouter une nouvelle notification :
 * 1. Vérifier que la tâche existe dans TASKS
 * 2. Utiliser exactement le même ID : relatedTaskId: '1' (si la tâche a id: '1')
 * 3. Vérifier la cohérence avec la quickAction de la tâche
 */
export const NOTIFICATIONS: SuiviNotification[] = [
  // 1. Notif "assigned" → pointe vers une tâche avec quickAction COMMENT ou APPROVAL
  {
    id: 'notif-assigned-1',
    type: 'task_assigned',
    title: 'Nouvelle tâche assignée',
    message: 'Vous avez été assigné à "Approuver ou refuser la demande de composants UI"',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    relatedTaskId: '2', // ✅ Pointe vers TASKS[1] (id: '2') avec quickAction APPROVAL
    actor: {
      id: 'user-sarah',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/300?img=32',
    },
  },
  
  // 2. Notif "comment" → pointe vers une tâche avec quickAction COMMENT
  {
    id: 'notif-comment-1',
    type: 'comment',
    title: 'Nouveau commentaire',
    message: 'Alice a commenté sur "Répondre à un commentaire sur le design system"',
    read: false,
    createdAt: '2024-11-16T11:30:00Z',
    relatedTaskId: '1', // ✅ Pointe vers TASKS[0] (id: '1') avec quickAction COMMENT
    actor: {
      id: 'user-alice',
      name: 'Alice Dupont',
      avatarUrl: 'https://i.pravatar.cc/300?img=33',
    },
  },
  
  // 3. Notif "mention" → pointe vers une tâche avec quickAction COMMENT
  {
    id: 'notif-mention-1',
    type: 'mention_in_comment',
    title: 'Vous avez été mentionné',
    message: 'Sarah vous a mentionné dans un commentaire sur "Répondre à un commentaire sur le design system"',
    read: false,
    createdAt: '2024-11-16T09:15:00Z',
    relatedTaskId: '1', // ✅ Pointe vers TASKS[0] (id: '1') avec quickAction COMMENT
    actor: {
      id: 'user-sarah',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/300?img=32',
    },
  },
  
  // 4. Notif "status_changed" → pointe vers n'importe quelle tâche (événement système)
  {
    id: 'notif-status-1',
    type: 'status_changed',
    title: 'Statut modifié',
    message: 'Le statut de "Sélectionner le type de tests unitaires à créer" a été changé à "En cours"',
    read: true,
    createdAt: '2024-11-15T14:20:00Z',
    relatedTaskId: '8', // ✅ Pointe vers TASKS[7] (id: '8') avec quickAction SELECT
    actor: {
      id: 'user-admin',
      name: 'Admin Suivi',
      avatarUrl: 'https://i.pravatar.cc/300?img=34',
    },
  },
  
  // 5. Notif liée à une tâche avec quickAction RATING (notification task_assigned car demande d'action)
  {
    id: 'notif-rating-1',
    type: 'task_assigned',
    title: 'Demande d\'évaluation',
    message: 'On vous demande de noter "Noter l\'intégration des polices Inter et IBM Plex Mono"',
    read: false,
    createdAt: '2024-11-16T08:30:00Z',
    relatedTaskId: '3', // ✅ Pointe vers TASKS[2] (id: '3') avec quickAction RATING
    actor: {
      id: 'user-sarah',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/300?img=32',
    },
  },
  
  // 6. Notif liée à une tâche avec quickAction WEATHER
  {
    id: 'notif-weather-1',
    type: 'task_assigned',
    title: 'Nouvelle tâche assignée',
    message: 'Vous devez indiquer la météo pour "Indiquer la météo pour la page de profil"',
    read: false,
    createdAt: '2024-11-16T07:00:00Z',
    relatedTaskId: '5', // ✅ Pointe vers TASKS[4] (id: '5') avec quickAction WEATHER
    actor: {
      id: 'user-alice',
      name: 'Alice Dupont',
      avatarUrl: 'https://i.pravatar.cc/300?img=33',
    },
  },
  
  // 7. Notif "due today" → pointe vers la tâche ID '9' (dueDate = aujourd'hui)
  {
    id: 'notif-due-today',
    type: 'task_due_today',
    title: 'Tâche à rendre aujourd\'hui',
    message: '"Finaliser le planning trimestriel Q1 2025" arrive à échéance aujourd\'hui',
    read: false,
    createdAt: '2024-11-20T08:00:00Z',
    relatedTaskId: '9', // ✅ Pointe vers TASKS[8] (id: '9') avec dueDate = aujourd'hui
    // Pas d'actor car c'est un événement système (reminder)
  },
  
  // 8. Notif "overdue" → pointe vers la tâche ID '10' (dueDate = date passée)
  {
    id: 'notif-overdue',
    type: 'task_overdue',
    title: 'Tâche en retard',
    message: '"Réviser la roadmap stratégique 2025" est en retard',
    read: false,
    createdAt: '2024-11-16T08:00:00Z',
    relatedTaskId: '10', // ✅ Pointe vers TASKS[9] (id: '10') avec dueDate = date passée
    // Pas d'actor car c'est un événement système (overdue)
  },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Simule un délai réseau (pour rendre les mocks plus réalistes)
 */
function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// LOADERS
// ============================================================================

/**
 * loadTasks
 * 
 * Charge toutes les tâches mockées.
 * 
 * TODO: Remplacer par GET /api/tasks avec authentification
 * 
 * @returns Promise<Task[]> Liste de toutes les tâches
 */
export async function loadTasks(): Promise<Task[]> {
  await delay(300);
  // Retourner une copie pour éviter les mutations accidentelles
  return [...TASKS];
}

/**
 * loadNotifications
 * 
 * Charge toutes les notifications mockées.
 * 
 * TODO: Remplacer par GET /api/notifications avec authentification
 * 
 * @returns Promise<SuiviNotification[]> Liste de toutes les notifications
 */
export async function loadNotifications(): Promise<SuiviNotification[]> {
  await delay(150);
  // Retourner une copie pour éviter les mutations accidentelles
  return [...NOTIFICATIONS];
}

// ============================================================================
// VALIDATION (pour développement)
// ============================================================================

/**
 * Valide que toutes les notifications pointent vers des tâches existantes
 * et que chaque notification est cohérente avec la quickAction de sa tâche.
 * 
 * Cette fonction peut être appelée au démarrage pour détecter les incohérences.
 */
export function validateDataIntegrity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const taskIds = new Set(TASKS.map(task => task.id));
  const tasksMap = new Map(TASKS.map(task => [task.id, task]));

  for (const notification of NOTIFICATIONS) {
    // 1. Vérifier que relatedTaskId pointe vers une tâche existante
    if (notification.relatedTaskId && !taskIds.has(notification.relatedTaskId)) {
      errors.push(
        `Notification "${notification.id}" (${notification.title}) pointe vers une tâche inexistante: "${notification.relatedTaskId}"`
      );
      continue;
    }

    // 2. Vérifier la cohérence avec la quickAction de la tâche (si relatedTaskId existe)
    if (notification.relatedTaskId) {
      const task = tasksMap.get(notification.relatedTaskId);
      if (!task) {
        continue; // Déjà géré par l'erreur ci-dessus
      }

      // Cohérence selon le type de notification
      if (notification.type === 'comment' || notification.type === 'mention_in_comment') {
        // Les notifications de commentaire doivent pointer vers des tâches avec quickAction COMMENT
        if (task.quickAction?.actionType !== 'COMMENT') {
          errors.push(
            `Notification "${notification.id}" (type: ${notification.type}) pointe vers une tâche avec quickAction "${task.quickAction?.actionType}" au lieu de "COMMENT"`
          );
        }
      }
      // Les autres types (task_assigned, status_changed, task_due_today, task_overdue) peuvent pointer vers n'importe quelle tâche
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Exécuter la validation au chargement du module pour détecter les incohérences immédiatement
const validationResult = validateDataIntegrity();
if (!validationResult.valid) {
  console.warn('[suiviData.ts] Erreurs de validation détectées:', validationResult.errors);
}

