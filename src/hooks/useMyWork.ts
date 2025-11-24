/**
 * useMyWork Hook
 * 
 * Hook canonique pour récupérer toutes les tâches assignées à l'utilisateur.
 * 
 * Ce hook est la seule interface stable que toute l'app utilisera pour "mes tâches".
 * 
 * Fonctionnalités :
 * - Charge toutes les tâches assignées à l'utilisateur
 * - Normalise les tâches via normalizeTask() pour garantir la cohérence
 * - Expose la liste brute, triée, et filtrée par statut
 * - Gère le chargement, les erreurs, et le refresh
 * - Respecte API_MODE (React Query en mode API, mocks en mode mock)
 * 
 * Usage:
 *   const { tasks, tasksSorted, tasksByStatus, isLoading, error, refresh } = useMyWork();
 *   const activeTasks = tasksByStatus('active');
 */

import { useMemo, useEffect, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { API_MODE } from '../config/apiMode';
import { getMyTasks } from '../api/tasks';
import type { Task, TaskStatus } from '../types/task';
import { normalizeTask } from '../types/task';

export type UseMyWorkOptions = {
  /** Filtre initial par statut (optionnel) */
  initialStatus?: TaskStatus | 'all' | 'active' | 'completed';
};

export type SectionName = 'overdue' | 'today' | 'thisWeek' | 'nextWeek' | 'later' | 'noDate';

/**
 * Classifie une tâche par sa date d'échéance dans une section chronologique.
 * 
 * @param task - Tâche à classifier
 * @returns SectionName - Section à laquelle appartient la tâche
 */
function classifyTaskByDate(task: Task): SectionName {
  if (!task.dueDate) {
    return 'noDate';
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  
  const taskDate = new Date(task.dueDate + 'T00:00:00');
  taskDate.setHours(0, 0, 0, 0);
  
  // Aujourd'hui
  if (task.dueDate === todayStr) {
    return 'today';
  }
  
  // Overdue (strictement avant aujourd'hui)
  if (taskDate < today) {
    return 'overdue';
  }
  
  // Calculer la différence en jours
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // This week (1-7 jours)
  if (diffDays >= 1 && diffDays <= 7) {
    return 'thisWeek';
  }
  
  // Next week (8-14 jours)
  if (diffDays >= 8 && diffDays <= 14) {
    return 'nextWeek';
  }
  
  // Later (> 14 jours)
  return 'later';
}

/**
 * useMyWork
 * 
 * Hook canonique pour récupérer toutes les tâches assignées à l'utilisateur.
 * 
 * @param options - Options du hook (filtre initial, etc.)
 * @returns { tasks, tasksSorted, tasksByStatus, sections, tasksBySection, isLoading, error, refresh, fetchNextPage, hasNextPage }
 */
export function useMyWork(options: UseMyWorkOptions = {}) {
  const { accessToken } = useAuth();
  const { initialStatus } = options;

  // État pour le mode mock (quand React Query est désactivé)
  const [mockTasks, setMockTasks] = useState<Task[]>([]);
  const [mockIsLoading, setMockIsLoading] = useState(true);
  const [mockError, setMockError] = useState<Error | null>(null);

  // React Query pour le mode API
  const query = useInfiniteQuery({
    queryKey: ['myWork', initialStatus],
    enabled: API_MODE === 'api' && !!accessToken, // Actif uniquement en mode API
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      if (!accessToken) {
        throw new Error('No access token');
      }
      return getMyTasks(accessToken, {
        page: pageParam as number,
        pageSize: 20,
        filters: initialStatus && initialStatus !== 'all' && initialStatus !== 'cancelled'
          ? { status: initialStatus as 'todo' | 'in_progress' | 'blocked' | 'done' | 'all' }
          : undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pageSize, total } = lastPage;
      const maxPage = Math.ceil(total / pageSize);
      if (page >= maxPage) return undefined;
      return page + 1;
    },
  });

  // Charger les mocks en mode mock (quand React Query est désactivé)
  useEffect(() => {
    if (API_MODE === 'mock') {
      const loadMockTasks = async () => {
        try {
          setMockIsLoading(true);
          setMockError(null);
          
          // Charger toutes les pages de tâches
          const allTasks: Task[] = [];
          let page = 1;
          let hasMore = true;
          
          while (hasMore) {
            const result = await getMyTasks(null, {
              page,
              pageSize: 20,
              filters: initialStatus && initialStatus !== 'all' && initialStatus !== 'cancelled'
                ? { status: initialStatus as 'todo' | 'in_progress' | 'blocked' | 'done' | 'all' }
                : undefined,
            });
            
            // Normaliser chaque tâche
            const normalized = result.items.map((rawTask) => normalizeTask(rawTask));
            allTasks.push(...normalized);
            
            hasMore = result.page * result.pageSize < result.total;
            page++;
          }
          
          setMockTasks(allTasks);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to load tasks');
          setMockError(error);
          console.error('Error loading mock tasks:', err);
        } finally {
          setMockIsLoading(false);
        }
      };
      
      loadMockTasks();
    }
  }, [initialStatus]);

  // Fonction de refresh
  const refresh = useCallback(async () => {
    if (API_MODE === 'api') {
      await query.refetch();
    } else {
      // Recharger les mocks
      setMockIsLoading(true);
      setMockError(null);
      
      try {
        const allTasks: Task[] = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          const result = await getMyTasks(null, {
            page,
            pageSize: 20,
            filters: initialStatus && initialStatus !== 'all' && initialStatus !== 'cancelled'
              ? { status: initialStatus as 'todo' | 'in_progress' | 'blocked' | 'done' | 'all' }
              : undefined,
          });
          
          const normalized = result.items.map((rawTask) => normalizeTask(rawTask));
          allTasks.push(...normalized);
          
          hasMore = result.page * result.pageSize < result.total;
          page++;
        }
        
        setMockTasks(allTasks);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to refresh tasks');
        setMockError(error);
      } finally {
        setMockIsLoading(false);
      }
    }
  }, [query, initialStatus]);

  // Tâches normalisées (depuis React Query ou mocks)
  const tasks: Task[] = useMemo(() => {
    if (API_MODE === 'api') {
      // En mode API : utiliser les données de React Query et normaliser
      const rawTasks = query.data?.pages.flatMap((page) => page.items) ?? [];
      return rawTasks.map((rawTask) => normalizeTask(rawTask));
    } else {
      // En mode mock : utiliser les tâches déjà normalisées
      return mockTasks;
    }
  }, [API_MODE, query.data, mockTasks]);

  // Tâches triées par date d'échéance (plus urgentes en premier)
  const tasksSorted: Task[] = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Tâches sans dueDate en dernier
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      // Trier par dueDate (croissant)
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks]);

  // Sections chronologiques des tâches
  const sections = useMemo(() => {
    const result: Record<SectionName, Task[]> = {
      overdue: [],
      today: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
      noDate: [],
    };
    
    // Classifier chaque tâche dans sa section
    tasks.forEach((task) => {
      const section = classifyTaskByDate(task);
      result[section].push(task);
    });
    
    return result;
  }, [tasks]);

  // Fonction pour filtrer par statut
  const tasksByStatus = useCallback(
    (status: TaskStatus | 'all' | 'active' | 'completed'): Task[] => {
      if (status === 'all') {
        return tasks;
      }
      if (status === 'active') {
        // Active = tout sauf done
        return tasks.filter((task) => task.status !== 'done');
      }
      if (status === 'completed') {
        // Completed = done uniquement
        return tasks.filter((task) => task.status === 'done');
      }
      // Filtre par statut spécifique
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  // États de chargement et d'erreur
  const isLoading = API_MODE === 'api' ? query.isLoading : mockIsLoading;
  const error = API_MODE === 'api' ? query.error : mockError;

  return {
    // Liste brute de toutes les tâches normalisées
    tasks,
    
    // Liste triée par date d'échéance
    tasksSorted,
    
    // Fonction pour filtrer par statut
    tasksByStatus,
    
    // Sections chronologiques
    sections,
    
    // Fonction pour récupérer les tâches d'une section
    tasksBySection: (sectionName: SectionName) => sections[sectionName] || [],
    
    // États
    isLoading,
    error,
    
    // Actions
    refresh,
    
    // Pagination (uniquement en mode API)
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
  };
}

