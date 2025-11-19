# Internationalization Plan (i18n) for Suivi Mobile App

## SECTION 1 — Overview

### Goals

The Suivi Mobile App internationalization implementation aims to provide:

- **Full bilingual support (FR/EN)**: Complete translation coverage for French and English languages across all user-facing content
- **Live language switching in-app**: Users can change language from the "More" screen without requiring app restart
- **No layout regressions**: Translations must not break existing layouts, spacing, or component dimensions
- **Future-proof architecture**: Scalable structure to easily add additional languages (ES, DE, etc.) in the future

### Scope

This plan covers:
- All user-facing text strings (buttons, labels, titles, messages)
- Error messages and validation feedback
- Date/time formatting
- Number formatting
- Dynamic content interpolation

### Out of Scope

- Currency formatting (future enhancement)
- Right-to-left (RTL) language support (future enhancement)
- Third-party library translations (handled separately)

---

## SECTION 2 — Technical Stack

### Core Libraries

**i18next** (v23.x)
- Core internationalization framework
- Provides translation engine, pluralization, interpolation
- Lightweight and performant for React Native

**react-i18next** (v13.x)
- React bindings for i18next
- Provides hooks: `useTranslation()`, `Trans` component
- Seamless integration with React Native components

**@react-native-async-storage/async-storage** (existing)
- Persist user language preference
- Store selected language key between app sessions
- No additional dependency required

### Language Detection Strategy

1. **Primary**: User selection stored in AsyncStorage (`@suivi/language`)
2. **Fallback**: Device system language (if available)
3. **Default**: French (`fr`) if no preference or system language detected

### Fallback Strategy

- Missing translation keys display the key itself in development mode
- Production mode falls back to French (`fr`) for any missing keys
- Console warnings logged for missing translations during development

### Theme Compatibility

- i18n implementation is theme-agnostic
- Light/dark mode switching remains independent
- Language preference persists across theme changes

---

## SECTION 3 — File Structure

### Required Directory Structure

```
/src/
  /i18n/
    i18n.ts                    # i18next initialization and configuration
    resources/
      fr.json                   # French translations
      en.json                   # English translations
    types.ts                    # TypeScript types for translation keys (optional)
```

### File Descriptions

**i18n.ts**
- Initializes i18next instance
- Configures language detection
- Sets up AsyncStorage persistence
- Exports configured i18n instance

**resources/fr.json**
- All French translation strings
- Organized by feature/screen namespaces
- JSON structure with nested keys

**resources/en.json**
- All English translation strings
- Mirrors structure of fr.json
- Must contain all keys present in fr.json

**types.ts** (optional)
- TypeScript type definitions for translation keys
- Provides autocomplete and type safety
- Generated or manually maintained

---

## SECTION 4 — Implementation Steps

### Step 1: Install Dependencies

```bash
npm install i18next react-i18next
# or
yarn add i18next react-i18next
```

**Note**: `@react-native-async-storage/async-storage` should already be installed. If not:
```bash
npm install @react-native-async-storage/async-storage
```

### Step 2: Create i18n.ts

**File**: `src/i18n/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fr from './resources/fr.json';
import en from './resources/en.json';

const LANGUAGE_STORAGE_KEY = '@suivi/language';

// Language detection function
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }
      // Fallback to device language or default to 'fr'
      callback('fr');
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('fr');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // For React Native compatibility
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    debug: __DEV__, // Enable debug in development
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
```

**Imports**:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### Step 3: Add I18nextProvider in App.tsx

**File**: `src/App.tsx` (or root component)

```typescript
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

// ... other imports

export default function App() {
  useEffect(() => {
    // Initialize i18n on app start
    i18n.changeLanguage(i18n.language);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {/* Existing app structure */}
      <ThemeProvider>
        <NavigationContainer>
          {/* ... */}
        </NavigationContainer>
      </ThemeProvider>
    </I18nextProvider>
  );
}
```

**Imports**:
```typescript
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
```

### Step 4: Define FR and EN JSON Files

**File**: `src/i18n/resources/fr.json`

