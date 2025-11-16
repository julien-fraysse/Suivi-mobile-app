import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { UserAvatar } from '../components/ui/UserAvatar';
import { useAuth } from '../auth';
import { useUser } from '../hooks/useUser';
import { useThemeMode } from '../theme/ThemeProvider';
import { tokens } from '../theme';

/**
 * MoreScreen
 * 
 * Écran de profil et paramètres avec :
 * - Profil utilisateur (useUser)
 * - Paramètres thème (useThemeMode)
 * - About (version app mock)
 * - Sign Out
 * 
 * Toutes les données viennent de api.ts (sauf thème).
 */
export function MoreScreen() {
  const { signOut } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { themeMode, setThemeMode, isDark } = useThemeMode();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Les trois modes sont gérés séparément via setThemeMode directement
  const handleSetTheme = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  // Version app mockée
  const appVersion = '1.0.0';

  return (
    <Screen>
      <ScreenHeader title="More" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.section}>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            {isLoadingUser ? (
              <SuiviText variant="body" color="secondary">
                Loading profile...
              </SuiviText>
            ) : user ? (
              <>
                <View style={styles.profileHeader}>
                  <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    avatarUrl={user.avatarUrl}
                    size="lg"
                    style={styles.avatar}
                  />
                  <View style={styles.profileInfo}>
                    <SuiviText variant="h1" style={styles.profileName}>
                      {user.firstName} {user.lastName}
                    </SuiviText>
                    <SuiviText variant="body" color="secondary">
                      {user.email}
                    </SuiviText>
                    {user.role && (
                      <View style={styles.roleBadge}>
                        <SuiviText variant="caption" color="inverse">
                          {user.role.toUpperCase()}
                        </SuiviText>
                      </View>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <SuiviText variant="body" color="secondary">
                No profile data available
              </SuiviText>
            )}
          </SuiviCard>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            Theme Settings
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={styles.themeOptions}>
              <SuiviButton
                title="Light"
                onPress={() => handleSetTheme('light')}
                variant={themeMode === 'light' ? 'primary' : 'ghost'}
                style={styles.themeButton}
              />
              <SuiviButton
                title="Dark"
                onPress={() => handleSetTheme('dark')}
                variant={themeMode === 'dark' ? 'primary' : 'ghost'}
                style={styles.themeButton}
              />
              <SuiviButton
                title="Auto (System)"
                onPress={() => handleSetTheme('auto')}
                variant={themeMode === 'auto' ? 'primary' : 'ghost'}
                style={styles.themeButton}
              />
            </View>
          </SuiviCard>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            About
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={styles.aboutRow}>
              <SuiviText variant="label" color="secondary">
                App Version:
              </SuiviText>
              <SuiviText variant="body" color="primary">
                {appVersion}
              </SuiviText>
            </View>
            <View style={styles.aboutRow}>
              <SuiviText variant="label" color="secondary">
                Design System:
              </SuiviText>
              <SuiviText variant="body" color="primary">
                Suivi v1.0
              </SuiviText>
            </View>
          </SuiviCard>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <SuiviButton
            title="Sign Out"
            onPress={handleSignOut}
            variant="destructive"
            fullWidth
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    marginBottom: tokens.spacing.md,
  },
  card: {
    marginBottom: tokens.spacing.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: tokens.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: tokens.spacing.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colors.brand.primary,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    marginTop: tokens.spacing.xs,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  themeButton: {
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
});
