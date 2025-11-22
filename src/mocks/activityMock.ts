/**
 * Activity Mock Data
 * 
 * Export centralisé des données mockées pour les activités.
 * Reprend EXACTEMENT les mocks actuels sans transformation.
 */

import { getMockRecentActivity, mockActivity } from './data/activity';
import type { SuiviActivityEvent } from '../types/activity';

export const mockActivityEvents: SuiviActivityEvent[] = mockActivity;

export { getMockRecentActivity } from './data/activity';