```json
{
  "common": {
    "loading": "Chargement...",
    "error": "Erreur",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "close": "Fermer"
  },
  "home": {
    "title": "Accueil",
    "whatsNew": "What's new",
    "activeTasks": "Tâches actives",
    "dueToday": "Due Today",
    "recentActivities": "Activités récentes",
    "viewMore": "Voir plus d'activités",
    "noActivities": "Aucune activité récente",
    "filters": {
      "all": "Tous",
      "boards": "Boards",
      "portals": "Portails"
    }
  },
  "tasks": {
    "title": "Mes tâches",
    "empty": "Aucune tâche",
    "completed": "Terminée",
    "inProgress": "En cours",
    "overdue": "En retard"
  },
  "activity": {
    "meta": {
      "author": "{{name}}",
      "timeAgo": "Il y a {{count}} min",
      "timeAgoHours": "Il y a {{count}} h",
      "timeAgoDays": "Il y a {{count}} j",
      "yesterday": "Hier — {{time}}"
    },
    "types": {
      "task": "Tâche",
      "board": "Board",
      "portal": "Portail"
    }
  },
  "settings": {
    "title": "Paramètres",
    "language": "Langue",
    "languageDescription": "Choisir la langue de l'application",
    "theme": "Thème",
    "themeLight": "Clair",
    "themeDark": "Sombre"
  }
}
```

**File**: `src/i18n/resources/en.json`

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "close": "Close"
  },
  "home": {
    "title": "Home",
    "whatsNew": "What's new",
    "activeTasks": "Active Tasks",
    "dueToday": "Due Today",
    "recentActivities": "Recent Activities",
    "viewMore": "View more activities",
    "noActivities": "No recent activities",
    "filters": {
      "all": "All",
      "boards": "Boards",
      "portals": "Portals"
    }
  },
  "tasks": {
    "title": "My Tasks",
    "empty": "No tasks",
    "completed": "Completed",
    "inProgress": "In Progress",
    "overdue": "Overdue"
  },
  "activity": {
    "meta": {
      "author": "{{name}}",
      "timeAgo": "{{count}} min ago",
      "timeAgoHours": "{{count}} h ago",
      "timeAgoDays": "{{count}} d ago",
      "yesterday": "Yesterday — {{time}}"
    },
    "types": {
      "task": "Task",
      "board": "Board",
      "portal": "Portal"
    }
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "languageDescription": "Choose application language",
    "theme": "Theme",
    "themeLight": "Light",
    "themeDark": "Dark"
  }
}
```

### Step 5: Replace Hardcoded Text with t("keys")

**Example**: `src/screens/HomeScreen.tsx`

**Before**:
```typescript
<SuiviText variant="h1">What's new</SuiviText>
<StatCard title="Active Tasks" value={activeCount} />
<FilterChip label="Tous" />
```

**After**:
```typescript
import { useTranslation } from 'react-i18next';

function HomeScreen() {
  const { t } = useTranslation();
  
  return (
    <>
      <SuiviText variant="h1">{t('home.whatsNew')}</SuiviText>
      <StatCard title={t('home.activeTasks')} value={activeCount} />
      <FilterChip label={t('home.filters.all')} />
    </>
  );
}
```

**Imports**:
```typescript
import { useTranslation } from 'react-i18next';
```

**Hook Usage**:
```typescript
const { t, i18n } = useTranslation();
// t('key.path') - Get translation
// i18n.changeLanguage('en') - Change language
// i18n.language - Current language
```

### Step 6: Persist Selected Language Using AsyncStorage

The persistence is already handled in `i18n.ts` via the `languageDetector` configuration. When a user changes language:

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const changeLanguage = async (lng: 'fr' | 'en') => {
    await i18n.changeLanguage(lng);
    // Language is automatically persisted via languageDetector.cacheUserLanguage
  };
  
  return (
    <View>
      <Button onPress={() => changeLanguage('fr')}>Français</Button>
      <Button onPress={() => changeLanguage('en')}>English</Button>
    </View>
  );
}
```

### Step 7: Connect FR/EN Toggle on "More" Screen

**File**: `src/screens/MoreScreen.tsx` (or SettingsScreen)

