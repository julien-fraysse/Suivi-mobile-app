# Design System Mobile Suivi

## Introduction

Le design system de l'application mobile Suivi est basé sur **Material Design 3** via **React Native Paper**, avec des tokens de design personnalisés pour les couleurs de la marque Suivi.

## Principes de design

1. **Material Design 3** : Système de design Google, adapté pour mobile
2. **Tokens centralisés** : Toutes les valeurs de design (couleurs, spacing, radius, shadows, typography) sont centralisées dans `/theme/tokens.ts`
3. **Thème dynamique** : Support pour light et dark mode via React Native Paper
4. **Cohérence** : Tous les composants utilisent les mêmes tokens pour garantir une cohérence visuelle
5. **Pas de valeurs hardcodées** : Les styles bruts (hex, px, etc.) doivent être définis dans `tokens.ts` et non dans les composants

## Couleurs

### Couleurs de marque Suivi (Palette officielle)

| Nom | Hex | Description | Usage |
|-----|-----|-------------|-------|
| **Brand Primary** | `#4F5DFF` | Violet/Bleu principal Suivi | Actions principales, liens, éléments de marque |
| Brand Primary Light | `#B8C0FF` | Variante claire | Hover, états actifs |
| Brand Primary Dark | `#3F4ACC` | Variante foncée | Pressed, focus |
| **Accent Maize** | `#FDD447` | Jaune Maize Suivi | Accents, alertes importantes |
| Accent Maize Light | `#FFE89A` | Variante claire | |

### Couleurs sémantiques

| Nom | Hex | Description | Usage |
|-----|-----|-------------|-------|
| **Success** | `#4CAF50` | Vert de succès | Confirmations, succès |
| **Warning** | `#F9A825` | Jaune d'avertissement | Avertissements, alertes |
| **Error** | `#D32F2F` | Rouge d'erreur | Erreurs, actions destructives |
| **Info** | `#1976D2` | Bleu d'information | Messages informatifs |

### Couleurs neutres (Suivi)

| Nom | Hex | Description | Usage |
|-----|-----|-------------|-------|
| Neutral Dark | `#4F4A45` | Gris/Marron foncé Suivi | Texte principal |
| Neutral Medium | `#98928C` | Gris/Marron moyen Suivi | Texte secondaire, hints |
| Neutral Light | `#E8E8E8` | Gris clair | Bordures, séparateurs |
| Neutral Background | `#F4F2EE` | Sand Suivi | Fond d'écran principal, surfaces |

### Couleurs de surface

| Nom | Hex | Description | Usage |
|-----|-----|-------------|-------|
| **Background Default** | `#FFFFFF` | Fond principal (light mode) | Écrans, cards blanches |
| **Background Surface** | `#F4F2EE` | Sand Suivi (light mode) | Fond d'écran principal, surfaces |
| **Background Dark** | `#1A1A1A` | Fond principal (dark mode) | Écrans, surfaces principales |
| **Surface Default** | `#FFFFFF` | Surface principale (light mode) | Cards, boutons |
| Surface Variant | `#F4F2EE` | Sand Suivi (light mode) | Cards variant, fonds alternés |
| Surface Dark | `#1A1A1A` | Surface principale (dark mode) | Cards, boutons |
| Surface Dark Variant | `#252525` | Surface secondaire (dark mode) | Cards variant |

### Couleurs de texte

| Nom | Hex | Description | Usage |
|-----|-----|-------------|-------|
| **Text Primary** | `#4F4A45` | Texte principal (neutral.dark) | Corps de texte, titres |
| **Text Secondary** | `#98928C` | Texte secondaire (neutral.medium) | Descriptions, sous-titres |
| Text Disabled | `#98928C` | Texte désactivé (neutral.medium) | Éléments désactivés |
| Text Hint | `#98928C` | Texte hint (neutral.medium) | Placeholders, hints |
| **Text OnPrimary** | `#FFFFFF` | Texte sur primary | Texte sur bouton primary, badges |

### Utilisation dans le thème React Native Paper

Les couleurs sont mappées dans `/theme/paper-theme.ts` pour être utilisées avec React Native Paper :

```typescript
colors: {
  primary: colors.primary,              // #0066FF
  onPrimary: colors.text.inverse,       // #FFFFFF
  primaryContainer: colors.primaryLight, // #3385FF
  onPrimaryContainer: colors.primaryDark, // #0052CC
  
  secondary: colors.secondary,          // #00C853
  onSecondary: colors.text.inverse,     // #FFFFFF
  
  error: colors.error,                  // #D32F2F
  onError: colors.text.inverse,         // #FFFFFF
  
  background: colors.background.default, // #FFFFFF (light) / #121212 (dark)
  onBackground: colors.text.primary,     // #212121 (light) / #FFFFFF (dark)
  
  surface: colors.surface.default,      // #FFFFFF (light) / #1E1E1E (dark)
  onSurface: colors.text.primary,       // #212121 (light) / #FFFFFF (dark)
  
  // ... etc
}
```

**Accès dans les composants** :
```typescript
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.primary }}>
      <Text style={{ color: theme.colors.onPrimary }}>Texte</Text>
    </View>
  );
};
```

## Typographies

### Familles de polices

| Nom | Famille | Usage |
|-----|---------|-------|
| **Primary** | `Inter` | Police principale pour tout le texte |
| **Mono** | `IBM Plex Mono` | Code, données techniques |

### Poids de police

| Nom | Valeur | Usage |
|-----|--------|-------|
| Thin | `100` | Rarement utilisé |
| Light | `300` | Textes légers |
| **Regular** | `400` | Corps de texte standard |
| **Medium** | `500` | Titres, labels |
| Semibold | `600` | Titres importants |
| **Bold** | `700` | Titres principaux |

### Tailles de police (Material Design 3 Typography Scale)

