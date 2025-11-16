import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { HomeScreen } from '../screens/HomeScreen';
import { MyTasksScreen } from '../screens/MyTasksScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { tokens } from '../theme';
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
          backgroundColor: isDark ? tokens.colors.surface.dark : tokens.colors.background.surface, // Dark: #252525, Light: #F4F2EE
          borderTopWidth: 1,
          borderTopColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default, // Dark: #98928C, Light: #E8E8E8
          // Pas de hauteur fixe : React Navigation gère automatiquement la hauteur optimale
          // Pas de padding vertical : Le safe area est géré automatiquement par SafeAreaProvider
        },
        tabBarLabelStyle: {
          fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
          fontSize: tokens.typography.label.fontSize, // 13
          fontWeight: tokens.typography.label.fontWeight, // '500'
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyTasks"
        component={MyTasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size = 24 }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
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

