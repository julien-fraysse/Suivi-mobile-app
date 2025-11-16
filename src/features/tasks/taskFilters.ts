/**
 * Task Filters - Helpers Partagés
 * 
 * Helpers pour filtrer et compter les tâches de manière cohérente
 * entre HomeScreen (Quick Actions) et MyTasksScreen.
 * 
 * Ces fonctions utilisent la même logique de filtrage pour garantir
 * que les chiffres affichés correspondent exactement aux listes filtrées.
 */

import type { Task, TaskStatus } from '../../api/tasks';

export type TaskFilter = 'all' | 'active' | 'completed' | 'dueToday';

/**
 * Vérifie si une tâche est "active" (todo, in_progress, ou blocked)
 */
export function isTaskActive(task: Task): boolean {
  return task.status === 'todo' || task.status === 'in_progress' || task.status === 'blocked';
}

/**
 * Vérifie si une tâche est complétée (done)
 */
export function isTaskCompleted(task: Task): boolean {
  return task.status === 'done';
}

/**
 * Vérifie si une tâche est due aujourd'hui
 * 
 * Compare uniquement l'année / mois / jour (ignore l'heure).
 * 
 * TODO: À terme, ce calcul pourra être branché à :
 * - Des données Suivi réelles avec timezone correcte
 * - Une éventuelle intégration calendrier iOS/Android
 * Mais ce n'est pas le cas actuellement (utilise la date locale du device).
 * 
 * @param task - La tâche à vérifier
 * @param today - Date du jour (par défaut : new Date())
 * @returns true si la tâche est due aujourd'hui
 */
export function isDueToday(task: Task, today: Date = new Date()): boolean {
  if (!task.dueDate) {
    return false;
  }

  try {
    // Convertir la date de la tâche en Date
    const taskDate = new Date(task.dueDate);
    
    // Comparer uniquement année / mois / jour (ignorer l'heure)
    const taskYear = taskDate.getFullYear();
    const taskMonth = taskDate.getMonth();
    const taskDay = taskDate.getDate();
    
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    return taskYear === todayYear && taskMonth === todayMonth && taskDay === todayDay;
  } catch {
    // Si la date est invalide, ne pas compter comme "due today"
    return false;
  }
}

/**
 * Filtre une liste de tâches selon le filtre spécifié
 * 
 * Utilise la même logique de filtrage que MyTasksScreen pour garantir
 * la cohérence entre les chiffres Quick Actions et les listes filtrées.
 * 
 * @param tasks - Liste de tâches à filtrer
 * @param filter - Type de filtre à appliquer
 * @param today - Date du jour (pour le filtre 'dueToday')
 * @returns Liste filtrée des tâches
 */
export function filterTasks(
  tasks: Task[],
  filter: TaskFilter,
  today: Date = new Date(),
): Task[] {
  switch (filter) {
    case 'all':
      return tasks;
    
    case 'active':
      return tasks.filter(isTaskActive);
    
    case 'completed':
      return tasks.filter(isTaskCompleted);
    
    case 'dueToday':
      return tasks.filter((task) => isDueToday(task, today));
    
    default:
      return tasks;
  }
}

/**
 * Compte les tâches actives (todo, in_progress, blocked)
 * 
 * Utilisé par HomeScreen pour afficher le nombre "Active Tasks"
 * dans les Quick Actions.
 * 
 * @param tasks - Liste de tâches à compter
 * @returns Nombre de tâches actives
 */
export function getActiveTasksCount(tasks: Task[]): number {
  return tasks.filter(isTaskActive).length;
}

/**
 * Compte les tâches dues aujourd'hui
 * 
 * Utilisé par HomeScreen pour afficher le nombre "Due Today"
 * dans les Quick Actions.
 * 
 * @param tasks - Liste de tâches à compter
 * @param today - Date du jour (par défaut : new Date())
 * @returns Nombre de tâches dues aujourd'hui
 */
export function getDueTodayTasksCount(tasks: Task[], today: Date = new Date()): number {
  return tasks.filter((task) => isDueToday(task, today)).length;
}


