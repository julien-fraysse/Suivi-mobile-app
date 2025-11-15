import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth';
import { tokens } from '../../theme';

export function MoreScreen() {
  const theme = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
          More
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
          onPress={handleSignOut}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.colors.error,
              },
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: 'bold',
    marginBottom: tokens.spacing.xl,
  },
  button: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: tokens.typography.body1.fontSize,
    fontWeight: '600',
  },
});

