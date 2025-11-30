import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { HomeScreen } from '@screens/HomeScreen';
import { MyTasksScreen } from '@screens/MyTasksScreen';
import { NotificationsScreen } from '@screens/NotificationsScreen';
import { MoreScreen } from '@screens/MoreScreen';
import { useNotificationsStore } from '../features/notifications/notificationsStore';
import { tokens } from '@theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabNavigator
 * 
 * Bottom Tab Navigator avec 4 onglets principaux.
 * Style Suivi avec tokens exclusifs :
 * - Active : brand.primary (#4F5DFF)
 * - Inactive : neutral.medium (#98928C)
 * - Background : background.surface (#F4F2EE)
 * - Border : border.default (#E8E8E8)
 * 
 * Écrans :
 * - Home : Écran d'accueil
 * - MyTasks : Liste des tâches de l'utilisateur
 * - Notifications : Liste des notifications
 * - More : Menu "Plus" (déconnexion, settings, etc.)
 */
export function MainTabNavigator() {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.brand.primary, // #4F5DFF
        tabBarInactiveTintColor: tokens.colors.neutral.medium, // #98928C
        tabBarHideOnKeyboard: true, // Évite les bugs de layout avec le clavier
        tabBarStyle: {
          backgroundColor: isDark ? tokens.colors.surface.dark : tokens.colors.background.surface,
          borderTopWidth: 1,
          borderTopColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontFamily: tokens.typography.label.fontFamily,
          fontSize: 12,
          fontWeight: tokens.typography.label.fontWeight,
          marginTop: 0,
          textAlign: 'center',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTasks"
        component={MyTasksScreen}
        options={{
          tabBarLabel: 'My Tasks',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="clipboard-check-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size = 24 }) => {
            // Lire le state directement dans tabBarIcon pour garantir le re-render
            const { notifications } = useNotificationsStore();
            const unreadCount = notifications.filter(n => !n.read).length;
            
            return (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="bell" size={size} color={color} />
                {unreadCount > 0 && (
                  <View style={[
                    styles.badge,
                    unreadCount > 9 && styles.badgeLarge,
                  ]}>
                    {unreadCount > 99 ? (
                      <View style={styles.badgeDot} />
                    ) : (
                      <Text style={styles.badgeText}>
                        {unreadCount}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 14,
    height: 14,
    borderRadius: tokens.radius.sm,
    backgroundColor: '#FF3B30', // Rouge Suivi pour le badge
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF', // Bordure blanche pour contraste
  },
  badgeLarge: {
    minWidth: 20,
    height: 18,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: tokens.radius.xs,
    backgroundColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
    textAlign: 'center',
  },
});