| Nom | Taille | Line Height | Poids | Usage |
|-----|--------|-------------|-------|-------|
| **H1** | `57px` | `64px` | Regular | Écrans d'accueil, titres de section |
| **H2** | `45px` | `52px` | Regular | Titres de page principaux |
| **H3** | `36px` | `44px` | Regular | Titres de section |
| **H4** | `32px` | `40px` | Regular | Titres de sous-section |
| **H5** | `28px` | `36px` | Regular | Titres de card |
| **H6** | `24px` | `32px` | Regular | Titres de liste |
| **Body1** | `16px` | `24px` | Regular | Corps de texte principal |
| **Body2** | `14px` | `20px` | Regular | Corps de texte secondaire |
| **Subtitle1** | `16px` | `24px` | Regular | Sous-titres |
| **Subtitle2** | `14px` | `20px` | Medium | Sous-titres secondaires |
| **Button** | `14px` | `20px` | Medium | Boutons, actions |
| **Caption** | `12px` | `16px` | Regular | Captions, métadonnées |
| **Overline** | `10px` | `16px` | Medium | Labels, overline (UPPERCASE) |

### Variantes de police (React Native Paper)

Le thème expose des variantes MD3 pour React Native Paper :

```typescript
// Dans /theme/paper-theme.ts
export const suiviFonts = {
  // Base font weights
  regular: { fontFamily: 'Inter', fontWeight: '400' },
  medium: { fontFamily: 'Inter', fontWeight: '500' },
  light: { fontFamily: 'Inter', fontWeight: '300' },
  thin: { fontFamily: 'Inter', fontWeight: '100' },
  
  // Material Design 3 Typography Variants
  bodySmall: { fontFamily: 'Inter', fontWeight: '400' },
  bodyMedium: { fontFamily: 'Inter', fontWeight: '400' },
  bodyLarge: { fontFamily: 'Inter', fontWeight: '400' },
  
  labelSmall: { fontFamily: 'Inter', fontWeight: '500' },
  labelMedium: { fontFamily: 'Inter', fontWeight: '500' },
  labelLarge: { fontFamily: 'Inter', fontWeight: '500' },
  
  titleSmall: { fontFamily: 'Inter', fontWeight: '500' },
  titleMedium: { fontFamily: 'Inter', fontWeight: '500' },
  titleLarge: { fontFamily: 'Inter', fontWeight: '500' },
  
  // ... etc
};
```

**Accès via tokens** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  title: {
    fontSize: tokens.typography.h4.fontSize,    // 32
    lineHeight: tokens.typography.h4.lineHeight, // 40
    fontWeight: tokens.typography.h4.fontWeight, // '400'
  },
  body: {
    fontSize: tokens.typography.body1.fontSize,  // 16
    lineHeight: tokens.typography.body1.lineHeight, // 24
  },
});
```

## Spacing (Espacements)

### Échelle de spacing

Base unit : **4px**

| Nom | Valeur | Usage |
|-----|--------|-------|
| **XS** | `4px` | Très petits espacements |
| **SM** | `8px` | Petits espacements (gap entre éléments proches) |
| **MD** | `16px` | Espacement standard (padding de screen, gap entre sections) |
| **LG** | `24px` | Grands espacements (margin entre sections) |
| **XL** | `32px` | Très grands espacements (margin entre grandes sections) |
| **XXL** | `48px` | Espacements extra-larges |
| **XXXL** | `64px` | Espacements maximum |

**Utilisation** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,    // 16px
    gap: tokens.spacing.sm,        // 8px
    marginBottom: tokens.spacing.lg, // 24px
  },
});
```

## Border Radius (Rayon de bordure)

| Nom | Valeur | Usage |
|-----|--------|-------|
| **XS** | `6px` | Petits éléments (badges, chips) |
| **SM** | `12px` | Éléments standards (boutons, cards) |
| **MD** | `20px` | Grands éléments (cards larges) |
| **LG** | `24px` | Très grands éléments |
| **XL** | `32px` | Éléments extra-larges |
| **Round** | `9999px` | Cercle parfait (avatars, badges ronds) |

**Thème React Native Paper** :
- `roundness: radius.sm` (12px) - Utilisé pour tous les composants Paper

**Utilisation** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.radius.md,  // 20px
  },
  avatar: {
    borderRadius: tokens.radius.round, // 9999px (cercle)
  },
});
```

## Elevation (Élévation)

### Niveaux d'élévation Material Design 3

| Nom | Valeur | Usage |
|-----|--------|-------|
| **Level 0** | `0` | Surfaces plates (écrans) |
| **Level 1** | `1` | Cards légères, boutons |
| **Level 2** | `2` | Cards standards |
| **Level 3** | `4` | Cards importantes |
| **Level 4** | `8` | Modals, sheets |
| **Level 5** | `12` | Dialogs, popovers |

**Shadows (pour les plateformes qui ne supportent pas elevation)** :

Chaque niveau d'élévation a un shadow associé dans `tokens.shadows` :

```typescript
shadows: {
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  // ... etc
}
```

**Utilisation** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  card: {
    ...tokens.shadows.level2,  // Applique le shadow level 2
  },
});
```

## Tokens

**Fichier** : `/theme/tokens.ts`

Tous les tokens de design sont centralisés dans `tokens.ts`. Les tokens sont organisés par catégorie :

### Structure des tokens

```typescript
export const tokens = {
  colors: {
    brand: { primary, primaryLight, primaryDark, secondary, ... },
    text: { primary, secondary, disabled, hint, inverse },
    // ... etc
  },
  spacing: { xs, sm, md, lg, xl, xxl, xxxl },
  radius: { xs, sm, md, lg, xl, round },
  typography: {
    h1, h2, h3, h4, h5, h6,
    body1, body2, caption, button, ...
  },
  elevation: { level0, level1, level2, level3, level4, level5 },
  shadows: { level0, level1, level2, level3, level4, level5 },
  animation: { fast, normal, slow },
  zIndex: { dropdown, sticky, fixed, modalBackdrop, modal, ... },
};
```

### Accès aux tokens

```typescript
import { tokens } from '../theme';

// Couleurs
tokens.colors.brand.primary      // #0066FF
tokens.colors.text.primary       // #212121

// Spacing
tokens.spacing.md                // 16px
tokens.spacing.lg                // 24px

// Radius
tokens.radius.md                 // 20px
tokens.radius.round              // 9999px

// Typography
tokens.typography.h4.fontSize    // 32
tokens.typography.body1.fontSize // 16

// Shadows
tokens.shadows.level2            // { shadowColor, shadowOffset, ... }
```

**Règle importante** : Tous les styles bruts (hex, px, etc.) doivent être définis dans `tokens.ts` et non dans les composants, sauf exception rare.

## Composants UI de base

**Dossier** : `/src/components/ui/`

