/**
 * Task Rules Engine
 * 
 * Moteur de règles pour appliquer automatiquement des dépendances entre champs d'une tâche.
 * 
 * Règles implémentées :
 * - Règles basées sur le statut
 * - Règles basées sur les dates
 * - Règles basées sur le type de projet
 * 
 * TODO: Futur moteur de règles piloté par API Suivi Desktop
 */

import type { Task, TaskQuickAction } from '../types/task';

/**
 * applyTaskDependencies
 * 
 * Applique automatiquement les dépendances entre champs d'une tâche.
 * Les règles ne s'appliquent QUE si le champ concerné est modifié dans updates.
 * Cela évite d'écraser les choix manuels de l'utilisateur.
 * 
 * @param task - Tâche à traiter (déjà normalisée et avec updates appliqués)
 * @param updates - Champs modifiés dans cette mise à jour
 * @returns Tâche modifiée avec les dépendances appliquées
 * 
 * Tests de comportement :
 * - Changer status → PAS de recalcul si dueDate ancienne
 * - Changer dueDate → statut mis à jour une seule fois
 * - Changer description → aucun changement sur status/priority
 * - Changer status de blocked → todo → ne pas réappliquer dueDate → blocked
 */
export function applyTaskDependencies(task: Task, updates: Partial<Task>): Task {
  let updatedTask = { ...task };

  // A. RÈGLES BASÉES SUR LE STATUT
  // Appliquer uniquement si updates.status est défini (statut modifié)
  
  if (updates.status !== undefined) {
    // Si status === "done" → désactiver toutes les quickActions
    // IMPORTANT : Ne pas écraser si quickActions existent déjà et que le statut n'a pas changé
    // Seulement si le statut vient d'être changé vers "done"
    if (updates.status === 'done') {
      updatedTask = {
        ...updatedTask,
        quickActions: [],
      };
    }
    
    // Si status === "blocked" → priority = "high"
    // IMPORTANT : Ne pas écraser la priorité si elle existe déjà et n'est pas affectée par la règle
    // Seulement si le statut vient d'être changé vers "blocked"
    if (updates.status === 'blocked') {
      updatedTask = {
        ...updatedTask,
        priority: 'high',
      };
    }
  }

  // B. RÈGLES SUR LA DUE DATE
  // Appliquer uniquement si updates.dueDate est défini (dueDate modifiée)
  // Ne pas réappliquer si l'utilisateur a changé le statut manuellement
  
  if (updates.dueDate !== undefined && updatedTask.status !== 'done') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(updatedTask.dueDate + 'T00:00:00');
    dueDate.setHours(0, 0, 0, 0);
    
    // Si la nouvelle dueDate est passée → status = "blocked"
    // Ne s'applique que si le statut n'a pas été modifié manuellement dans cette update
    if (dueDate < today && updates.status === undefined) {
      updatedTask = {
        ...updatedTask,
        status: 'blocked',
        priority: 'high', // Appliquer aussi la règle de priorité pour blocked
      };
    }
  }

  // C. RÈGLES BASÉES SUR projectName (mock simple)
  // Appliquer uniquement si updates.projectName est défini (projectName modifié)
  
  if (updates.projectName !== undefined && updatedTask.status !== 'done') {
    const existingQuickActions = updatedTask.quickActions || [];
    
    // Si projectName === "maintenance" → ajouter action WEATHER si absente
    if (updatedTask.projectName === 'maintenance') {
      updatedTask = addWeatherAction(updatedTask, existingQuickActions);
    }
    
    // Si projectName === "deliverable" → ajouter action PROGRESS si absente
    if (updatedTask.projectName === 'deliverable') {
      updatedTask = addProgressAction(updatedTask, existingQuickActions);
    }
    
    // Si projectName === "approval_flow" → ajouter action APPROVAL si absente
    if (updatedTask.projectName === 'approval_flow') {
      updatedTask = addApprovalAction(updatedTask, existingQuickActions);
    }
  }

  return updatedTask;
}

/**
 * addWeatherAction
 * 
 * Ajoute une action WEATHER si elle n'existe pas déjà.
 * 
 * @param task - Tâche à modifier
 * @param existingQuickActions - Liste des QuickActions existantes
 * @returns Tâche avec l'action WEATHER ajoutée si absente
 */
function addWeatherAction(task: Task, existingQuickActions: TaskQuickAction[]): Task {
  const hasWeather = existingQuickActions.some((qa) => qa.type === 'WEATHER');
  
  if (!hasWeather) {
    const weatherAction: TaskQuickAction = {
      type: 'WEATHER',
      uiHint: 'weather_picker',
      payload: {
        options: ['sunny', 'cloudy', 'storm'],
      },
    };
    
    return {
      ...task,
      quickActions: [...existingQuickActions, weatherAction],
    };
  }
  
  return task;
}

/**
 * addProgressAction
 * 
 * Ajoute une action PROGRESS si elle n'existe pas déjà.
 * 
 * @param task - Tâche à modifier
 * @param existingQuickActions - Liste des QuickActions existantes
 * @returns Tâche avec l'action PROGRESS ajoutée si absente
 */
function addProgressAction(task: Task, existingQuickActions: TaskQuickAction[]): Task {
  const hasProgress = existingQuickActions.some((qa) => qa.type === 'PROGRESS');
  
  if (!hasProgress) {
    const progressAction: TaskQuickAction = {
      type: 'PROGRESS',
      uiHint: 'progress_slider',
      payload: {
        min: 0,
        max: 100,
      },
    };
    
    return {
      ...task,
      quickActions: [...existingQuickActions, progressAction],
    };
  }
  
  return task;
}

/**
 * addApprovalAction
 * 
 * Ajoute une action APPROVAL si elle n'existe pas déjà.
 * 
 * @param task - Tâche à modifier
 * @param existingQuickActions - Liste des QuickActions existantes
 * @returns Tâche avec l'action APPROVAL ajoutée si absente
 */
function addApprovalAction(task: Task, existingQuickActions: TaskQuickAction[]): Task {
  const hasApproval = existingQuickActions.some((qa) => qa.type === 'APPROVAL');
  
  if (!hasApproval) {
    const approvalAction: TaskQuickAction = {
      type: 'APPROVAL',
      uiHint: 'approval_dual_button',
      payload: {
        requestId: `req_${Date.now()}`,
      },
    };
    
    return {
      ...task,
      quickActions: [...existingQuickActions, approvalAction],
    };
  }
  
  return task;
}

