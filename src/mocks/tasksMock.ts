/**
 * Tasks Mock Data
 * 
 * Export centralisé des données mockées pour les tâches.
 * Reprend EXACTEMENT les mocks actuels sans transformation.
 */

import { Task } from '../api/tasks';
import { tasks } from './suiviMock';

export const mockTasks: Task[] = tasks;