Les composants UI de base sont des composants réutilisables du UI Kit Suivi qui s'appuient sur les tokens pour garantir une cohérence visuelle.

### SuiviButton

**Fichier** : `src/components/ui/SuiviButton.tsx`

**Rôle** : Bouton principal du UI Kit Suivi pour toutes les actions importantes.

**Props principales** :

```typescript
interface SuiviButtonProps {
  title: string;           // Texte du bouton
  onPress: () => void;     // Callback au clic
  variant?: 'primary' | 'ghost' | 'destructive';  // Variante (par défaut: 'primary')
  disabled?: boolean;      // État désactivé
  loading?: boolean;       // État de chargement
  style?: ViewStyle;       // Style personnalisé
  textStyle?: TextStyle;   // Style du texte
  fullWidth?: boolean;     // Pleine largeur
}
```

**Variantes** :
- **primary** : Bouton principal (fond brand.primary `#005CE6`, texte onPrimary blanc)
- **ghost** : Bouton transparent (fond transparent, texte primary, bordure primary)
- **destructive** : Bouton destructif (fond error `#D32F2F`, texte onPrimary blanc)

**Exemple d'utilisation** :

```typescript
import { SuiviButton } from '../components/ui/SuiviButton';

<SuiviButton
  title="Sign In"
  onPress={handleSignIn}
  variant="primary"
  loading={isLoading}
/>

<SuiviButton
  title="Cancel"
  onPress={handleCancel}
  variant="ghost"
/>

<SuiviButton
  title="Delete"
  onPress={handleDelete}
  variant="destructive"
  fullWidth
/>
```

**Tokens utilisés (EXCLUSIVEMENT)** :
- Couleurs : `tokens.colors.brand.primary` (`#005CE6`), `tokens.colors.error` (`#D32F2F`), `tokens.colors.text.onPrimary` (`#FFFFFF`)
- Spacing : `tokens.spacing.md` (16px), `tokens.spacing.lg` (24px)
- Radius : `tokens.radius.md` (12px)
- Typography : `tokens.typography.button` (fontSize: 14, fontWeight: 600)

**Variantes** :
- `primary` : Fond `theme.colors.primary` (`#005CE6` via theme Suivi), texte `theme.colors.onPrimary` (blanc)
- `ghost` : Fond transparent, bordure `theme.colors.primary`, texte `theme.colors.primary`
- `destructive` : Fond `theme.colors.error` (`#D32F2F` via theme Suivi), texte `theme.colors.onPrimary` (blanc)

**Utilisation du thème** : `SuiviButton` utilise `useTheme()` de React Native Paper pour accéder à `theme.colors.primary` et `theme.colors.onPrimary`. Cela garantit que le bouton reste réactif au thème Paper (light/dark) tout en utilisant les couleurs Suivi injectées via `paper-theme.ts`.

**Exemple concret dans HomeScreen** :
```typescript
// Bouton principal - Fond bleu Suivi (#005CE6 via theme.colors.primary)
<SuiviButton title="Create Task" onPress={() => {}} variant="primary" fullWidth />

// Bouton ghost - Bordure et texte bleu Suivi (#005CE6 via theme.colors.primary)
<SuiviButton title="View All" onPress={() => {}} variant="ghost" fullWidth />

// Bouton destructif - Fond rouge (#D32F2F via theme.colors.error)
<SuiviButton title="Clear All" onPress={() => {}} variant="destructive" fullWidth />
```
- Bouton `primary` : `theme.colors.primary` = `tokens.colors.brand.primary` (`#005CE6`), texte `theme.colors.onPrimary` (blanc)
- Bouton `ghost` : Fond transparent, bordure `theme.colors.primary` (`#005CE6`), texte `theme.colors.primary`
- Bouton `destructive` : `theme.colors.error` = `tokens.colors.error` (`#D32F2F`), texte `theme.colors.onPrimary` (blanc)

**Intégré dans** : `HomeScreen` (section Actions - **100% SuiviButton, aucun Button de Paper**), `MoreScreen` (variant: destructive)

### FilterChip

**Fichier** : `src/components/ui/FilterChip.tsx`

**Rôle** : Chip réutilisable pour les filtres (ex: All, Open, Late, Done).

**Props principales** :

```typescript
interface FilterChipProps {
  label: string;           // Texte du chip
  selected?: boolean;      // État sélectionné (par défaut: false)
  onPress: () => void;     // Callback au clic
  disabled?: boolean;      // État désactivé
  style?: ViewStyle;       // Style personnalisé
  textStyle?: TextStyle;   // Style du texte
}
```

**États** :
- **default** : Fond surface, texte onSurface, bordure outline
- **selected** : Fond primary, texte onPrimary, bordure primary

**Exemple d'utilisation** :

```typescript
import { FilterChip } from '../components/ui/FilterChip';

<FilterChip
  label="All"
  selected={filter === 'all'}
  onPress={() => setFilter('all')}
/>

<FilterChip
  label="Open"
  selected={filter === 'open'}
  onPress={() => setFilter('open')}
/>
```

**Tokens utilisés (EXCLUSIVEMENT)** :
- Couleurs : `tokens.colors.brand.primary` (`#005CE6`), `tokens.colors.surface.default` (`#FFFFFF`), `tokens.colors.border.default` (`#E0E0E0`), `tokens.colors.text.primary` (`#1A1A1A`), `tokens.colors.text.onPrimary` (`#FFFFFF`)
- Spacing : `tokens.spacing.sm` (8px), `tokens.spacing.md` (16px)
- Radius : `tokens.radius.md` (12px)
- Typography : `tokens.typography.body2` (fontSize: 14, lineHeight: 20, fontWeight: 400)

**États** :
- `selected` : Fond `tokens.colors.brand.primary` (`#005CE6`), texte `tokens.colors.text.onPrimary` (blanc), bordure `tokens.colors.brand.primary`
- `default` : Fond `tokens.colors.background.surface` (`#FAFAFA`), texte `tokens.colors.text.primary` (`#1A1A1A`), bordure `tokens.colors.neutral[200]` (`#EEEEEE`)

