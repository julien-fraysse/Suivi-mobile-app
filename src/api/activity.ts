/**
 * Activity API Adapter
 * 
 * Adaptateur API pour les activités récentes dans Suivi.
 * 
 * Rôle :
 * - Fournit une interface unifiée pour récupérer les activités récentes
 * - Abstraction entre les mocks (développement) et l'API Suivi réelle (production)
 * - Gère l'authentification et les paramètres de requête
 * 
 * Architecture backend Suivi (high-level) :
 * - Endpoint prévu : GET /api/v1/me/activity/recent
 * - Authentification : Bearer token dans header Authorization
 * - Paramètres de requête :
 *   - limit (optionnel) : nombre d'événements à retourner (défaut: 20)
 *   - workspaceId (optionnel) : filtrer par workspace
 *   - severity (optionnel) : filtrer par sévérité (INFO, IMPORTANT, CRITICAL)
 *   - source (optionnel) : filtrer par source (BOARD, PORTAL)
 * - Réponse : Array<SuiviActivityEvent> (JSON)
 * 
 * Migration vers le backend :
 * 1. Mettre USE_MOCK_API = false dans src/config/environment.ts
 * 2. Implémenter l'appel HTTP avec apiFetch() dans getRecentActivity()
 * 3. Adapter les paramètres de requête selon l'API Suivi réelle
 * 4. Gérer les erreurs et la pagination si nécessaire
 */

import { USE_MOCK_API } from '../config/environment';
import { apiFetch } from './client';
import { getMockRecentActivity } from '../mocks/data/activity';
import type { SuiviActivityEvent } from '../types/activity';

/**
 * Options pour récupérer les activités récentes
 */
export interface GetRecentActivityOptions {
  /** Nombre maximum d'événements à retourner (défaut: 20) */
  limit?: number;
  /** ID du workspace pour filtrer (optionnel) */
  workspaceId?: string;
  /** Sévérité pour filtrer (optionnel) */
  severity?: 'INFO' | 'IMPORTANT' | 'CRITICAL';
  /** Source pour filtrer (optionnel) */
  source?: 'BOARD' | 'PORTAL';
}

/**
 * Récupère les activités récentes de l'utilisateur
 * 
 * @param {string | null} accessToken - Token d'authentification (requis pour API réelle)
 * @param {GetRecentActivityOptions} options - Options de filtrage et pagination
 * @returns {Promise<SuiviActivityEvent[]>} Liste des événements d'activité récents
 * 
 * @example
 * ```typescript
 * const activities = await getRecentActivity(accessToken, { limit: 10 });
 * ```
 */
export async function getRecentActivity(
  accessToken?: string | null,
  options: GetRecentActivityOptions = {},
): Promise<SuiviActivityEvent[]> {
  // Mode mock : retourner les données mockées
  if (USE_MOCK_API) {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    let activities = getMockRecentActivity();
    
    // Appliquer les filtres mockés (pour simuler le comportement backend)
    if (options.workspaceId) {
      // Note: Dans les mocks, on filtre par workspaceName car on n'a pas d'ID
      // En production, le backend filtrera par workspaceId
      activities = activities.filter(
        (activity) => activity.workspaceName.toLowerCase().includes(options.workspaceId!.toLowerCase()),
      );
    }
    
    if (options.severity) {
      activities = activities.filter(
        (activity) => activity.severity === options.severity,
      );
    }
    
    if (options.source) {
      activities = activities.filter(
        (activity) => activity.source === options.source,
      );
    }
    
    // Appliquer la limite
    const limit = options.limit || 20;
    return activities.slice(0, limit);
  }

  // Mode production : appeler l'API Suivi réelle
  // TODO: Implémenter l'appel HTTP réel quand le backend sera prêt
  // 
  // Exemple d'implémentation future :
  // const params = new URLSearchParams();
  // if (options.limit) params.append('limit', options.limit.toString());
  // if (options.workspaceId) params.append('workspaceId', options.workspaceId);
  // if (options.severity) params.append('severity', options.severity);
  // if (options.source) params.append('source', options.source);
  // 
  // const path = `/api/v1/me/activity/recent?${params.toString()}`;
  // if (!accessToken) throw new Error('Access token required');
  // 
  // return apiFetch<SuiviActivityEvent[]>(path, {
  //   method: 'GET',
  // }, accessToken);

  // Pour l'instant, retourner les mocks même si USE_MOCK_API = false
  // (sera remplacé par l'implémentation ci-dessus)
  throw new Error('Real API implementation not yet available. Please use USE_MOCK_API = true.');
}

/**
 * Récupère les activités d'une tâche spécifique
 * 
 * @param {string} taskId - ID de la tâche
 * @param {string | null} accessToken - Token d'authentification (requis pour API réelle)
 * @returns {Promise<SuiviActivityEvent[]>} Liste des événements d'activité pour la tâche
 * 
 * @example
 * ```typescript
 * const activities = await getTaskActivity('task-101', accessToken);
 * ```
 */
export async function getTaskActivity(
  taskId: string,
  accessToken?: string | null,
): Promise<SuiviActivityEvent[]> {
  // Mode mock : retourner les données mockées filtrées par taskId
  if (USE_MOCK_API) {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Récupérer toutes les activités mockées
    let activities = getMockRecentActivity();
    
    // Filtrer les événements où taskInfo.taskId correspond à taskId
    const taskActivities = activities.filter(
      (activity) => activity.taskInfo?.taskId === taskId,
    );
    
    // Trier par createdAt DESC (plus récent en premier)
    const sortedActivities = taskActivities.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // DESC
    });
    
    return sortedActivities;
  }

  // Mode production : appeler l'API Suivi réelle
  // TODO: Implémenter l'appel HTTP réel quand le backend sera prêt
  // 
  // Exemple d'implémentation future :
  // const path = `/api/v1/tasks/${encodeURIComponent(taskId)}/activity`;
  // if (!accessToken) throw new Error('Access token required');
  // 
  // return apiFetch<SuiviActivityEvent[]>(path, {
  //   method: 'GET',
  // }, accessToken);

  // Pour l'instant, retourner un tableau vide si USE_MOCK_API = false
  // (sera remplacé par l'implémentation ci-dessus)
  throw new Error('Real API implementation not yet available. Please use USE_MOCK_API = true.');
}


