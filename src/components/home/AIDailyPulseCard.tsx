/**
 * AIDailyPulseCard
 * 
 * Carte AI Daily Pulse affichant les mises à jour importantes du jour.
 * 
 * Structure du layout:
 * - Layout horizontal en deux colonnes :
 *   - Colonne gauche (fixe) : Icône robot dans un cercle jaune transparent (32x32)
 *   - Colonne droite (flex) : Bloc texte contenant :
 *     - Titre "AI Daily Pulse"
 *     - Sous-titre avec nombre de mises à jour
 *     - Groupe de bullet points alignés sous le titre/sous-titre
 * 
 * Rôle de chaque sous-bloc:
 * - iconColumn : Colonne fixe à gauche, contient l'icône robot dans un cercle
 * - textColumn : Colonne flex à droite, contient tout le contenu textuel
 * - headerTextBlock : Bloc contenant titre et sous-titre
 * - insightsBlock : Groupe de bullet points alignés verticalement
 * 
 * Mapping API futur:
 * - GET /api/analytics/ai-daily-pulse : Endpoint principal pour charger le résumé AI
 * - GET /notifications?unread=true : Base des indicateurs (tâches en retard, dues aujourd'hui)
 * - champ focusOfDay : Champ backend qui renvoie le focus du jour (projet/board/thème)
 * 
 * Ce que le backend devra renvoyer:
 * {
 *   "importantUpdates": number,  // Nombre total de mises à jour importantes
 *   "overdue": number,           // Nombre de tâches en retard
 *   "dueToday": number,          // Nombre de tâches dues aujourd'hui
 *   "focus": string              // Focus du jour (ex: "Design System")
 * }
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SuiviText } from '../ui/SuiviText';
import { tokens } from '@theme';
import { useMyWork, type SectionName } from '../../hooks/useMyWork';
import type { Task } from '../../types/task';

export interface AIDailyPulseData {
  importantUpdates: number;
  overdue: number;
  dueToday: number;
  focus: string;
}

export interface AIDailyPulseCardProps {
  /**
   * Données du pulse AI
   * Si non fourni, utilise les données mock
   */
  data?: AIDailyPulseData;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: any;
}

// Mock data pour le MVP (fallback si pas de données)
const mockAIPulse: AIDailyPulseData = {
  importantUpdates: 3,
  overdue: 2,
  dueToday: 1,
  focus: "Design System",
};

/**
 * Compare deux dates pour vérifier si elles sont le même jour
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Classifie une tâche par sa date d'échéance dans une section chronologique.
 * (Copie identique de la fonction dans MyTasksScreen.tsx pour garantir la cohérence)
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
  
  // Overdue (strictement avant aujourd'hui, excluant les tâches "done")
  if (taskDate < today && task.status !== 'done') {
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
 * AIDailyPulseCard
 * 
 * Carte full-width avec gradient violet/bleu affichant les insights AI du jour.
 * Utilise les vraies tâches de l'utilisateur pour calculer les métriques.
 */
