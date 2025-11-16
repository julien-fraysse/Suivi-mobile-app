/**
 * Quick Capture API Adapter
 * 
 * Adapter API pour la fonctionnalité "Quick Capture" (Inbox mobile).
 * 
 * PHASE ACTUELLE : Utilise les mocks depuis `/src/mocks/data/quickCapture.ts`
 * 
 * POUR MIGRER VERS L'API SUIVI RÉELLE :
 * 
 * 1. Remplacez les imports ci-dessous par les vraies fonctions API :
 *    ```typescript
 *    // Avant (mocks)
 *    import * as mock from '../mocks/data/quickCapture';
 *    
 *    // Après (vraies API)
 *    import { apiFetch } from './client';
 *    // TODO: Endpoint Suivi pour Quick Capture
 *    const QUICK_CAPTURE_ENDPOINT = '/api/mobile/quick-capture';
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
 *    export async function getQuickCaptureItems(): Promise<QuickCaptureItem[]> {
 *      return mock.getQuickCaptureItems();
 *    }
 *    
 *    // Après (vraies API)
 *    export async function getQuickCaptureItems(
 *      accessToken: string
 *    ): Promise<QuickCaptureItem[]> {
 *      return apiFetch<QuickCaptureItem[]>(
 *        `${QUICK_CAPTURE_ENDPOINT}/items`,
 *        {},
 *        accessToken
 *      );
 *    }
 *    ```
 * 
 * 4. Mettez à jour les hooks dans `/src/hooks/useSuiviQuery.ts` pour passer
 *    `accessToken` aux fonctions API.
 * 
 * NOTE IMPORTANTE :
 * - Les Quick Capture sont SÉPARÉS des Task (src/api/tasks.ts)
 * - Les Quick Capture seront convertis en tâches Suivi complètes côté desktop
 * - Structure actuelle mockée, prête à être remplacée par l'API Suivi
 * 
 * @see /src/services/api.ts pour la migration globale
 * @see /docs/mobile/api-contract.md pour les contrats d'API
 */

import * as mock from '../mocks/data/quickCapture';
import type { QuickCaptureItem, CreateQuickCapturePayload } from '../types/quickCapture';

/**
 * Récupère tous les items Quick Capture de l'inbox mobile
 * 
 * @returns Promise<QuickCaptureItem[]> Liste des items Quick Capture
 * 
 * TODO API Suivi :
 * - Endpoint : GET /api/mobile/quick-capture/items
 * - Headers : Authorization Bearer {accessToken}
 * - Response : { items: QuickCaptureItem[] }
 */
export async function getQuickCaptureItems(): Promise<QuickCaptureItem[]> {
  // ACTUELLEMENT : Mock
  return mock.getQuickCaptureItems();
  
  // FUTUR : API Suivi
  // const response = await apiFetch<{ items: QuickCaptureItem[] }>(
  //   '/api/mobile/quick-capture/items',
  //   {},
  //   accessToken
  // );
  // return response.items;
}

/**
 * Crée un nouvel item Quick Capture dans l'inbox mobile
 * 
 * @param payload Données de l'item à créer (title obligatoire, dueDate optionnel)
 * @returns Promise<QuickCaptureItem> Item créé
 * 
 * TODO API Suivi :
 * - Endpoint : POST /api/mobile/quick-capture/items
 * - Headers : Authorization Bearer {accessToken}
 * - Body : { title: string; dueDate?: string | null }
 * - Response : QuickCaptureItem
 */
export async function createQuickCaptureItem(
  payload: CreateQuickCapturePayload
): Promise<QuickCaptureItem> {
  // ACTUELLEMENT : Mock
  return mock.createQuickCaptureItem(payload);
  
  // FUTUR : API Suivi
  // return apiFetch<QuickCaptureItem>(
  //   '/api/mobile/quick-capture/items',
  //   {
  //     method: 'POST',
  //     body: JSON.stringify(payload),
  //   },
  //   accessToken
  // );
}

/**
 * Vide l'inbox Quick Capture (supprime tous les items)
 * 
 * @returns Promise<void>
 * 
 * TODO API Suivi :
 * - Endpoint : DELETE /api/mobile/quick-capture/items
 * - Headers : Authorization Bearer {accessToken}
 * - Response : { success: boolean }
 */
export async function clearQuickCaptureInbox(): Promise<void> {
  // ACTUELLEMENT : Mock
  return mock.clearQuickCaptureInbox();
  
  // FUTUR : API Suivi
  // return apiFetch<void>(
  //   '/api/mobile/quick-capture/items',
  //   {
  //     method: 'DELETE',
  //   },
  //   accessToken
  // );
}

