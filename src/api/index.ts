/**
 * Suivi Mobile API - Index
 * 
 * Point d'entrée unique pour toutes les fonctions API (mockées ou réelles).
 * 
 * Architecture :
 * - Les fichiers `*.mock.ts` contiennent les implémentations mockées
 * - Les fichiers `*.ts` (tasks.ts, notifications.ts, etc.) utilisent `USE_MOCK_API` pour switcher
 * - Les hooks React Query (`src/hooks/*.ts`) appellent ces fonctions API
 * 
 * Pour migrer vers la vraie API :
 * 1. Créer des fichiers `*.real.ts` avec les vraies implémentations
 * 2. Modifier les fichiers `*.ts` pour importer depuis `*.real.ts` au lieu de `*.mock.ts`
 * 3. Mettre `USE_MOCK_API = false` dans `src/config/environment.ts`
 * 
 * @see docs/mobile/mock-data.md pour la documentation complète
 */

// Tasks API
export {
  getMyTasks,
  getTaskById,
  updateTaskStatus,
  getMyPriorities,
  getDueSoon,
  getRecentlyUpdated,
  getLate,
  quickCapture,
} from './tasksApi.mock';

export type { Task, TaskStatus, MyTasksFilters, MyTasksPage } from './tasks';

// Notifications API
export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from './notificationsApi.mock';

export type { Notification } from './notificationsApi.mock';

// Auth API
export { signIn } from './authApi.mock';

