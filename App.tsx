import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { suiviTheme } from './theme';
import { ScreenContainer } from './components/layout';
import { 
  SuiviButton, 
  SuiviText, 
  SuiviCard, 
  SuiviChip,
  SuiviAvatar,
  SuiviSurface,
  SuiviLogoIcon
} from './components';
import { tokens } from './theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={suiviTheme}>
        <NavigationContainer>
          <ScreenContainer>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <SuiviLogoIcon variant="default" size={64} />
                <SuiviText variant="h1" style={styles.title}>
                  Suivi Mobile
                </SuiviText>
                <SuiviText variant="body2" color="secondary" style={styles.subtitle}>
                  Design System Preview
                </SuiviText>
              </View>

              <View style={styles.section}>
                <SuiviText variant="h3" style={styles.sectionTitle}>
                  Typography
                </SuiviText>
                <SuiviCard elevation={1} padding="md" style={styles.card}>
                  <SuiviText variant="h1" style={styles.textSample}>Heading 1</SuiviText>
                  <SuiviText variant="h2" style={styles.textSample}>Heading 2</SuiviText>
                  <SuiviText variant="h3" style={styles.textSample}>Heading 3</SuiviText>
                  <SuiviText variant="body1" style={styles.textSample}>Body 1 - Regular text</SuiviText>
                  <SuiviText variant="body2" color="secondary" style={styles.textSample}>
                    Body 2 - Secondary text
                  </SuiviText>
                  <SuiviText variant="caption" color="hint" style={styles.textSample}>
                    Caption - Hint text
                  </SuiviText>
                </SuiviCard>
              </View>

              <View style={styles.section}>
                <SuiviText variant="h3" style={styles.sectionTitle}>
                  Buttons
                </SuiviText>
                <SuiviCard elevation={1} padding="md" style={styles.card}>
                  <View style={styles.buttonRow}>
                    <SuiviButton variant="primary" size="medium" onPress={() => {}}>
                      Primary
                    </SuiviButton>
                    <SuiviButton variant="secondary" size="medium" onPress={() => {}}>
                      Secondary
                    </SuiviButton>
                  </View>
                  <View style={styles.buttonRow}>
                    <SuiviButton variant="outlined" size="medium" onPress={() => {}}>
                      Outlined
                    </SuiviButton>
                    <SuiviButton variant="text" size="medium" onPress={() => {}}>
                      Text
                    </SuiviButton>
                  </View>
                  <View style={styles.buttonRow}>
                    <SuiviButton size="small" onPress={() => {}}>Small</SuiviButton>
                    <SuiviButton size="large" onPress={() => {}}>Large</SuiviButton>
                  </View>
                </SuiviCard>
              </View>

              <View style={styles.section}>
                <SuiviText variant="h3" style={styles.sectionTitle}>
                  Components
                </SuiviText>
                <SuiviCard elevation={1} padding="md" style={styles.card}>
                  <View style={styles.componentRow}>
                    <SuiviAvatar size="medium" label="JD" />
                    <SuiviAvatar size="large" label="AB" />
                    <SuiviChip variant="flat">Tag</SuiviChip>
                    <SuiviChip variant="outlined">Filter</SuiviChip>
                  </View>
                </SuiviCard>
              </View>

              <View style={styles.section}>
                <SuiviText variant="h3" style={styles.sectionTitle}>
                  Surfaces
                </SuiviText>
                <View style={styles.surfaceRow}>
                  <SuiviSurface elevation={0} padding="md" style={styles.surface}>
                    <SuiviText variant="body2">Elevation 0</SuiviText>
                  </SuiviSurface>
                  <SuiviSurface elevation={1} padding="md" style={styles.surface}>
                    <SuiviText variant="body2">Elevation 1</SuiviText>
                  </SuiviSurface>
                  <SuiviSurface elevation={2} padding="md" style={styles.surface}>
                    <SuiviText variant="body2">Elevation 2</SuiviText>
                  </SuiviSurface>
                </View>
              </View>

              <View style={styles.footer}>
                <SuiviText variant="caption" color="hint" style={styles.footerText}>
                  Suivi Mobile Design System v1.0
                </SuiviText>
              </View>
            </ScrollView>
            <StatusBar style="auto" />
          </ScreenContainer>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  title: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    marginTop: tokens.spacing.xs,
  },
  section: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
  },
  card: {
    marginHorizontal: tokens.spacing.md,
  },
  textSample: {
    marginBottom: tokens.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  surfaceRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    flexWrap: 'wrap',
  },
  surface: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  footerText: {
    textAlign: 'center',
  },
});