export function AIDailyPulseCard({ data, style }: AIDailyPulseCardProps) {
  const { t } = useTranslation();
  const { tasks, tasksByStatus, tasksBySection, isLoading, error } = useMyWork();
  const isError = !!error;

  // Calculer les métriques à partir des tâches réelles
  const pulseData = useMemo(() => {
    // Si data est fourni explicitement, l'utiliser
    if (data) {
      return data;
    }

    // Si pas de données ou en erreur, utiliser mock
    if (isError || !tasks || tasks.length === 0) {
      return mockAIPulse;
    }

    // Utiliser EXACTEMENT la même logique que MyTasksScreen pour obtenir les tâches overdue
    // Reproduire la logique exacte de MyTasksScreen.filteredSections avec filter='all'
    const allTasks = tasksByStatus('all');
    
    // Construire les sections exactement comme MyTasksScreen
    const sections: Record<SectionName, Task[]> = {
      overdue: [],
      today: [],
      thisWeek: [],
      nextWeek: [],
      later: [],
      noDate: [],
    };
    
    // Classifier chaque tâche dans sa section (même logique que MyTasksScreen)
    allTasks.forEach((task) => {
      const section = classifyTaskByDate(task);
      sections[section].push(task);
    });

    // Focus project : le projet/board qui revient le plus souvent dans les tâches en retard
    const projectCounts: Record<string, number> = {};
    sections.overdue.forEach((task) => {
      const projectName = task.location?.boardName || task.projectName || '';
      if (projectName) {
        projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
      }
    });

    let focusProject = '';
    let maxCount = 0;
    Object.entries(projectCounts).forEach(([project, count]) => {
      if (count > maxCount) {
        maxCount = count;
        focusProject = project;
      }
    });

    // Si pas de focus project trouvé, utiliser un projet des tâches dues aujourd'hui
    if (!focusProject && sections.today.length > 0) {
      const todayProjectCounts: Record<string, number> = {};
      sections.today.forEach((task) => {
        const projectName = task.location?.boardName || task.projectName || '';
        if (projectName) {
          todayProjectCounts[projectName] = (todayProjectCounts[projectName] || 0) + 1;
        }
      });
      Object.entries(todayProjectCounts).forEach(([project, count]) => {
        if (count > maxCount) {
          maxCount = count;
          focusProject = project;
        }
      });
    }

    const overdueCount = sections.overdue.length;
    const dueTodayCount = sections.today.length;
    const importantUpdates = overdueCount + dueTodayCount;

    return {
      importantUpdates,
      overdue: overdueCount,
      dueToday: dueTodayCount,
      focus: focusProject || mockAIPulse.focus,
    };
  }, [data, tasks, tasksByStatus, isError]);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#4F5DFF', '#8254FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Layout en deux colonnes : icône à gauche, texte à droite */}
        <View style={styles.mainRow}>
          {/* Colonne gauche : Icône IA */}
          <View style={styles.iconColumn}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="robot-outline"
                size={20}
                color="#FFE071"
              />
            </View>
          </View>

          {/* Colonne droite : Bloc texte (titre + sous-titre + bullets) */}
          <View style={styles.textColumn}>
            {/* Bloc titre + sous-titre */}
            <View style={styles.headerTextBlock}>
              <SuiviText
                variant="h3"
                style={styles.title}
              >
                {t('ai_pulse.title')}
              </SuiviText>
              <SuiviText
                variant="body2"
                style={styles.subtitle}
              >
                {t('ai_pulse.summary', { count: pulseData.importantUpdates })}
              </SuiviText>
            </View>

            {/* Groupe de bullet points alignés sous le titre/sous-titre */}
            <View style={styles.insightsBlock}>
              {pulseData.overdue > 0 && (
                <View style={styles.insightRow}>
                  <View style={styles.insightDotRed} />
                  <SuiviText variant="body2" style={styles.insightText}>
                    {t('ai_pulse.overdue', { count: pulseData.overdue })}
                  </SuiviText>
                </View>
              )}
              {pulseData.dueToday > 0 && (
                <View style={styles.insightRow}>
                  <View style={styles.insightDotOrange} />
                  <SuiviText variant="body2" style={styles.insightText}>
                    {t('ai_pulse.due_today', { count: pulseData.dueToday })}
                  </SuiviText>
                </View>
              )}
              {pulseData.focus && (
                <View style={styles.insightRow}>
                  <View style={styles.insightDotGreen} />
                  <SuiviText variant="body2" style={styles.insightText}>
                    {t('ai_pulse.focus', { topic: pulseData.focus })}
                  </SuiviText>
                </View>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: tokens.radius.xl,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconColumn: {
    width: 44, // Largeur fixe pour la colonne icône (32 + 12 margin)
    marginRight: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.lg,
    backgroundColor: 'rgba(255,224,113,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  headerTextBlock: {
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    color: '#FFFFFFCC',
    fontSize: 13,
    fontWeight: '400',
  },
  insightsBlock: {
    gap: 5, // Espacement vertical entre les bullets (4-6px)
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: tokens.radius.xs,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    opacity: 0.8,
  },
  insightDotRed: {
    width: 6,
    height: 6,
    borderRadius: tokens.radius.xs,
    backgroundColor: '#FF4D4F',
    marginRight: 10,
  },
  insightDotOrange: {
    width: 6,
    height: 6,
    borderRadius: tokens.radius.xs,
    backgroundColor: '#FA8C16',
    marginRight: 10,
  },
  insightDotGreen: {
    width: 6,
    height: 6,
    borderRadius: tokens.radius.xs,
    backgroundColor: '#52C41A',
    marginRight: 10,
  },
  insightText: {
    color: 'rgba(255,255,255,0.90)',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
});

