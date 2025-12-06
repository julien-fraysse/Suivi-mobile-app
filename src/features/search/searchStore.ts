/**
 * Search Store
 * 
 * Store Zustand isolé pour la recherche unifiée.
 * Gère l'état de la recherche : query, results, status.
 * 
 * RÈGLE : Utiliser les sélecteurs (searchSelectors.ts) pour accéder au store.
 * Ne pas utiliser useSearchStore() sans sélecteur.
 */

import { create } from 'zustand';
import { search } from './searchService';
import type { SearchResult, SearchStatus } from './searchTypes';

/**
 * Interface du store de recherche
 */
interface SearchStoreState {
  /** Query de recherche actuelle */
  query: string;
  /** Résultats de recherche */
  results: SearchResult[];
  /** Statut de la recherche */
  status: SearchStatus;
  /** Message d'erreur */
  error: string | null;
  
  // Actions
  /** Met à jour la query (sans lancer de recherche) */
  setQuery: (query: string) => void;
  /** Lance une recherche */
  performSearch: (query: string) => Promise<void>;
  /** Efface la recherche et les résultats */
  clearSearch: () => void;
}

/**
 * Store Zustand pour la recherche
 * 
 * Usage avec sélecteurs (recommandé) :
 * ```typescript
 * import { useSearchQuery, useSearchResults } from '../features/search/searchSelectors';
 * 
 * const query = useSearchQuery();
 * const results = useSearchResults();
 * ```
 */
export const useSearchStore = create<SearchStoreState>((set) => ({
  query: '',
  results: [],
  status: 'idle',
  error: null,
  
  setQuery: (query: string) => set({ query }),
  
  performSearch: async (query: string) => {
    const trimmed = query.trim();
    
    // Si query vide, reset le state
    if (!trimmed) {
      set({ 
        query: '', 
        results: [], 
        status: 'idle', 
        error: null 
      });
      return;
    }
    
    // Lancer la recherche
    set({ query: trimmed, status: 'loading', error: null });
    
    try {
      const results = await search(trimmed);
      set({ results, status: 'success' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      set({ 
        results: [], 
        status: 'error', 
        error: errorMessage 
      });
    }
  },
  
  clearSearch: () => set({ 
    query: '', 
    results: [], 
    status: 'idle', 
    error: null 
  }),
}));



