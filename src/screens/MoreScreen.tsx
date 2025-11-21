import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { AppHeader } from '../components/AppHeader';
import { SuiviCard } from '../components/ui/SuiviCard';
import { SuiviButton } from '../components/ui/SuiviButton';
import { SuiviText } from '../components/ui/SuiviText';
import { GradientActionButton } from '../components/ui/GradientActionButton';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { UserAvatar } from '../components/ui/UserAvatar';
import { EditProfileModal, type Profile as EditProfile } from '../components/ui/EditProfileModal';
import { useAuth } from '../auth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSettings } from '../hooks/useSettings';
import { useThemeMode } from '../theme/ThemeProvider';
import { tokens } from '../theme';
import { useTranslation } from 'react-i18next';

/**
 * Mock User Profile interface for MoreScreen
 * (Separate from useUserProfile hook which only returns basic info)
 */
interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string | any;
  fullName?: string;
  organization: {
    name: string;
    role: string;
  };
}

/**
 * MoreScreen (Account / Profile)
 * 
 * Écran de profil et paramètres avec :
 * - Profil utilisateur riche (avatar, nom, email, role) avec Edit Profile modal
 * - Paramètres thème (Light / Dark / Auto)
 * - Paramètres notifications (switch)
 * - Sélecteur de langue (FR / EN)
 * - Organisation (read-only)
 * - Sécurité (placeholders pour Reset Password, Manage Sessions)
 * - App Info (version, design system, API status)
 * - Sign Out
 * 
 * Utilise useUserProfile() pour les données de profil (mock pour le MVP).
 * TODO: Connecter à l'API Suivi (/me, /settings) quand le backend est prêt.
 */
