import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AppStackParamList } from '../navigation/types';
import { Screen } from '@components/Screen';
import { AppHeader } from '@components/AppHeader';
import { SuiviText } from '@components/ui/SuiviText';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { NotificationItem } from '@components/ui/NotificationItem';
import { useNotificationsStore } from '../features/notifications/notificationsStore';
import { fetchNotifications } from '../services/notificationsService';
import { tokens } from '@theme';

type NotificationsNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * NotificationsScreen
 * 
 * Liste des notifications avec :
 * - Liste des notifications depuis le store (source unique de vérité)
 * - Mark as read / Mark all as read
 * - Navigation vers TaskDetail quand une notification est liée à une tâche
 * 
 * TODO: Replace useNotificationsStore() with real Suivi API calls when backend is ready.
 */
type FilterOption = 'all' | 'unread';

export function NotificationsScreen() {
  const navigation = useNavigation<NotificationsNavigationProp>();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;
  const [filter, setFilter] = useState<FilterOption>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Source unique de vérité pour les notifications - TODO: Replace with real Suivi API
  const { notifications, markAsRead, markAllAsRead } = useNotificationsStore();
  
  // Couleur du pull-to-refresh (blanc en dark mode, primary en light mode)
  const refreshColor = isDark ? tokens.colors.text.dark.primary : tokens.colors.brand.primary;
  
  // Formater la date du jour selon la locale de l'app (ex: "MERCREDI 19 NOVEMBRE" ou "WEDNESDAY 19 NOVEMBER")
  const formatDateHeader = (): string => {
    const today = new Date();
    // Mapper la locale i18n vers la locale JavaScript
    const appLocale = i18n.language === 'en' ? 'en-US' : 'fr-FR';
    const dayName = today.toLocaleDateString(appLocale, { weekday: 'long' });
    const day = today.getDate();
    const monthName = today.toLocaleDateString(appLocale, { month: 'long' });
    return `${dayName.toUpperCase()} ${day} ${monthName.toUpperCase()}`;
  };

  const dateHeader = formatDateHeader();
  
  // Filtrer les notifications selon le filtre actif
  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, filter]);
  
  // Fonction de refresh (pull-to-refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Recharger les notifications depuis le service (respecte API_MODE)
      await fetchNotifications();
      // Le store se mettra à jour automatiquement via son mécanisme interne
      // Pour l'instant, on simule un délai pour l'UX du pull-to-refresh
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Marquer toutes comme lues
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // TODO: When Suivi API is ready, add error handling for failed API calls
  };


  const renderNotificationItem = ({ item }: { item: any }) => {
    return (
      <NotificationItem
        key={item.id}
        notification={item}
        // NotificationItem gère maintenant la navigation directement vers TaskDetail
      />
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <SuiviText variant="h2" style={styles.emptyTitle}>
          {t('notifications.empty')}
        </SuiviText>
        <SuiviText variant="body" color="secondary" style={styles.emptyText}>
          You're all caught up!
        </SuiviText>
      </View>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Screen>
      <AppHeader />
      
      {/* Date and Title Header */}
      <View style={styles.dateTitleHeader}>
        <SuiviText variant="label" color="secondary" style={styles.dateText}>
          {dateHeader}
        </SuiviText>
        <SuiviText variant="h1" style={styles.titleText}>
          {t('notifications.youHave')}{' '}
          <SuiviText variant="h1" style={{ color: tokens.colors.brand.primary }}>
            {unreadCount} {t('notifications.notifications')}
          </SuiviText>
        </SuiviText>
      </View>
      
      {/* Filters and Mark All as Read */}
      <View style={styles.filterBarContainer}>
        <SegmentedControl
          options={[
            { key: 'all', label: t('notifications.filters.all') },
            { key: 'unread', label: t('notifications.filters.unread') },
          ]}
          value={filter}
          onChange={(newValue) => setFilter(newValue as FilterOption)}
        />
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllReadLink}
          >
            <MaterialCommunityIcons
              name="check-all"
              size={16}
              color={tokens.colors.brand.primary}
              style={styles.markAllReadIcon}
            />
            <SuiviText variant="label" style={styles.markAllReadText}>
              {t('notifications.markAllRead')}
            </SuiviText>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications list or empty state */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={filteredNotifications.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={filteredNotifications.length === 0 ? renderEmptyState : null}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={refreshColor}
            colors={[refreshColor]}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateTitleHeader: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  dateText: {
    marginBottom: tokens.spacing.xs,
    textTransform: 'uppercase',
  },
  titleText: {
    // fontWeight est déjà géré par variant="h1" (Inter_600SemiBold)
  },
  filterBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  markAllReadLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.sm,
  },
  markAllReadIcon: {
    marginRight: tokens.spacing.xs,
  },
  markAllReadText: {
    color: tokens.colors.brand.primary,
  },
  listContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.md,
    flexGrow: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl * 2,
  },
  emptyTitle: {
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
  },
});
