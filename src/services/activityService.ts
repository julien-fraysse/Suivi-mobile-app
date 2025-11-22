/**
 * Activity Service
 * 
 * Service API pour les activités (placeholder).
 * Utilise apiGet/apiPost pour les appels API réels (non utilisés pour l'instant).
 */

import { apiGet } from './api';

// Placeholder functions - NOT USED YET
export async function fetchRecentActivity() {
  return apiGet('/me/activity/recent');
}

export async function fetchTaskActivity(taskId: string) {
  return apiGet(`/tasks/${taskId}/activity`);
}

// Mock service functions
import { getMockRecentActivity } from '../mocks/activityMock';
import type { SuiviActivityEvent } from '../types/activity';

export async function fetchRecentActivityMock(): Promise<SuiviActivityEvent[]> {
  return getMockRecentActivity();
}

export async function fetchTaskActivityMock(taskId: string): Promise<SuiviActivityEvent[]> {
  const activities = getMockRecentActivity();
  return activities.filter((activity) => activity.taskInfo?.taskId === taskId);
}

