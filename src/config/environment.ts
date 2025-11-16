/**
 * Environment Configuration
 * 
 * Configuration des flags d'environnement pour l'application.
 * Utilisé pour contrôler le comportement de l'app (mock vs real API, etc.).
 */

/**
 * Flag pour utiliser les mocks API au lieu de la vraie API Suivi
 * 
 * - `true` : Utilise les mocks dans `src/mocks/data/*`
 * - `false` : Utilise la vraie API Suivi (à implémenter)
 * 
 * Pour migrer vers la vraie API :
 * 1. Implémenter les fonctions API réelles dans `src/api/*.ts`
 * 2. Mettre `USE_MOCK_API = false`
 * 3. Tester chaque endpoint individuellement
 */
export const USE_MOCK_API = true;


