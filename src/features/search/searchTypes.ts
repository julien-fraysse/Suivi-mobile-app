/**
 * Search Types
 * 
 * Types pour le moteur de recherche unifié Suivi.
 * Recherche dans les tâches, notifications et projets.
 * 
 * API-ready : ces types seront compatibles avec l'API réelle.
 */

/**
 * Type de résultat de recherche
 */
export type SearchResultType = 'task' | 'notification' | 'project';

/**
 * Résultat de recherche unifié
 * 
 * Structure commune pour tous les types de résultats.
 * Permet un affichage homogène dans l'UI.
 */
export type SearchResult = {
  /** ID unique du résultat (préfixé par le type) */
  id: string;
  /** Type de l'entité trouvée */
  type: SearchResultType;
  /** Titre principal affiché */
  title: string;
  /** Sous-titre ou contexte (optionnel) */
  subtitle?: string;
  /** ID de la tâche si type === 'task' */
  taskId?: string;
  /** ID de la notification si type === 'notification' */
  notificationId?: string;
  /** ID du projet si type === 'project' */
  projectId?: string;
};

/**
 * Statut de la recherche
 */
export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * État complet de la recherche
 */
export type SearchState = {
  /** Query de recherche actuelle */
  query: string;
  /** Résultats de recherche */
  results: SearchResult[];
  /** Statut de la recherche */
  status: SearchStatus;
  /** Message d'erreur si status === 'error' */
  error: string | null;
};



