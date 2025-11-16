/**
 * Quick Capture Mock Data
 * 
 * Données mockées pour la fonctionnalité Quick Capture (Inbox mobile).
 * Stockage en mémoire simple pour le MVP.
 * 
 * Note : Pas de persistance réelle pour l'instant, c'est du full mock.
 * Pour la migration vers l'API Suivi, voir `/src/api/quickCapture.ts`.
 */

import type { QuickCaptureItem } from '../../types/quickCapture';

/**
 * Stockage en mémoire des items Quick Capture
 * 
 * En production, ces données seront remplacées par des appels API
 * vers le backend Suivi.
 */
let MOCK_QUICK_CAPTURE_ITEMS: QuickCaptureItem[] = [
  {
    id: 'qc-1',
    title: 'Follow up with client about project timeline',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 jours ago
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Dans 5 jours
    status: 'inbox',
    source: 'mobile',
  },
  {
    id: 'qc-2',
    title: 'Review design mockups',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 jour ago
    dueDate: null,
    status: 'inbox',
    source: 'mobile',
  },
  {
    id: 'qc-3',
    title: 'Schedule team meeting',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 heures ago
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Dans 2 jours
    status: 'inbox',
    source: 'mobile',
  },
];

/**
 * Simule un délai réseau
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Récupère tous les items Quick Capture
 * 
 * @returns Promise<QuickCaptureItem[]> Liste des items Quick Capture
 */
export async function getQuickCaptureItems(): Promise<QuickCaptureItem[]> {
  await delay(Math.random() * 200 + 100); // Simulation délai réseau (100-300ms)
  return [...MOCK_QUICK_CAPTURE_ITEMS];
}

/**
 * Crée un nouvel item Quick Capture
 * 
 * @param payload Données de l'item à créer
 * @returns Promise<QuickCaptureItem> Item créé
 */
export async function createQuickCaptureItem(payload: {
  title: string;
  dueDate?: string | null;
}): Promise<QuickCaptureItem> {
  await delay(Math.random() * 200 + 100); // Simulation délai réseau

  const newItem: QuickCaptureItem = {
    id: `qc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: payload.title.trim(),
    createdAt: new Date().toISOString(),
    dueDate: payload.dueDate || null,
    status: 'inbox',
    source: 'mobile',
  };

  MOCK_QUICK_CAPTURE_ITEMS = [newItem, ...MOCK_QUICK_CAPTURE_ITEMS];
  return newItem;
}

/**
 * Vide l'inbox Quick Capture (supprime tous les items)
 * 
 * @returns Promise<void>
 */
export async function clearQuickCaptureInbox(): Promise<void> {
  await delay(Math.random() * 200 + 100); // Simulation délai réseau
  MOCK_QUICK_CAPTURE_ITEMS = [];
}

