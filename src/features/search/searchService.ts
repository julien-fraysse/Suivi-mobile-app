/**
 * Search Service
 * 
 * Service de recherche unifiée pour Suivi mobile.
 * Recherche dans les tâches, notifications et projets.
 * 
 * Mode mock : recherche locale dans les données en mémoire
 * Mode API : appellera GET /api/search?q=... (futur)
 * 
 * Le debounce est géré côté UI (HomeScreen), pas ici.
 */

import { API_MODE } from '../../config/apiMode';
import { getTasksStore } from '../../mocks/backend/store';
import { NOTIFICATIONS } from '../../mocks/suiviData';
import { mockProjects } from '../../mocks/projectsMock';
import type { SearchResult } from './searchTypes';

/**
 * Recherche unifiée dans les tâches, notifications et projets.
 * 
 * @param query - Terme de recherche (case-insensitive)
 * @returns Promise<SearchResult[]> - Résultats de recherche
 * 
 * TODO: Quand l'API sera prête, ajouter le mode 'api' avec :
 * return apiFetch<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`, {}, accessToken);
 */
export async function search(query: string): Promise<SearchResult[]> {
  if (API_MODE === 'mock') {
    return searchMock(query);
  }
  
  // Mode API (futur) - pour l'instant fallback sur mock
  // TODO: Implémenter GET /api/search?q=...
  return searchMock(query);
}

/**
 * Recherche locale dans les données mockées.
 * 
 * Recherche case-insensitive dans :
 * - Tâches : title, description, projectName
 * - Notifications : title, message
 * - Projets : name
 * 
 * @param query - Terme de recherche
 * @returns SearchResult[] - Résultats triés (tâches d'abord, puis notifs, puis projets)
 */
function searchMock(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  const results: SearchResult[] = [];
  
  // 1. Recherche dans les tâches
  const tasks = getTasksStore();
  for (const task of tasks) {
    const matchTitle = task.title.toLowerCase().includes(q);
    const matchDescription = task.description?.toLowerCase().includes(q);
    const matchProject = task.projectName?.toLowerCase().includes(q);
    
    if (matchTitle || matchDescription || matchProject) {
      results.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        subtitle: task.projectName || task.status,
        taskId: task.id,
      });
    }
  }
  
  // 2. Recherche dans les notifications
  for (const notif of NOTIFICATIONS) {
    const matchTitle = notif.title.toLowerCase().includes(q);
    const matchMessage = notif.message.toLowerCase().includes(q);
    
    if (matchTitle || matchMessage) {
      results.push({
        id: `notif-${notif.id}`,
        type: 'notification',
        title: notif.title,
        subtitle: notif.message.length > 60 
          ? `${notif.message.slice(0, 60)}...` 
          : notif.message,
        notificationId: notif.id,
      });
    }
  }
  
  // 3. Recherche dans les projets
  for (const project of mockProjects) {
    if (project.name.toLowerCase().includes(q)) {
      results.push({
        id: `project-${project.id}`,
        type: 'project',
        title: project.name,
        subtitle: `${project.taskCount} tâches`,
        projectId: project.id,
      });
    }
  }
  
  return results;
}