**Exemple concret dans HomeScreen** :
```typescript
// Quick Filters - 100% FilterChip, aucun Chip de Paper
<FilterChip
  label="All"
  selected={selectedChip === 'all'}
  onPress={() => setSelectedChip(selectedChip === 'all' ? null : 'all')}
/>
<FilterChip label="Active" selected={selectedChip === 'active'} onPress={() => setSelectedChip('active')} />
<FilterChip label="Done" selected={selectedChip === 'done'} onPress={() => setSelectedChip('done')} />
```
- Chip sélectionnée : Fond `tokens.colors.brand.primary` (`#005CE6`), texte `tokens.colors.text.onPrimary` (blanc)
- Chip non sélectionnée : Fond `tokens.colors.background.surface` (`#FAFAFA`), bordure `tokens.colors.neutral[200]` (`#EEEEEE`), texte `tokens.colors.text.primary` (`#1A1A1A`)

**Intégré dans** : `HomeScreen` (Quick Filters - **100% FilterChip, aucun Chip de Paper**, chip "All" sélectionnée par défaut), `MyTasksScreen` (filter bar)

### SuiviCard

**Fichier** : `src/components/ui/SuiviCard.tsx`

**Rôle** : Composant Card du UI Kit Suivi, réutilisable pour les Tasks, sections Home, etc.

**Props principales** :

```typescript
interface SuiviCardProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';  // Padding (par défaut: 'md')
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';  // Élévation/shadow (par défaut: 'md')
  style?: ViewStyle;
  onPress?: () => void;     // Optionnel : rend la card pressable
  variant?: 'default' | 'outlined';  // Variante (par défaut: 'default')
}
```

**Variantes** :
- **default** : Card avec shadow (elevation)
- **outlined** : Card avec border (pas de shadow)

**Exemple d'utilisation** :

```typescript
import { SuiviCard } from '../components/ui/SuiviCard';

// Card simple avec shadow
<SuiviCard padding="md" elevation="md">
  <Text>Content</Text>
</SuiviCard>

// Card pressable outlined
<SuiviCard
  padding="md"
  elevation="sm"
  variant="outlined"
  onPress={() => handlePress()}
>
  <Text>Pressable content</Text>
</SuiviCard>
```

**Tokens utilisés (EXCLUSIVEMENT)** :
- Couleurs : `tokens.colors.surface.default` (`#FFFFFF`), `tokens.colors.border.default` (`#E0E0E0`)
- Spacing : `tokens.spacing` (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px, xxxl: 64px)
- Radius : `tokens.radius.md` (12px)
- Shadows : `tokens.shadows` (none, sm, md, lg, xl)

**Variantes** :
- `default` : Fond `tokens.colors.background.surface` (`#FAFAFA`), avec shadow (elevation)
- `outlined` : Fond `tokens.colors.background.surface` (`#FAFAFA`), bordure `tokens.colors.border.default` (`#E0E0E0`), pas de shadow

**Exemple concret dans HomeScreen** :
```typescript
// Recent Activity - 100% SuiviCard, aucun Card de Paper
<SuiviCard padding="md" elevation="sm" variant="default">
  <Text style={{ color: tokens.colors.text.primary }}>Task Completed</Text>
  <Text style={{ color: tokens.colors.text.secondary }}>You've completed 5 tasks today. Great work!</Text>
</SuiviCard>

<SuiviCard padding="md" elevation="md" variant="outlined">
  <Text style={{ color: tokens.colors.text.primary }}>Upcoming Deadline</Text>
  <Text style={{ color: tokens.colors.text.secondary }}>3 tasks due tomorrow. Stay focused!</Text>
</SuiviCard>
```
- Cards utilisent `tokens.colors.background.surface` (`#FAFAFA`) pour un fond légèrement grisé
- Shadow (`tokens.shadows.sm`/`md`) et radius (`tokens.radius.md`) depuis les tokens
- Variant `default` : Shadow via `tokens.shadows`
- Variant `outlined` : Bordure `tokens.colors.border.default` (`#E0E0E0`)

**Intégré dans** : `HomeScreen` (Recent Activity - **100% SuiviCard, aucun Card de Paper**, variants: default et outlined), `MyTasksScreen` (task items, variant: outlined)

## Composants UI communs

### Composants Suivi (dans `/components/ui/`)

Tous les composants sont basés sur React Native Paper et utilisent le thème Suivi :

| Composant | Fichier | Usage |
|-----------|---------|-------|
| **SuiviButton** | `SuiviButton.tsx` | Bouton avec variants (primary, secondary, outlined, text) |
| **SuiviCard** | `SuiviCard.tsx` | Card avec elevation support |
| **SuiviText** | `SuiviText.tsx` | Typography component avec variants MD3 |
| **SuiviTextInput** | `SuiviTextInput.tsx` | Input avec variants (outlined, flat) |
| **SuiviAvatar** | `SuiviAvatar.tsx` | Avatar avec tailles (small, medium, large) |
| **SuiviChip** | `SuiviChip.tsx` | Chip avec variants (flat, outlined) |
| **SuiviSurface** | `SuiviSurface.tsx` | Surface avec elevation |
| **SuiviListItem** | `SuiviListItem.tsx` | List item avec variants |
| **SuiviAppBar** | `SuiviAppBar.tsx` | App bar avec elevation |
| **SuiviDivider** | `SuiviDivider.tsx` | Divider avec variants (fullWidth, inset) |

### Composants Layout (dans `/components/layout/`)

| Composant | Fichier | Usage |
|-----------|---------|-------|
| **ScreenContainer** | `components/layout/ScreenContainer.tsx` | Container de base avec SafeAreaView, padding, et scroll optionnel |
| **Screen** | `src/components/Screen.tsx` | Wrapper standardisé pour tous les écrans (utilise ScreenContainer) |
| **ScreenHeader** | `src/components/layout/ScreenHeader.tsx` | En-tête standardisé avec titre, sous-titre, et actions (back, right) |

