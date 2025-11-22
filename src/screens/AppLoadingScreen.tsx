import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Screen } from '@components/Screen';
import { tokens } from '@theme';

/**
 * AppLoadingScreen
 * 
 * Écran de chargement initial de l'application.
 * Affiche le logo/text Suivi avec un indicateur de chargement
 * pendant la restauration de session et l'initialisation de l'app.
 */
export function AppLoadingScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text
            style={[
              styles.logo,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            Suivi
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            Mobile
          </Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  logo: {
    fontSize: tokens.typography.h2.fontSize,
    fontWeight: 'bold',
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: tokens.typography.body1.fontSize,
    fontWeight: '500',
  },
  loadingContainer: {
    marginTop: tokens.spacing.lg,
  },
});