```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Switch, StyleSheet } from 'react-native';
import { SuiviText } from '../components/ui/SuiviText';

export function MoreScreen() {
  const { t, i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');
  
  const handleLanguageToggle = async (value: boolean) => {
    const newLanguage = value ? 'en' : 'fr';
    await i18n.changeLanguage(newLanguage);
    setIsEnglish(value);
    // Language change triggers re-render automatically
  };
  
  return (
    <View style={styles.container}>
      <SuiviText variant="h1">{t('settings.title')}</SuiviText>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <SuiviText variant="body">{t('settings.language')}</SuiviText>
          <SuiviText variant="body" color="secondary">
            {t('settings.languageDescription')}
          </SuiviText>
        </View>
        <Switch
          value={isEnglish}
          onValueChange={handleLanguageToggle}
        />
      </View>
      
      {/* Display current language */}
      <SuiviText variant="caption">
        {i18n.language === 'en' ? 'English' : 'Français'}
      </SuiviText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
});
```

**Imports**:
```typescript
import { useTranslation } from 'react-i18next';
```

**Key Points**:
- `i18n.changeLanguage()` triggers automatic re-render of all components using `useTranslation()`
- Language preference is persisted automatically via AsyncStorage
- No app restart required

---

## SECTION 5 — Translation Key Strategy

### Naming Convention

Translation keys follow a hierarchical dot-notation structure:

```
{namespace}.{category}.{specific}
```

### Key Structure Rules

1. **Namespaces**: Match screen/feature names (lowercase)
   - `home.*` - Home screen
   - `tasks.*` - Tasks screen
   - `activity.*` - Activity-related content
   - `settings.*` - Settings screen
   - `common.*` - Shared across app

2. **Categories**: Group related translations
   - `home.filters.*` - Filter buttons
   - `activity.meta.*` - Activity metadata
   - `tasks.status.*` - Task status labels

3. **Specific Keys**: Descriptive, action-oriented names
   - Use verbs for actions: `save`, `delete`, `edit`
   - Use nouns for labels: `title`, `description`, `author`
   - Use adjectives for states: `completed`, `active`, `overdue`

### Examples

**Screen Titles**:
```json
{
  "home": { "title": "Accueil" },
  "tasks": { "title": "Mes tâches" },
  "settings": { "title": "Paramètres" }
}
```

**Buttons**:
```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer"
  }
}
```

**Dynamic Content with Interpolation**:
```json
{
  "activity": {
    "meta": {
      "author": "{{name}}",
      "timeAgo": "Il y a {{count}} min",
      "createdBy": "Créé par {{author}} le {{date}}"
    }
  }
}
```

**Usage**:
```typescript
t('activity.meta.author', { name: 'John Doe' });
t('activity.meta.timeAgo', { count: 5 });
t('activity.meta.createdBy', { author: 'Jane', date: '15 nov.' });
```

**Pluralization**:
```json
{
  "tasks": {
    "count": "{{count}} tâche",
    "count_plural": "{{count}} tâches",
    "count_zero": "Aucune tâche"
  }
}
```

**Usage**:
```typescript
t('tasks.count', { count: 0 }); // "Aucune tâche"
t('tasks.count', { count: 1 }); // "1 tâche"
t('tasks.count', { count: 5 }); // "5 tâches"
```

**Long Texts**:
```json
{
  "onboarding": {
    "welcome": {
      "title": "Bienvenue dans Suivi",
      "description": "Suivi est votre outil de gestion de projet tout-en-un. Organisez vos tâches, suivez vos objectifs et collaborez avec votre équipe."
    }
  }
}
```

**Error Messages**:
```json
{
  "errors": {
    "network": "Erreur de connexion",
    "validation": {
      "required": "Ce champ est requis",
      "email": "Adresse email invalide",
      "minLength": "Minimum {{count}} caractères requis"
    }
  }
}
```

### Key Naming Best Practices

1. **Be Descriptive**: `home.recentActivities` not `home.ra`
2. **Use Consistent Patterns**: All filter labels under `home.filters.*`
3. **Avoid Duplication**: Reuse `common.*` keys instead of repeating
4. **Group Related Content**: Keep related translations together
5. **Use Interpolation**: For dynamic values, not string concatenation

---

## SECTION 6 — Migration Strategy

### Phase 1: Foundation (Week 1)

**Goal**: Set up i18n infrastructure without breaking existing functionality