Voir la section [Layout & Structure d'écran](#layout--structure décran) ci-dessous pour les détails complets.

## Layout & Structure d'écran

### ScreenContainer

**Fichier** : `components/layout/ScreenContainer.tsx`

**Rôle** : Conteneur de base pour tous les écrans. Gère SafeAreaView, padding cohérent, background, et optionnellement le scroll.

**Props principales** :

```typescript
interface ScreenContainerProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Par défaut: 'md'
  style?: ViewStyle;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];  // Par défaut: ['top', 'bottom']
  scrollable?: boolean;  // Active ScrollView si true
  contentContainerStyle?: ViewStyle;  // Style pour le contenu scrollable
}
```

**Exemple d'utilisation** :

```typescript
// Écran simple sans scroll
<ScreenContainer padding="md">
  <View>...</View>
</ScreenContainer>

// Écran avec scroll
<ScreenContainer scrollable padding="lg">
  <View>...</View>
</ScreenContainer>
```

**Caractéristiques** :
- Utilise `SafeAreaView` de `react-native-safe-area-context` pour gérer les zones sécurisées
- Padding cohérent basé sur les tokens de spacing
- Background dynamique basé sur le thème (light/dark)
- Support du scroll via `ScrollView` si `scrollable={true}`

### Screen

**Fichier** : `src/components/Screen.tsx`

**Rôle** : Wrapper standardisé pour tous les écrans. Utilise `ScreenContainer` avec des props simplifiées.

**Props principales** :

```typescript
interface ScreenProps {
  children: React.ReactNode;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Par défaut: 'md'
  style?: ViewStyle;
  scrollable?: boolean;  // Active ScrollView si true
  contentContainerStyle?: ViewStyle;  // Style pour le contenu scrollable
}
```

**Exemple d'utilisation** :

```typescript
// Écran simple
<Screen>
  <ScreenHeader title="Home" />
  <View>...</View>
</Screen>

// Écran avec scroll
<Screen scrollable>
  <ScreenHeader title="Details" />
  <View>...</View>
</Screen>
```

**Utilisation dans tous les écrans** : Tous les écrans doivent utiliser `Screen` comme wrapper principal.

### ScreenHeader

**Fichier** : `src/components/layout/ScreenHeader.tsx`

**Rôle** : En-tête standardisé pour tous les écrans. Affiche un titre, optionnellement un sous-titre, et des actions (back, right).

**Props principales** :

```typescript
interface ScreenHeaderProps {
  title: string;           // Titre principal (requis)
  subtitle?: string;       // Sous-titre optionnel
  onBack?: () => void;     // Callback pour le bouton back
  rightAction?: React.ReactNode;  // Action à droite (bouton, icône, etc.)
  showBackButton?: boolean;  // Afficher le bouton back (par défaut: false)
}
```

**Exemple d'utilisation** :

```typescript
// Header simple
<ScreenHeader title="Home" subtitle="Welcome to Suivi" />

// Header avec bouton back
<ScreenHeader
  title="Task Details"
  subtitle="View and edit task"
  showBackButton
  onBack={() => navigation.goBack()}
/>

// Header avec action à droite
<ScreenHeader
  title="My Tasks"
  rightAction={
    <TouchableOpacity onPress={handleAdd}>
      <MaterialCommunityIcons name="plus" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  }
/>
```

**Caractéristiques** :
- Typographie standardisée (h4 pour le titre, body2 pour le sous-titre)
- Couleurs dynamiques basées sur le thème
- Support du bouton back avec icône MaterialCommunityIcons
- Flex layout pour gérer les actions à droite

**Typographie utilisée** :
- **Titre** : `tokens.typography.h4` (32px, bold)
- **Sous-titre** : `tokens.typography.body2` (14px, regular)

**Règle d'utilisation** : Tous les écrans qui nécessitent un titre doivent utiliser `ScreenHeader` au lieu de créer un header custom.

### PrimaryButton

**Fichier** : `src/components/ui/PrimaryButton.tsx`

**Rôle** : Bouton principal réutilisable pour toutes les actions importantes.

**Props principales** :

```typescript
interface PrimaryButtonProps {
  title: string;           // Texte du bouton
  onPress: () => void;     // Callback au clic
  variant?: 'primary' | 'secondary' | 'danger';  // Variante (par défaut: 'primary')
  disabled?: boolean;      // État désactivé
  loading?: boolean;       // État de chargement (affiche ActivityIndicator)
  style?: ViewStyle;       // Style personnalisé
  textStyle?: TextStyle;   // Style du texte
  fullWidth?: boolean;     // Pleine largeur
}
```

**Exemple d'utilisation** :

```typescript
// Bouton primaire
<PrimaryButton
  title="Sign In"
  onPress={handleSignIn}
  loading={isLoading}
/>

// Bouton danger
<PrimaryButton
  title="Sign Out"
  onPress={handleSignOut}
  variant="danger"
  fullWidth
/>

// Bouton désactivé
<PrimaryButton
  title="Submit"
  onPress={handleSubmit}
  disabled={!isValid}
/>
```

**Variantes** :
- **primary** : Couleur primaire (`theme.colors.primary`)
- **secondary** : Couleur secondaire (`theme.colors.secondary`)
- **danger** : Couleur d'erreur (`theme.colors.error`)

**Caractéristiques** :
- Typographie standardisée (button font size et weight)
- États disabled et loading gérés automatiquement
- Padding et border-radius cohérents basés sur les tokens
- Support de la pleine largeur

**Typographie utilisée** :
- **Texte** : `tokens.typography.button` (14px, medium weight)

### Composants React Native Paper

Tous les composants de React Native Paper sont disponibles et utilisent automatiquement le thème Suivi :

- `Button`, `TextInput`, `Card`, `Avatar`, `Chip`, `Surface`, `List`, `Appbar`, etc.

**Utilisation** :
```typescript
import { Button, TextInput } from 'react-native-paper';

<Button mode="contained">Click me</Button>
<TextInput mode="outlined" label="Email" />
```

## Theme & Theming

**Règle importante** : 
- Les composants UI Suivi (`SuiviButton`, `FilterChip`, `SuiviCard`) peuvent utiliser soit `tokens.colors.*` directement, soit `theme.colors` via `useTheme()` pour rester réactifs au thème Paper.
- `SuiviButton` utilise `theme.colors.primary` et `theme.colors.onPrimary` pour rester réactif au thème (light/dark).
- `FilterChip` et `SuiviCard` utilisent `tokens.colors.*` directement pour une cohérence garantie.
- Le `ThemeProvider` injecte les couleurs Suivi dans React Native Paper via `paper-theme.ts` pour que les composants Paper utilisent les bonnes couleurs.

### ThemeProvider

**Fichier** : `src/theme/ThemeProvider.tsx`

**Rôle** : Provider central qui encapsule `PaperProvider` et injecte les couleurs Suivi dans React Native Paper.

**Injection des couleurs Suivi** :
- `theme.colors.primary` = `tokens.colors.brand.primary` (`#005CE6`)
- `theme.colors.secondary` = `tokens.colors.accent.maize` (`#FDD447`)
- `theme.colors.background` = `tokens.colors.background.default` (`#FFFFFF`)
- `theme.colors.surface` = `tokens.colors.background.surface` (`#FAFAFA`)
- `theme.colors.error` = `tokens.colors.error` (`#D32F2F`)
- Etc. (voir `theme/paper-theme.ts`)

**Fichier de configuration** : `theme/paper-theme.ts` définit `suiviLightTheme` et `suiviDarkTheme` qui mappent les tokens Suivi vers les couleurs Material Design 3 de React Native Paper.

### Personnalisation de `suiviLightTheme` et `suiviDarkTheme`

**Fichier** : `theme/paper-theme.ts`

Les thèmes `suiviLightTheme` et `suiviDarkTheme` sont entièrement basés sur les tokens Suivi depuis `src/theme/tokens.ts`. **Aucune couleur MD3 générique n'est utilisée** - toutes les couleurs proviennent des tokens Suivi.

#### Mapping des tokens vers le thème Paper

**Light Theme (`suiviLightTheme`)** :
- `colors.primary` = `tokens.colors.brand.primary` (`#005CE6`) - Couleur primaire Suivi
- `colors.primaryContainer` = `tokens.colors.brand.primaryLight` (`#4D8FFF`)
- `colors.secondary` = `tokens.colors.accent.maize` (`#FDD447`) - Accent Maize
- `colors.background` = `tokens.colors.background.default` (`#FFFFFF`) - Fond blanc
- `colors.surface` = `tokens.colors.background.surface` (`#FAFAFA`) - Surface grisée
- `colors.onPrimary` = `tokens.colors.text.onPrimary` (`#FFFFFF`) - Texte blanc sur primary
- `colors.onBackground` = `tokens.colors.text.primary` (`#1A1A1A`) - Texte sombre
- `colors.onSurface` = `tokens.colors.text.primary` (`#1A1A1A`) - Texte sombre
- `colors.error` = `tokens.colors.error` (`#D32F2F`) - Erreur Suivi
- `colors.outline` = `tokens.colors.border.default` (`#E0E0E0`) - Bordures
- `roundness` = `tokens.radius.sm` (12px)

**Dark Theme (`suiviDarkTheme`)** :
- `colors.primary` = `tokens.colors.brand.primaryLight` (`#4D8FFF`) - Version claire pour dark
- `colors.primaryContainer` = `tokens.colors.brand.primaryDark` (`#003FA3`)
- `colors.secondary` = `tokens.colors.accent.maizeLight` (`#FFE89A`) - Version claire pour dark
- `colors.background` = `tokens.colors.background.dark` (`#121212`) - Fond sombre
- `colors.surface` = `tokens.colors.surface.dark` (`#1E1E1E`) - Surface sombre
- `colors.onPrimary` = `tokens.colors.brand.primaryDark` (`#003FA3`) - Texte sombre sur primary clair
- `colors.onBackground` = `tokens.colors.text.onPrimary` (`#FFFFFF`) - Texte blanc
- `colors.onSurface` = `tokens.colors.text.onPrimary` (`#FFFFFF`) - Texte blanc
- `colors.error` = `tokens.colors.error` (`#D32F2F`) - Même couleur d'erreur
- `colors.outline` = `tokens.colors.border.dark` (`#424242`) - Bordures sombres
- `roundness` = `tokens.radius.sm` (12px)

**Exemple concret** :
```typescript
// Dans paper-theme.ts
export const suiviLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors, // Structure MD3 mais valeurs Suivi
    primary: colors.brand.primary, // #005CE6 (token Suivi)
    secondary: colors.accent.maize, // #FDD447 (token Suivi)
    background: colors.background.default, // #FFFFFF (token Suivi)
    surface: colors.background.surface, // #FAFAFA (token Suivi)
    error: colors.error, // #D32F2F (token Suivi)
    // ... toutes les autres couleurs proviennent des tokens
  },
  roundness: radius.sm, // 12px (token Suivi)
};
```

**Important** : Bien que le thème utilise `...MD3LightTheme.colors` pour la structure, **toutes les valeurs sont remplacées par les tokens Suivi**. Aucune couleur MD3 par défaut n'est conservée.

### ThemeProvider

**Fichier** : `/src/theme/ThemeProvider.tsx`

Le `ThemeProvider` est le provider central pour gérer le thème de l'application. Il encapsule `PaperProvider` de React Native Paper et gère le mode light/dark/auto.

**Rôle** :
- Encapsule `PaperProvider` (React Native Paper)
- Gère le mode de thème (light, dark, auto)
- Injecte les tokens Suivi dans le thème Paper
- Expose un contexte pour changer le mode de thème si nécessaire

**Props** :

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: 'light' | 'dark' | 'auto';  // Par défaut: 'auto'
}
```

**Exemple d'utilisation** :

```typescript
import { ThemeProvider } from './theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider initialMode="auto">
      {/* App */}
    </ThemeProvider>
  );
}
```

### Modes de thème

Le `ThemeProvider` supporte 3 modes :

1. **`'auto'`** (par défaut) : Suit automatiquement le mode système (light/dark)
   - Utilise `useColorScheme()` de React Native pour détecter le mode système
   - Change automatiquement quand l'utilisateur change le thème système

2. **`'light'`** : Force le thème clair
   - Utilise toujours `suiviLightTheme`

3. **`'dark'`** : Force le thème sombre
   - Utilise toujours `suiviDarkTheme`

### Light Theme vs Dark Theme

**Light Theme** (`suiviLightTheme`) :
- Background : `#FFFFFF` (blanc)
- Surface : `#FFFFFF` (blanc)
- Texte : `#212121` (gris foncé)
- Couleurs primaires : Bleu Suivi (#0066FF)

**Dark Theme** (`suiviDarkTheme`) :
- Background : `#121212` (noir)
- Surface : `#1E1E1E` (gris très foncé)
- Texte : `#FFFFFF` (blanc)
- Couleurs primaires : Bleu Suivi clair (#3385FF)

**Les deux thèmes** :
- Utilisent les mêmes tokens de spacing, radius, typography
- S'appuient sur les tokens de couleurs Suivi
- Sont automatiquement gérés par le `ThemeProvider`

### Utilisation dans les composants

#### 1. Utiliser `useTheme()` de React Native Paper

**Recommandé** : Utiliser `useTheme()` pour les couleurs dynamiques (light/dark).

```typescript
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Texte</Text>
    </View>
  );
};
```

**Couleurs disponibles** :
- `theme.colors.primary` : Couleur primaire (s'adapte au thème)
- `theme.colors.background` : Fond principal (blanc en light, noir en dark)
- `theme.colors.surface` : Surface principale (blanc en light, gris foncé en dark)
- `theme.colors.onSurface` : Texte sur surface (gris foncé en light, blanc en dark)
- `theme.colors.onSurfaceVariant` : Texte secondaire
- `theme.colors.outline` : Bordure
- `theme.colors.error` : Couleur d'erreur
- etc.

#### 2. Utiliser `useThemeMode()` pour changer le thème

**Pour changer le mode de thème** :

```typescript
import { useThemeMode } from '../theme/ThemeProvider';

const SettingsScreen = () => {
  const { themeMode, setThemeMode, isDark } = useThemeMode();
  
  return (
    <View>
      <Button onPress={() => setThemeMode('light')}>
        Light Mode
      </Button>
      <Button onPress={() => setThemeMode('dark')}>
        Dark Mode
      </Button>
      <Button onPress={() => setThemeMode('auto')}>
        Auto (System)
      </Button>
    </View>
  );
};
```

**Note** : Pour le MVP, la gestion du changement de thème peut être mockée. Une vraie UX de choix de thème (sauvegarde dans AsyncStorage/SecureStore) viendra plus tard.

#### 3. Utiliser les tokens directement

**Pour les valeurs statiques** (spacing, radius, typography) :

```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,      // 16px (toujours identique)
    borderRadius: tokens.radius.md,   // 20px (toujours identique)
    fontSize: tokens.typography.h4.fontSize,  // 32 (toujours identique)
  },
});
```

**Important** : Les couleurs doivent être récupérées via `useTheme()` pour s'adapter au mode light/dark, sauf pour les couleurs de marque Suivi spécifiques qui ne changent pas.

### Intégration dans l'entrée de l'app

**Fichier** : `/src/App.tsx`

```typescript
import { ThemeProvider } from './theme/ThemeProvider';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialMode="auto">
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

**Structure des providers** :
1. `QueryClientProvider` : Gestion des requêtes et cache React Query
2. `ThemeProvider` : Gestion du thème (light/dark/auto) et PaperProvider
3. `AuthProvider` : Gestion de l'authentification et de la session
4. `NavigationContainer` + `RootNavigator` : Navigation de l'application

## Règles pour créer de nouveaux composants UI

### 1. Utiliser les tokens

**❌ Ne pas** :
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0066FF',
  },
});
```

**✅ Faire** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,      // 16px
    borderRadius: tokens.radius.sm,   // 12px
    backgroundColor: tokens.colors.primary, // #0066FF
  },
});
```

### 2. Utiliser le thème React Native Paper

**✅ Faire** :
```typescript
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Texte</Text>
    </View>
  );
};
```

### 3. Utiliser le composant Screen

**✅ Faire** :
```typescript
import { Screen } from '../components/Screen';

