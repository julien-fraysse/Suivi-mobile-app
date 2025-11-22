/**
 * Activity Service
 * 
 * Service API pour les activités avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 */

import { API_MODE } from '../config/apiMode';
import { apiGet } from './api';
import { getMockRecentActivity } from '../mocks/activityMock';
import type { SuiviActivityEvent } from '../types/activity';

export async function fetchRecentActivity(): Promise<SuiviActivityEvent[]> {
  if (API_MODE === 'mock') {
    return getMockRecentActivity();
  }
  return apiGet('/me/activity/recent');
}

export async function fetchTaskActivity(taskId: string): Promise<SuiviActivityEvent[]> {
  if (API_MODE === 'mock') {
    const activities = getMockRecentActivity();
    return activities.filter((activity) => activity.taskInfo?.taskId === taskId);
  }
  return apiGet(`/tasks/${taskId}/activity`);
}

