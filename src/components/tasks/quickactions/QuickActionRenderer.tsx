import React from 'react';
import { Task } from '../../../api/tasks';
import { QuickActionComment } from './QuickActionComment';
import { QuickActionApproval } from './QuickActionApproval';
import { QuickActionRating } from './QuickActionRating';
import { QuickActionProgress } from './QuickActionProgress';
import { QuickActionWeather } from './QuickActionWeather';
import { QuickActionCalendar } from './QuickActionCalendar';
import { QuickActionCheckbox } from './QuickActionCheckbox';
import { QuickActionSelect } from './QuickActionSelect';

export interface QuickActionRendererProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionRenderer
 * 
 * Rendu conditionnel des Quick Actions selon le uiHint de la tâche.
 * Affiche le composant approprié pour chaque type d'action.
 */
export function QuickActionRenderer({ task, onActionComplete }: QuickActionRendererProps) {
  console.log("QA-DIAG: QuickActionRenderer", {
    taskId: task.id,
    hasQuickAction: !!task.quickAction,
    uiHint: task.quickAction?.uiHint
  });

  if (!task.quickAction) {
    return null;
  }

  const { uiHint, payload } = task.quickAction;

  switch (uiHint) {
    case "comment_input":
      return <QuickActionComment task={task} onActionComplete={onActionComplete} />;
    
    case "approval_dual_button":
      return <QuickActionApproval task={task} payload={payload} onActionComplete={onActionComplete} />;
    
    case "stars_1_to_5":
      return <QuickActionRating task={task} onActionComplete={onActionComplete} />;
    
    case "progress_slider":
      return null;
    
    case "weather_picker":
      return <QuickActionWeather task={task} payload={payload} onActionComplete={onActionComplete} />;
    
    case "calendar_picker":
      return <QuickActionCalendar task={task} onActionComplete={onActionComplete} />;
    
    case "simple_checkbox":
      return <QuickActionCheckbox task={task} onActionComplete={onActionComplete} />;
    
    case "dropdown_select":
      return <QuickActionSelect task={task} payload={payload} onActionComplete={onActionComplete} />;
    
    default:
      return null;
  }
}