export function MyScreen() {
  return (
    <Screen padding="md">
      {/* Contenu */}
    </Screen>
  );
}
```

### 4. Typographies MD3

**✅ Faire** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  title: {
    fontSize: tokens.typography.h4.fontSize,
    lineHeight: tokens.typography.h4.lineHeight,
    fontWeight: tokens.typography.h4.fontWeight,
  },
  body: {
    fontSize: tokens.typography.body1.fontSize,
    lineHeight: tokens.typography.body1.lineHeight,
  },
});
```

### 5. Structurer les composants

**Structure recommandée** :
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  const theme = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
      onTouchEnd={onPress}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.onSurface,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
  },
  title: {
    fontSize: tokens.typography.body1.fontSize,
    lineHeight: tokens.typography.body1.lineHeight,
  },
});
```

## Animation

### Durées d'animation

| Nom | Valeur | Usage |
|-----|--------|-------|
| **Fast** | `150ms` | Animations rapides (hover, press) |
| **Normal** | `250ms` | Animations standard (transitions) |
| **Slow** | `350ms` | Animations lentes (modals, sheets) |

**Utilisation** :
```typescript
import { tokens } from '../theme';
import { Animated } from 'react-native';

Animated.timing(animatedValue, {
  toValue: 1,
  duration: tokens.animation.normal, // 250ms
  useNativeDriver: true,
}).start();
```

## Z-Index

| Nom | Valeur | Usage |
|-----|--------|-------|
| **Dropdown** | `1000` | Dropdowns, menus |
| **Sticky** | `1020` | Éléments sticky |
| **Fixed** | `1030` | Éléments fixed |
| **Modal Backdrop** | `1040` | Backdrop des modals |
| **Modal** | `1050` | Modals, dialogs |
| **Popover** | `1060` | Popovers |
| **Tooltip** | `1070` | Tooltips |

**Utilisation** :
```typescript
import { tokens } from '../theme';

