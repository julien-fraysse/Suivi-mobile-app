/**
 * Suivi Mobile API Service
 * 
 * Module API unique qui wrappe les appels de données pour toute l'application.
 * 
 * PHASE 3 (ACTUELLE) : Utilise les mocks depuis `/src/mocks/suiviMock.ts`
 * 
 * POUR MIGRER VERS LES VRAIES API :
 * 
 * 1. Remplacez les imports ci-dessous par les vraies fonctions API :
 *    ```typescript
 *    // Avant (mocks)
 *    import * as mock from '../mocks/suiviMock';
 *    
 *    // Après (vraies API)
 *    import { getMyTasks, getTaskById } from '../api/tasks';
 *    import { apiFetch } from '../api/client';
 *    // ... autres imports API
 *    ```
 * 
 * 2. Adaptez les signatures des fonctions pour correspondre aux vraies API :
 *    - Ajoutez `accessToken` si nécessaire
 *    - Ajustez les paramètres si les vraies API sont différentes
 *    - Adaptez les types de retour si nécessaire
 * 
 * 3. Remplacez les implémentations :
 *    ```typescript
 *    // Avant (mocks)
 *    export const api = {
 *      getTasks: mock.getTasks,
 *      // ...
 *    };
 *    
 *    // Après (vraies API)
 *    export const api = {
 *      getTasks: async (params, accessToken) => {
 *        return getMyTasks(accessToken, params);
 *      },
 *      // ...
 *    };
 *    ```
 * 
 * 4. Mettez à jour les hooks dans `/src/hooks/useSuiviQuery.ts` si nécessaire
 *    pour passer `accessToken` aux fonctions API.
 * 
 * 5. Testez chaque endpoint individuellement avant de tout migrer.
 * 
 * NOTE : Les types doivent rester compatibles avec les mocks pour éviter
 * de casser les écrans existants.
 * 
 * @see /src/mocks/suiviMock.ts pour la structure des données mockées
 * @see /src/hooks/useSuiviQuery.ts pour l'utilisation de ces fonctions
 */

import * as mock from '../mocks/suiviMock';
import * as quickCaptureMock from '../mocks/data/quickCapture';
import type {
  Task,
  TaskStatus,
} from '../api/tasks';
import type {
  Project,
  Notification,
  User,
  QuickStats,
  ActivityItem,
  MyTasksPage,
} from '../mocks/suiviMock';
import type {
  QuickCaptureItem,
  CreateQuickCapturePayload,
} from '../types/quickCapture';

/**
 * Paramètres pour getTasks
 */
export type GetTasksParams = {
  page?: number;
  pageSize?: number;
  filters?: {
    status?: TaskStatus | 'all';
  };
};

/**
 * API Service Interface
 * 
 * Toutes les fonctions retournent des Promises et peuvent être remplacées
 * par les vraies implémentations API sans changer les signatures publiques.
 */
export const api = {
  /**
   * Récupère les tâches de l'utilisateur avec pagination et filtres
   * 
   * TODO: Remplacer par getMyTasks(accessToken, params) depuis '../api/tasks'
   */
  getTasks: async (
    params: GetTasksParams = {},
    _accessToken?: string | null,
  ): Promise<MyTasksPage> => {
    // PHASE 3: Utilise les mocks
    return mock.getTasks(params);
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getMyTasks(_accessToken, params);
  },

  /**
   * Récupère une tâche par ID
   * 
   * TODO: Remplacer par getTaskById(accessToken, taskId) depuis '../api/tasks'
   */
  getTaskById: async (
    taskId: string,
    _accessToken?: string | null,
  ): Promise<Task> => {
    // PHASE 3: Utilise les mocks
    return mock.getTaskById(taskId);
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getTaskById(_accessToken, taskId);
  },

  /**
   * Récupère tous les projets
   * 
   * TODO: Créer getProjects(accessToken) dans '../api/projects.ts'
   */
  getProjects: async (_accessToken?: string | null): Promise<Project[]> => {
    // PHASE 3: Utilise les mocks
    return mock.getProjects();
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getProjects(_accessToken);
  },

  /**
   * Récupère toutes les notifications
   * 
   * TODO: Créer getNotifications(accessToken) dans '../api/notifications.ts'
   */
  getNotifications: async (_accessToken?: string | null): Promise<Notification[]> => {
    // PHASE 3: Utilise les mocks
    return mock.getNotifications();
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getNotifications(_accessToken);
  },

  /**
   * Récupère l'utilisateur actuel
   * 
   * TODO: Créer getMe(accessToken) dans '../api/auth.ts' ou '../api/users.ts'
   */
  getUser: async (_accessToken?: string | null): Promise<User> => {
    // PHASE 3: Utilise les mocks
    return mock.getUser();
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getMe(_accessToken);
  },

  /**
   * Récupère les statistiques rapides
   * 
   * TODO: Créer getQuickStats(accessToken) dans '../api/stats.ts'
   */
  getQuickStats: async (_accessToken?: string | null): Promise<QuickStats> => {
    // PHASE 3: Utilise les mocks
    return mock.getQuickStats();
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getQuickStats(_accessToken);
  },

  /**
   * Récupère le fil d'activité
   * 
   * TODO: Créer getActivityFeed(accessToken, limit) dans '../api/activity.ts'
   */
  getActivityFeed: async (
    limit: number = 10,
    _accessToken?: string | null,
  ): Promise<ActivityItem[]> => {
    // PHASE 3: Utilise les mocks
    return mock.getActivityFeed(limit);
    
    // TODO: Migration vers vraie API
    // if (!_accessToken) throw new Error('No access token');
    // return getActivityFeed(_accessToken, limit);
  },

  // ============================================================================
  // QUICK CAPTURE (Inbox mobile)
  // ============================================================================

  /**
   * Récupère tous les items Quick Capture de l'inbox mobile
   * 
   * TODO: Remplacer par getQuickCaptureItems(accessToken) depuis '../api/quickCapture.ts'
   */
  getQuickCaptureItems: async (_accessToken?: string | null): Promise<QuickCaptureItem[]> => {
    // ACTUELLEMENT: Utilise les mocks
    return quickCaptureMock.getQuickCaptureItems();
    
    // TODO: Migration vers vraie API Suivi
    // if (!_accessToken) throw new Error('No access token');
    // return getQuickCaptureItems(_accessToken);
  },

  /**
   * Crée un nouvel item Quick Capture dans l'inbox mobile
   * 
   * TODO: Remplacer par createQuickCaptureItem(accessToken, payload) depuis '../api/quickCapture.ts'
   */
  createQuickCaptureItem: async (
    payload: CreateQuickCapturePayload,
    _accessToken?: string | null,
  ): Promise<QuickCaptureItem> => {
    // ACTUELLEMENT: Utilise les mocks
    return quickCaptureMock.createQuickCaptureItem(payload);
    
    // TODO: Migration vers vraie API Suivi
    // if (!_accessToken) throw new Error('No access token');
    // return createQuickCaptureItem(_accessToken, payload);
  },

  /**
   * Vide l'inbox Quick Capture (supprime tous les items)
   * 
   * TODO: Remplacer par clearQuickCaptureInbox(accessToken) depuis '../api/quickCapture.ts'
   */
  clearQuickCaptureInbox: async (_accessToken?: string | null): Promise<void> => {
    // ACTUELLEMENT: Utilise les mocks
    return quickCaptureMock.clearQuickCaptureInbox();
    
    // TODO: Migration vers vraie API Suivi
    // if (!_accessToken) throw new Error('No access token');
    // return clearQuickCaptureInbox(_accessToken);
  },
};

export default api;