1. Install dependencies
2. Create `i18n.ts` and JSON files with minimal translations
3. Add `I18nextProvider` to App.tsx
4. Test language switching works

**Risk**: Low - No existing code modified

### Phase 2: Global Screens (Week 2)

**Priority Order**:
1. **HomeScreen** - Most visible, high impact
2. **MoreScreen** - Contains language selector
3. **TasksScreen** - Core functionality
4. **NotificationsScreen** - Secondary feature

**Migration Process**:
- Create translation keys for each screen
- Replace hardcoded strings one component at a time
- Test after each screen migration
- Keep both languages in sync

**Example Migration**:
```typescript
// Before
<SuiviText variant="h1">Activités récentes</SuiviText>

// After
const { t } = useTranslation();
<SuiviText variant="h1">{t('home.recentActivities')}</SuiviText>
```

### Phase 3: Shared Components (Week 3)

**Components to Migrate**:
- `ActivityCard` - Activity type labels, time formatting
- `StatCard` - Card titles
- `FilterChip` - Filter labels
- `UserAvatar` - Placeholder text
- `SuiviButton` - Button labels (if any)

**Strategy**:
- Migrate components used across multiple screens
- Ensure consistent key naming
- Update all usages of migrated components

### Phase 4: Edge Cases (Week 4)

**Areas to Cover**:
- Modals and dialogs
- Error messages and validation
- Status labels (task status, activity types)
- Date/time formatting helpers
- Empty states
- Loading states

**Date/Time Formatting**:
```typescript
// Create helper function
import { useTranslation } from 'react-i18next';
import { formatRelativeTime } from '../utils/date';

function useFormattedDate(date: string) {
  const { i18n } = useTranslation();
  return formatRelativeTime(date, i18n.language);
}
```

### Avoiding Layout Regressions

**Text Length Considerations**:
- English text is often 20-30% longer than French
- Test with longest expected translations
- Use `numberOfLines` and `ellipsizeMode` for long text
- Consider `flexShrink` for flexible layouts

**Testing Checklist**:
- [ ] All text visible in both languages
- [ ] No text overflow or clipping
- [ ] Buttons maintain minimum width
- [ ] Cards maintain consistent height
- [ ] Navigation labels fit in tab bar
- [ ] Modal titles don't wrap unexpectedly

**Layout-Safe Patterns**:
```typescript
// Use flexShrink for flexible text
<SuiviText style={{ flexShrink: 1 }} numberOfLines={2}>
  {t('home.longDescription')}
</SuiviText>

// Set minWidth for buttons
<Button style={{ minWidth: 100 }}>
  {t('common.save')}
</Button>
```

---

## SECTION 7 — Testing Strategy

### Manual Testing

**FR ↔ EN Switch Testing**:
1. Open app in French (default)
2. Navigate to "More" screen
3. Toggle language to English
4. Verify all visible text changes immediately
5. Navigate to each screen, verify translations
6. Toggle back to French, verify revert
7. Close and reopen app, verify language persists

**Screen-by-Screen Checklist**:
- [ ] Home screen - All text translated
- [ ] Tasks screen - All labels and statuses
- [ ] Notifications screen - All messages
- [ ] More/Settings screen - All options
- [ ] Activity cards - Types, metadata, time
- [ ] Modals - Titles, buttons, messages
- [ ] Error messages - All error states

### Automated Testing

**Missing Translation Detection**:
```typescript
// Add to i18n.ts in development
if (__DEV__) {
  i18n.on('missingKey', (lng, ns, key) => {
    console.warn(`Missing translation: ${key} for language ${lng}`);
  });
}
```

**Translation Key Validation Script**:
```typescript
// scripts/validate-translations.ts
import fr from '../src/i18n/resources/fr.json';
import en from '../src/i18n/resources/en.json';

function getAllKeys(obj: any, prefix = ''): string[] {
  return Object.keys(obj).flatMap(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return getAllKeys(obj[key], fullKey);
    }
    return [fullKey];
  });
}

const frKeys = getAllKeys(fr);
const enKeys = getAllKeys(en);

const missingInEn = frKeys.filter(k => !enKeys.includes(k));
const missingInFr = enKeys.filter(k => !frKeys.includes(k));

if (missingInEn.length > 0) {
  console.error('Missing in EN:', missingInEn);
}
if (missingInFr.length > 0) {
  console.error('Missing in FR:', missingInFr);
}
```