export function MoreScreen() {
  const theme = useTheme();
  const isDark = theme.dark;
  const { signOut } = useAuth();
  const { fullName, email, avatar } = useUserProfile();
  const { settings, updateSettings } = useSettings();
  const { themeMode, setThemeMode } = useThemeMode();
  const { t, i18n } = useTranslation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Mock profile object for display (derived from useUserProfile data)
  // TODO: Replace with real profile API when backend is ready
  const profile: Profile = {
    firstName: fullName.split(' ')[0] || 'Julien',
    lastName: fullName.split(' ').slice(1).join(' ') || 'Fraysse',
    email,
    role: 'Admin',
    avatarUrl: avatar,
    fullName,
    organization: {
      name: 'Visiativ',
      role: 'Admin',
    },
  };

  const isLoading = false; // No loading state needed for mock data

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Les trois modes sont gérés séparément via setThemeMode directement
  // Note: ThemeProvider utilise 'auto' mais SettingsContext utilise 'system'
  // Conversion nécessaire pour la persistance
  const handleSetTheme = async (mode: 'light' | 'dark' | 'auto') => {
    try {
      // Mettre à jour ThemeProvider immédiatement (utilise 'auto')
      setThemeMode(mode);
      
      // Convertir 'auto' → 'system' pour SettingsContext
      const settingsTheme: 'light' | 'dark' | 'system' = mode === 'auto' ? 'system' : mode;
      
      // Sync theme setting with Settings context (persisté en AsyncStorage)
      await updateSettings({ theme: settingsTheme });
    } catch (error) {
      console.error('Error updating theme setting:', error);
      // Afficher une alerte en cas d'erreur de persistance
      Alert.alert(
        'Error',
        'Failed to save theme preference. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUpdateProfile = (changes: Partial<EditProfile>) => {
    // TODO: Implement profile update when backend API is ready
    // For now, this is a placeholder
    console.log('Profile update:', changes);
    setIsEditModalVisible(false);
  };

  const handleToggleNotifications = async (value: boolean) => {
    // TODO: Handle notifications separately when backend API is available
    // For now, this is a placeholder - notificationsEnabled is not part of core Settings
    console.log('Notifications toggle:', value);
  };

  const handleChangeLanguage = async (lang: 'fr' | 'en') => {
    try {
      await i18n.changeLanguage(lang);      // Apply new UI language immediately
      await updateSettings({ language: lang }); // Persist setting
    } catch (error) {
      console.error('Error updating language setting:', error);
      Alert.alert(
        'Error',
        'Failed to save language preference. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset will be handled in Suivi web app. This is a placeholder button for now.',
      [{ text: 'OK' }]
    );
  };

  const handleManageSessions = () => {
    Alert.alert(
      'Manage Sessions',
      'Session management coming soon.',
      [{ text: 'OK' }]
    );
  };

  // Version app mockée
  const appVersion = '1.0.0';

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

  // Render skeleton for loading state
  const renderProfileSkeleton = () => (
    <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.skeletonAvatar,
            {
              backgroundColor: isDark ? tokens.colors.surface.dark : tokens.colors.neutral.light,
            },
          ]}
        />
        <View style={styles.profileInfo}>
          <View
            style={[
              styles.skeletonLine,
              {
                backgroundColor: isDark ? tokens.colors.surface.dark : tokens.colors.neutral.light,
              },
            ]}
          />
          <View
            style={[
              styles.skeletonLine,
              {
                width: '70%',
                marginTop: tokens.spacing.xs,
                backgroundColor: isDark ? tokens.colors.surface.dark : tokens.colors.neutral.light,
              },
            ]}
          />
        </View>
      </View>
    </SuiviCard>
  );

  return (
    <Screen>
      <AppHeader />
      
      {/* Date and Title Header */}
      <View style={styles.dateTitleHeader}>
        <SuiviText variant="label" color="secondary" style={styles.dateText}>
          {dateHeader}
        </SuiviText>
        <SuiviText variant="h1" style={styles.titleText}>
          {t('more.title')}
        </SuiviText>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: tokens.spacing.lg }}
      >
        {/* User Profile Card */}
        <View style={styles.section}>
          {isLoading ? (
            renderProfileSkeleton()
          ) : profile ? (
            <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
              <View style={styles.profileHeader}>
                <UserAvatar
                  size={64}
                  imageSource={profile.avatarUrl}
                  fullName={profile.fullName || `${profile.firstName} ${profile.lastName}`.trim()}
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <SuiviText variant="h1" style={styles.profileName}>
                    {profile.firstName} {profile.lastName}
                  </SuiviText>
                  <SuiviText variant="body" color="secondary" style={styles.profileEmail}>
                    {profile.email}
                  </SuiviText>
                  <View style={styles.roleBadge}>
                    <SuiviText variant="caption" color="inverse">
                      {profile.role.toUpperCase()}
                    </SuiviText>
                  </View>
                </View>
              </View>
              <View style={styles.editButtonContainer}>
                <GradientActionButton
                  icon="account-edit"
                  label={t('profile.edit')}
                  onPress={() => setIsEditModalVisible(true)}
                />
              </View>
            </SuiviCard>
          ) : (
            <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
              <SuiviText variant="body" color="secondary">
                No profile data available
              </SuiviText>
            </SuiviCard>
          )}
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.themeSettings')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={styles.themeSelectorContainer}>
              <SegmentedControl
                variant="fullWidth"
                options={[
                  { key: 'light', label: t('more.theme.light') },
                  { key: 'dark', label: t('more.theme.dark') },
                  { key: 'system', label: t('more.theme.system') },
                ]}
                value={themeMode === 'auto' ? 'system' : themeMode}
                onChange={(newValue) => {
                  const mode = newValue === 'system' ? 'auto' : (newValue as 'light' | 'dark');
                  handleSetTheme(mode);
                }}
              />
            </View>
          </SuiviCard>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.notifications')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={styles.switchRow}>
              <SuiviText variant="body" color="primary">
                {t('more.pushNotifications')}
              </SuiviText>
              <Switch
                value={true} // TODO: Add notificationsEnabled to Settings context when needed
                onValueChange={handleToggleNotifications}
                color={tokens.colors.brand.primary}
              />
            </View>
          </SuiviCard>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.language')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
              <SegmentedControl
                options={[
                  { key: 'fr', label: 'FR' },
                  { key: 'en', label: 'EN' },
                ]}
                value={settings.language}
                onChange={(newValue) => handleChangeLanguage(newValue as 'fr' | 'en')}
              />
            </View>
          </SuiviCard>
        </View>

        {/* Organization Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.organization')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View
              style={[
                styles.infoRow,
                {
                  borderBottomColor: isDark
                    ? tokens.colors.border.darkMode.default
                    : tokens.colors.border.default,
                },
              ]}
            >
              <SuiviText variant="label" color="secondary">
                {t('more.name')}
              </SuiviText>
              <SuiviText variant="body" color="primary">
                {profile.organization.name || 'N/A'}
              </SuiviText>
            </View>
            <View
              style={[
                styles.infoRow,
                styles.infoRowLast,
              ]}
            >
              <SuiviText variant="label" color="secondary">
                {t('more.role')}
              </SuiviText>
              <SuiviText variant="body" color="primary">
                {profile.organization.role || 'N/A'}
              </SuiviText>
            </View>
            <SuiviText variant="caption" color="hint" style={styles.hint}>
              {t('more.workspaceSoon')}
            </SuiviText>
          </SuiviCard>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.security')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View style={styles.securityActions}>
              <GradientActionButton
                icon="key-variant"
                label={t('more.resetPassword')}
                onPress={handleResetPassword}
              />
              <GradientActionButton
                icon="shield-account"
                label={t('more.manageSessions')}
                onPress={handleManageSessions}
              />
            </View>
          </SuiviCard>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <SuiviText variant="h1" style={styles.sectionTitle}>
            {t('more.appInfo')}
          </SuiviText>
          <SuiviCard padding="md" elevation="card" variant="default" style={styles.card}>
            <View
              style={[
                styles.aboutRow,
                {
                  borderBottomColor: isDark
                    ? tokens.colors.border.darkMode.default
                    : tokens.colors.border.default,
                },
              ]}
            >
              <SuiviText variant="label" color="secondary">
                {t('more.appVersion')}
              </SuiviText>
              <SuiviText variant="body" color="primary">
                {appVersion}
              </SuiviText>
            </View>
            <View
              style={[
                styles.aboutRow,
                {
                  borderBottomColor: isDark
                    ? tokens.colors.border.darkMode.default
                    : tokens.colors.border.default,
                },
              ]}
            >
              <SuiviText variant="label" color="secondary">
                {t('more.designSystem')}
              </SuiviText>
              <SuiviText variant="body" color="primary">
                Suivi v1.0
              </SuiviText>
            </View>
            <View
              style={[
                styles.aboutRow,
                styles.aboutRowLast,
              ]}
            >
              <SuiviText variant="label" color="secondary">
                {t('more.apiStatus')}
              </SuiviText>
              <SuiviText variant="body" color="secondary">
                Mock mode (not connected to Suivi backend yet)
              </SuiviText>
            </View>
          </SuiviCard>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <SuiviButton
            title={t('more.signOut')}
            onPress={handleSignOut}
            variant="destructive"
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {profile && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          profile={profile}
          onSave={handleUpdateProfile}
        />
      )}
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
    marginBottom: tokens.spacing.md,
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
  profileEmail: {
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
  editButtonContainer: {
    marginTop: tokens.spacing.sm,
  },
  skeletonAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: tokens.spacing.md,
  },
  skeletonLine: {
    height: 16,
    width: '60%',
    borderRadius: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    marginBottom: tokens.spacing.xs,
  },
  hint: {
    marginTop: tokens.spacing.xs,
  },
  securityActions: {
    gap: tokens.spacing.sm,
  },
  themeSelectorContainer: {
    width: '100%', // Largeur pleine avec padding du parent
    marginTop: 12,
    alignItems: 'center', // Centrer le contenu
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: 1,
  },
  aboutRowLast: {
    borderBottomWidth: 0,
  },
});
