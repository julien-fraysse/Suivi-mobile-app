/**
 * Environment Configuration
 * 
 * Configuration des flags d'environnement pour l'application.
 * Utilisé pour contrôler le comportement de l'app (mock vs real API, etc.).
 */

/**
 * @deprecated Utiliser API_MODE depuis src/config/apiMode.ts à la place
 * 
 * Flag pour utiliser les mocks API au lieu de la vraie API Suivi
 * 
 * - `true` : Utilise les mocks dans `src/mocks/data/*`
 * - `false` : Utilise la vraie API Suivi (à implémenter)
 * 
 * MIGRATION :
 * - Remplacer `USE_MOCK_API` par `API_MODE === 'mock'`
 * - Voir src/config/apiMode.ts pour la nouvelle configuration
 */
export const USE_MOCK_API = true; // Déprécié, utiliser API_MODE


