/**
 * Search Selectors
 * 
 * Sélecteurs Zustand optimisés pour le store de recherche.
 * Utiliser ces sélecteurs pour éviter les re-renders inutiles.
 * 
 * RÈGLE : Toujours utiliser ces sélecteurs, jamais useSearchStore() directement.
 */

import { useSearchStore } from './searchStore';

// =============================================================================
// SÉLECTEURS ATOMIQUES
// =============================================================================

/**
 * Sélecteur pour la query de recherche
 * Re-render uniquement si query change
 */
export const useSearchQuery = () => useSearchStore((s) => s.query);

/**
 * Sélecteur pour les résultats de recherche
 * Re-render uniquement si results change
 */
export const useSearchResults = () => useSearchStore((s) => s.results);

/**
 * Sélecteur pour le statut de recherche
 * Re-render uniquement si status change
 */
export const useSearchStatus = () => useSearchStore((s) => s.status);

/**
 * Sélecteur pour le message d'erreur
 * Re-render uniquement si error change
 */
export const useSearchError = () => useSearchStore((s) => s.error);

// =============================================================================
// SÉLECTEURS D'ACTIONS
// =============================================================================

/**
 * Sélecteur pour l'action performSearch
 * Stable reference (pas de re-render)
 */
export const usePerformSearch = () => useSearchStore((s) => s.performSearch);

/**
 * Sélecteur pour l'action clearSearch
 * Stable reference (pas de re-render)
 */
export const useClearSearch = () => useSearchStore((s) => s.clearSearch);

/**
 * Sélecteur pour l'action setQuery
 * Stable reference (pas de re-render)
 */
export const useSetSearchQuery = () => useSearchStore((s) => s.setQuery);

// =============================================================================
// SÉLECTEURS DÉRIVÉS
// =============================================================================

/**
 * Sélecteur dérivé : est-ce qu'une recherche est en cours ?
 */
export const useIsSearching = () => useSearchStore((s) => s.status === 'loading');

/**
 * Sélecteur dérivé : y a-t-il des résultats ?
 */
export const useHasResults = () => useSearchStore((s) => s.results.length > 0);

/**
 * Sélecteur dérivé : y a-t-il une query de recherche active ?
 */
export const useHasSearchQuery = () => useSearchStore((s) => s.query.length > 0);

/**
 * Sélecteur dérivé : la recherche est-elle en erreur ?
 */
export const useIsSearchError = () => useSearchStore((s) => s.status === 'error');

/**
 * Sélecteur dérivé : la recherche est-elle terminée avec succès ?
 */
export const useIsSearchSuccess = () => useSearchStore((s) => s.status === 'success');



