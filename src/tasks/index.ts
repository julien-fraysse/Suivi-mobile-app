/**
 * Tasks Module Exports
 * 
 * Point d'entrée principal pour le module de gestion des tâches.
 * Exporte tous les types, hooks et le provider.
 */

export { TasksProvider, useTasksContext } from './TasksContext';
export { useTasks } from './useTasks';
export { useTaskById } from './useTaskById';
export { useUpdateTaskStatus } from './useUpdateTaskStatus';
export type {
  Task,
  TaskStatus,
  TaskFilter,
  TaskUpdatePayload,
  TasksContextValue,
} from './tasks.types';