const styles = StyleSheet.create({
  modal: {
    zIndex: tokens.zIndex.modal, // 1050
  },
});
```

## Bottom Tab Bar (TabBar)

### Configuration

La TabBar (Bottom Tab Navigator) est configurée dans `/src/navigation/MainTabNavigator.tsx` avec un style Suivi exclusif utilisant uniquement les tokens.

### Style TabBar

**Approche minimale (recommandée)** :
- **Hauteur** : Aucune hauteur fixe - React Navigation gère automatiquement la hauteur optimale
- **Padding** : Aucun padding vertical personnalisé - Le safe area est géré automatiquement par `SafeAreaProvider`

**Couleurs** :
- **Active** : `tokens.colors.brand.primary` (#4F5DFF) - Violet Suivi
- **Inactive** : `tokens.colors.neutral.medium` (#98928C) - Gris Suivi
- **Background** : `tokens.colors.background.surface` (#F4F2EE) - Sand Suivi
- **Border** : `tokens.colors.border.default` (#E8E8E8) - Bordure claire

**Typography** :
- **Font family** : `tokens.typography.label.fontFamily` (Inter_500Medium)
- **Font size** : `tokens.typography.label.fontSize` (13px)
- **Font weight** : `tokens.typography.label.fontWeight` ('500')

**Icônes** :
- **Size** : 24px par défaut
- **Icons** : MaterialCommunityIcons

### Gestion du Safe Area

**Configuration** :
- `SafeAreaProvider` est placé au niveau racine dans `App.tsx` (avant `QueryClientProvider`)
- La TabBar respecte automatiquement le safe area du bas sur iOS grâce à cette configuration
- Les écrans individuels utilisent `ScreenContainer` avec `SafeAreaView` pour gérer le safe area du haut et du contenu

**Safe Area Provider** :
```typescript
// Dans App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

