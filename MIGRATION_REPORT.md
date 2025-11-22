# Rapport de Cartographie - Doublons racine vs src/

## 1. Dossier `components/`

### Fichiers à la racine uniquement :
- `components/index.ts`
- `components/layout/index.ts`
- `components/layout/ScreenContainer.tsx` ⚠️ **UTILISÉ** par `src/components/Screen.tsx`
- `components/media/index.ts`
- `components/media/SuiviLogoFull.tsx`
- `components/media/SuiviLogoHorizontal.tsx`
- `components/media/SuiviLogoIcon.tsx`
- `components/ui/index.ts`
- `components/ui/SuiviAppBar.tsx`
- `components/ui/SuiviAvatar.tsx`
- `components/ui/SuiviButton.tsx`
- `components/ui/SuiviCard.tsx`
- `components/ui/SuiviChip.tsx`
- `components/ui/SuiviDivider.tsx`
- `components/ui/SuiviListItem.tsx`
- `components/ui/SuiviLogo.tsx` ⚠️ **UTILISÉ** par `src/components/AppHeader.tsx`
- `components/ui/SuiviSurface.tsx`
- `components/ui/SuiviText.tsx`
- `components/ui/SuiviTextInput.tsx`

### Fichiers dans src/ uniquement :
- `src/components/activity/` (3 fichiers)
- `src/components/AppHeader.tsx`
- `src/components/AuthBackground.tsx`
- `src/components/home/` (2 fichiers)
- `src/components/HomeSearchBar.tsx`
- `src/components/layout/ScreenHeader.tsx`
- `src/components/Screen.tsx` ⚠️ **IMPORTE** depuis racine
- `src/components/tasks/` (10 fichiers)
- `src/components/ui/` (17 fichiers, dont certains doublons)

### Doublons potentiels :
- `SuiviButton.tsx` : existe à la racine ET probablement dans src/components/ui/
- `SuiviCard.tsx` : existe à la racine ET dans src/components/ui/
- `SuiviText.tsx` : existe à la racine ET dans src/components/ui/

**Conclusion components/** : `ScreenContainer.tsx` à la racine est utilisé. Les composants ui/ à la racine semblent ne pas être utilisés (à vérifier via imports).

## 2. Dossier `theme/`

### Fichiers à la racine uniquement :
- `theme/index.ts` ⚠️ **UTILISÉ** par `src/theme/index.ts`
- `theme/paper-theme.ts` ⚠️ **UTILISÉ** par `src/theme/ThemeProvider.tsx` et `src/theme/index.ts`
- `theme/tokens.ts` ⚠️ **PAS UTILISÉ** (version dans src/theme/tokens.ts est utilisée)

### Fichiers dans src/ uniquement :
- `src/theme/fonts.ts`
- `src/theme/index.ts` (importe depuis racine)
- `src/theme/ThemeProvider.tsx` (importe depuis racine)
- `src/theme/tokens.ts` ⚠️ **UTILISÉ** par tous les composants

### Importations actives :
- `src/theme/index.ts` → `export { ... } from '../../theme/paper-theme'`
- `src/theme/ThemeProvider.tsx` → `import { suiviLightTheme, suiviDarkTheme } from '../../theme/paper-theme'`
- Tous les composants → `import { tokens } from '../../theme'` (pointe vers racine)

**Conclusion theme/** : La racine contient `paper-theme.ts` et `tokens.ts`, mais `tokens.ts` de src/ est utilisé. `paper-theme.ts` est utilisé depuis la racine.

## 3. Dossier `assets/`

### Fichiers à la racine uniquement :
- `assets/backgrounds/` (2 PNG)
- `assets/suivi/` (logos, splash)
- `assets/icon.png`, `icon 2.png`
- `assets/profile/`

### Fichiers dans src/ uniquement :
- `src/assets/images/julien.jpg`

**Conclusion assets/** : Les assets racine contiennent logos et backgrounds. Vérifier les imports pour savoir lesquels sont utilisés.

## 4. Dossier `navigation/`

### Fichiers à la racine uniquement :
- `navigation/RootNavigator.tsx` ⚠️ Ancien fichier (debug screen)

### Fichiers dans src/ uniquement :
- `src/navigation/RootNavigator.tsx` ⚠️ **UTILISÉ** par `src/App.tsx`

**Conclusion navigation/** : La version src/ est utilisée, la racine est obsolète.

## Actions prioritaires

1. ⚠️ **CRITIQUE** : Migrer `components/layout/ScreenContainer.tsx` → `src/components/layout/ScreenContainer.tsx`
2. ⚠️ **CRITIQUE** : Migrer `theme/paper-theme.ts` → `src/theme/paper-theme.ts`
3. Vérifier quels composants `ui/` racine sont utilisés
4. Migrer les assets utilisés

