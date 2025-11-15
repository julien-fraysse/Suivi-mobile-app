import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { tokens } from '../../theme';

export function HomeScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
            },
          ]}
        >
          Home
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.onSurfaceVariant,
            },
          ]}
        >
          Welcome to Suivi
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: 'bold',
    marginBottom: tokens.spacing.md,
  },
  subtitle: {
    fontSize: tokens.typography.body1.fontSize,
  },
});