return (
  <SafeAreaProvider>
    <QueryClientProvider>
      {/* ... */}
    </QueryClientProvider>
  </SafeAreaProvider>
);
```

**Importance** :
- Le `SafeAreaProvider` permet à React Navigation de gérer automatiquement le safe area du bas
- **Ne jamais définir une hauteur fixe** car cela peut causer un débordement sur iOS
- React Navigation calcule automatiquement la hauteur optimale basée sur le contenu et le safe area
- En laissant React Navigation gérer la hauteur, la TabBar reste toujours visible sans débordement

### Configuration TabBar

**Pour modifier l'espacement (si nécessaire)** :
- Éditer `tabBarStyle` dans `/src/navigation/MainTabNavigator.tsx`
- **Recommandation** : Ne pas définir de hauteur fixe ni de padding vertical
- Si un padding minimal est nécessaire pour l'espacement visuel interne : utiliser 4px maximum

**Exemple de configuration minimale (recommandée)** :
```typescript
tabBarStyle: {
  backgroundColor: tokens.colors.background.surface,
  borderTopWidth: 1,
  borderTopColor: tokens.colors.border.default,
  // Pas de hauteur fixe : React Navigation gère automatiquement
  // Pas de padding vertical : Safe area géré automatiquement
},
tabBarHideOnKeyboard: true, // Évite les bugs de layout avec le clavier
```

### Bonnes pratiques

1. **Hauteur** : Ne jamais définir une hauteur fixe - Laisser React Navigation gérer automatiquement
2. **Padding** : Éviter le padding vertical personnalisé - Le safe area est géré automatiquement
3. **Safe Area** : S'assurer que `SafeAreaProvider` est présent au niveau racine dans `App.tsx`
4. **Écrans dans tabs** : Les écrans doivent utiliser `ScreenContainer` avec `safeAreaEdges = ['top']` uniquement (pas de bottom)
5. **Keyboard** : Toujours activer `tabBarHideOnKeyboard: true` pour éviter les bugs de layout
6. **Tokens** : Utiliser uniquement les tokens Suivi (pas de valeurs hardcodées)

## Quick Capture (Inbox mobile)

### Concept

**Quick Capture** est une fonctionnalité d'inbox mobile qui permet de capturer rapidement des tâches minimalistes depuis le mobile sans créer de tâches Suivi complètes.

**But UX** : Permettre de capturer rapidement une idée / tâche depuis mobile, sans choix de board/portal/view. Les items Quick Capture seront ensuite classés côté desktop dans les boards Suivi.

**Architecture** :
- **Mobile** : Quick Capture est une inbox temporaire mockée (`src/mocks/data/quickCapture.ts`)
- **Desktop** : Les items seront importés et convertis en tâches Suivi complètes
- **API** : Prêt à être branché sur un endpoint Suivi dédié (`src/api/quickCapture.ts`)

### Composant QuickCaptureModal

**Fichier** : `src/components/ui/QuickCaptureModal.tsx`

**Fonctionnalités** :
- Modal avec fond semi-transparent
- Champ texte multiligne obligatoire : "What do you want to remember?"
- Boutons Cancel et "Save to Inbox"
- Feedback visuel léger après sauvegarde ("Saved ✓")

**Design** :
- Utilise `SuiviCard` pour le contenu du modal
- Radius : `tokens.radius.xl` (20px)
- Padding : `tokens.spacing.lg` (16px)
- Elevation : `tokens.shadows.lg`
- Typography : Inter pour tous les textes (via `SuiviText`)

**Utilisation** :
```typescript
import { QuickCaptureModal } from '../components/ui/QuickCaptureModal';

const [visible, setVisible] = useState(false);

<QuickCaptureModal
  visible={visible}
  onClose={() => setVisible(false)}
  onSuccess={() => {
    // Optionnel : callback après sauvegarde réussie
  }}
/>
```

### Types Quick Capture

**Fichier** : `src/types/quickCapture.ts`

**Structure** :
```typescript
type QuickCaptureItem = {
  id: string;
  title: string;
  createdAt: string; // ISO
  dueDate?: string | null; // optionnel
  status: 'inbox' | 'sent';
  source: 'mobile';
};
```

**Séparation avec Task** :
- Les Quick Capture sont **SÉPARÉS** des Task (`src/api/tasks.ts`)
- Les Quick Capture ne sont pas des tâches Suivi complètes
- Ils seront convertis en tâches Suivi côté desktop

### API Quick Capture

**Fichier** : `src/api/quickCapture.ts`

**Fonctions** :
- `getQuickCaptureItems()` : Récupère tous les items de l'inbox
- `createQuickCaptureItem(payload)` : Crée un nouvel item
- `clearQuickCaptureInbox()` : Vide l'inbox

**Hooks React Query** : `src/hooks/useSuiviQuery.ts`
- `useQuickCaptureItems()` : Hook pour récupérer les items
- `useCreateQuickCaptureItem()` : Hook pour créer un item
- `useClearQuickCaptureInbox()` : Hook pour vider l'inbox

**Implémentation actuelle** : Mockée dans `src/mocks/data/quickCapture.ts`

### Bonnes pratiques

1. **Séparation** : Ne jamais mélanger Quick Capture avec les Task existantes
2. **Simplicité** : Quick Capture est minimaliste (titre + date optionnelle)
3. **Migration** : Les items seront convertis en tâches Suivi complètes côté desktop
4. **API** : Prêt à être branché sur l'API Suivi réelle (voir `docs/mobile/api-contract.md`)

