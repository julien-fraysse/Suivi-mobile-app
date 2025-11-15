import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, TextInput as PaperTextInput, Button } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { useAuth } from '../auth';
import { tokens } from '../../theme';

export function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(String(err) || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.onSurface,
              },
            ]}
          >
            Sign In
          </Text>

          {error && (
            <Text
              style={[
                styles.errorText,
                {
                  color: theme.colors.error,
                },
              ]}
            >
              {error}
            </Text>
          )}

          <PaperTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            disabled={isLoading}
          />

          <PaperTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            style={styles.input}
            disabled={isLoading}
          />

          <Button
            mode="contained"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Sign In
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  },
  input: {
    marginBottom: tokens.spacing.md,
  },
  button: {
    marginTop: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
  },
  errorText: {
    fontSize: tokens.typography.body2.fontSize,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
});