**Unused Key Detection**:
- Use grep/search to find `t('key')` usage
- Compare with keys in JSON files
- Remove unused keys periodically

### QA Checklist

**Functional Testing**:
- [ ] Language switch works without app restart
- [ ] Language preference persists after app close
- [ ] All screens display correct language
- [ ] Dynamic content (names, dates) interpolates correctly
- [ ] Pluralization works for count-based text
- [ ] Error messages display in selected language

**Visual Testing**:
- [ ] No text overflow in either language
- [ ] Buttons maintain readable size
- [ ] Cards maintain consistent layout
- [ ] Navigation labels fit properly
- [ ] Long translations wrap gracefully

**Edge Cases**:
- [ ] App launch with no saved preference (defaults to FR)
- [ ] Language switch during async operation
- [ ] Language switch while modal is open
- [ ] Very long translation strings
- [ ] Missing translation key handling

---

## SECTION 8 — Maintenance Guidelines

### Adding New Translations

**Process**:
1. Identify all user-facing strings in new feature
2. Create translation keys following naming convention
3. Add keys to both `fr.json` and `en.json`
4. Replace hardcoded strings with `t('key')`
5. Test in both languages
6. Update this documentation if new namespace needed

**Example Workflow**:
```typescript
// 1. Add to fr.json
{
  "newFeature": {
    "title": "Nouvelle fonctionnalité",
    "description": "Description de la fonctionnalité"
  }
}

// 2. Add to en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Feature description"
  }
}

// 3. Use in component
const { t } = useTranslation();
<SuiviText>{t('newFeature.title')}</SuiviText>
```

### Avoiding Key Duplication

**Reuse Common Keys**:
- Use `common.save`, `common.cancel` instead of creating duplicates
- Create shared keys for frequently used phrases
- Group related translations under same namespace

**Key Organization**:
```json
{
  "common": {
    "actions": { "save": "...", "cancel": "..." },
    "states": { "loading": "...", "error": "..." }
  }
}
```

### Preventing Regressions

**Code Review Checklist**:
- [ ] All new user-facing strings use translation keys
- [ ] Both FR and EN translations provided
- [ ] Keys follow naming convention
- [ ] No hardcoded strings in new code
- [ ] Layout tested with both languages

**Pre-commit Hooks** (Optional):
```bash
# .husky/pre-commit
npm run validate-translations
```

**CI/CD Integration**:
- Run translation validation in CI
- Fail build if translations are missing
- Generate translation coverage report

### Documentation Updates

**When to Update This Plan**:
- New language added
- New namespace created
- Translation key strategy changes
- New tooling or process introduced

**Keeping Keys in Sync**:
- Regular audits (monthly) to find missing translations
- Automated scripts to detect key mismatches
- Team communication when adding new features

### Best Practices Summary

1. **Always add translations for both languages simultaneously**
2. **Test layout with longest expected translations**
3. **Use interpolation for dynamic values, not string concatenation**
4. **Follow naming convention consistently**
5. **Reuse common keys instead of duplicating**
6. **Document new namespaces in team wiki**
7. **Run validation scripts before committing**
8. **Keep translation files organized and clean**

---

## Appendix A — Quick Reference

### Common Translation Patterns

**Simple Text**:
```typescript
t('home.title')
```

**With Interpolation**:
```typescript
t('activity.meta.author', { name: user.name })
```

**Pluralization**:
```typescript
t('tasks.count', { count: taskCount })
```

**Change Language**:
```typescript
const { i18n } = useTranslation();
await i18n.changeLanguage('en');
```

**Current Language**:
```typescript
const { i18n } = useTranslation();
const currentLang = i18n.language; // 'fr' or 'en'
```

### File Locations Summary

- Configuration: `src/i18n/i18n.ts`
- Translations: `src/i18n/resources/fr.json`, `src/i18n/resources/en.json`
- Provider: `src/App.tsx`
- Language Selector: `src/screens/MoreScreen.tsx`

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Suivi Mobile Team

