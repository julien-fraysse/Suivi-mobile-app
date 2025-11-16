import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useTheme, TextInput as PaperTextInput, Button } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { SuiviText } from '../components/ui/SuiviText';
import { useAuth } from '../auth';
import { useThemeMode } from '../theme/ThemeProvider';
import { tokens } from '../../theme';

export function LoginScreen() {
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sélectionner le logo selon le thème
  const logoSource = isDark
    ? require('../../assets/suivi/logo-full-light.png')
    : require('../../assets/suivi/logo-full-dark.png');

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
          {/* Logo Suivi */}
          <View style={styles.logoContainer}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Titre */}
          <SuiviText variant="h1" style={styles.title}>
            Sign In
          </SuiviText>
          
          <SuiviText variant="body" color="secondary" style={styles.subtitle}>
            Welcome to Suivi
          </SuiviText>

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
  logoContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  logo: {
    width: 200,
    height: 80,
    maxWidth: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
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


