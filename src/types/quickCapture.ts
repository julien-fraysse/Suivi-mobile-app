/**
 * Quick Capture Types
 * 
 * Types pour la fonctionnalité "Quick Capture" - Inbox mobile Suivi.
 * 
 * But UX : Permet de capturer rapidement une idée / tâche depuis mobile,
 * sans choix de board/portal/view. Les items Quick Capture seront ensuite
 * classés côté desktop dans les boards Suivi.
 * 
 * Architecture :
 * - Mobile : Quick Capture est une inbox temporaire mockée
 * - Desktop : Les items seront importés et convertis en tâches Suivi complètes
 * - API : Prêt à être branché sur un endpoint Suivi dédié
 */

/**
 * Statut d'un item Quick Capture
 * 
 * - `inbox` : Item dans l'inbox mobile (non synchronisé)
 * - `sent` : Item envoyé au backend Suivi (pour plus tard)
 */
export type QuickCaptureStatus = 'inbox' | 'sent';

/**
 * Item Quick Capture
 * 
 * Représente une capture rapide minimaliste depuis mobile.
 * Structure simple : titre + date optionnelle.
 * 
 * Note : Sépare de Task (src/api/tasks.ts) car les Quick Capture
 * ne sont pas des tâches Suivi complètes. Ils seront convertis plus tard.
 */
export type QuickCaptureItem = {
  /** ID unique de l'item */
  id: string;
  
  /** Titre de la capture (obligatoire) */
  title: string;
  
  /** Date de création (ISO string) */
  createdAt: string;
  
  /** Date d'échéance optionnelle (ISO string ou null) */
  dueDate?: string | null;
  
  /** Statut de l'item (inbox = non synchronisé, sent = envoyé au backend) */
  status: QuickCaptureStatus;
  
  /** Source de la capture (toujours 'mobile' pour l'instant) */
  source: 'mobile';
};

/**
 * Payload pour créer un nouvel item Quick Capture
 */
export type CreateQuickCapturePayload = {
  /** Titre de la capture (obligatoire) */
  title: string;
  
  /** Date d'échéance optionnelle */
  dueDate?: string | null;
};

