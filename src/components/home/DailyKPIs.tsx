/**
 * DailyKPIs
 * 
 * Barre horizontale affichant 3 KPIs du jour (tâches ouvertes, échéances, en retard).
 * 
 * Design:
 * - 3 pills horizontales avec icônes colorées
 * - Background adapté au light/dark mode
 * - Icônes rondes avec couleurs spécifiques par type
 * 
 * API Integration:
 * - MVP: Mock data interne
 * - Future: GET /api/mobile/kpis
 * - Response: { openTasks, dueToday, overdue }
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviText } from '../ui/SuiviText';
import { tokens } from '../../theme';

export interface DailyKPIsData {
  openTasks: number;
  dueToday: number;
  overdue: number;
}

export interface DailyKPIsProps {
  /**
   * Données des KPIs
   * Si non fourni, utilise les données mock
   */
  data?: DailyKPIsData;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: any;
}

// Mock data pour le MVP
const mockKPIs: DailyKPIsData = {
  openTasks: 7,
  dueToday: 2,
  overdue: 1,
};

/**
 * DailyKPIs
 * 
 * Barre horizontale avec 3 KPIs du jour.
 */
export function DailyKPIs({ data = mockKPIs, style }: DailyKPIsProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const kpisData = data || mockKPIs;

  // Background adapté au thème
  const pillBackground = isDark 
    ? 'rgba(255,255,255,0.08)' 
    : 'rgba(0,0,0,0.04)';

  return (
    <View style={[styles.container, style]}>
      {/* KPI 1: Tâches ouvertes */}
      <View style={[styles.kpiPill, { backgroundColor: pillBackground }]}>
        <View style={[styles.iconCircle, { backgroundColor: '#4F5DFF20' }]}>
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={14}
            color="#4F5DFF"
          />
        </View>
        <SuiviText variant="body2" style={styles.kpiText}>
          {kpisData.openTasks} {kpisData.openTasks === 1 ? 'tâche ouverte' : 'tâches ouvertes'}
        </SuiviText>
      </View>

      {/* KPI 2: Échéances */}
      <View style={[styles.kpiPill, { backgroundColor: pillBackground }]}>
        <View style={[styles.iconCircle, { backgroundColor: '#FFC63A20' }]}>
          <MaterialCommunityIcons
            name="calendar-today"
            size={14}
            color="#FFC63A"
          />
        </View>
        <SuiviText variant="body2" style={styles.kpiText}>
          {kpisData.dueToday} {kpisData.dueToday === 1 ? 'échéance' : 'échéances'}
        </SuiviText>
      </View>

      {/* KPI 3: En retard */}
      <View style={[styles.kpiPill, { backgroundColor: pillBackground }]}>
        <View style={[styles.iconCircle, { backgroundColor: '#FF3B3020' }]}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={14}
            color="#FF3B30"
          />
        </View>
        <SuiviText variant="body2" style={styles.kpiText}>
          {kpisData.overdue} {kpisData.overdue === 1 ? 'en retard' : 'en retard'}
        </SuiviText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  kpiPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 8,
  },
  iconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    // La couleur sera gérée par SuiviText avec le thème
  },
});

