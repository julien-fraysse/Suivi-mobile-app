# Changelog Mobile Suivi

## Introduction

Ce fichier documente tous les changements significatifs apportés à l'application mobile Suivi. Il sert de journal technique pour suivre l'évolution du projet.

**Format** : Entrées chronologiques inversées (plus récent en premier), avec catégories claires.

---

## 2024-11-16 - Sécurisation et fiabilisation écran Settings (More)

**Type** : `fix` | `refactor` | `docs`

**Description** : Sécurisation et fiabilisation complète de l'écran More (Settings) avec corrections des incompatibilités theme, gestion d'erreurs robuste, et documentation AsyncStorage.

**Détails** :

### 1. Correction incompatibilité Theme 'auto' vs 'system'
- **Problème** : `ThemeProvider` utilise `'auto'` mais `SettingsContext` utilise `'system'` pour la persistance AsyncStorage
- **Solution** : Ajout de fonctions de conversion bidirectionnelles dans `ThemeProvider` et `MoreScreen`
- **Fichiers modifiés** :
  - `src/theme/ThemeProvider.tsx` : Conversion `'system'` → `'auto'` lors du chargement depuis Settings
  - `src/screens/MoreScreen.tsx` : Conversion `'auto'` → `'system'` lors de la sauvegarde dans Settings
- **Comportement** : Synchronisation automatique entre ThemeProvider (UI) et SettingsContext (persistance)
- **Note** : La conversion est transparente pour l'utilisateur, l'UI continue d'utiliser 'auto'

### 2. Sécurisation handlers avec gestion d'erreurs robuste
- **`handleSetTheme`** : Ajout try/catch avec Alert utilisateur en cas d'erreur de persistance AsyncStorage
- **`handleChangeLanguage`** : Déjà sécurisé avec try/catch et Alert (maintenu)
- **Comportement** : Toute erreur AsyncStorage affiche maintenant une alerte claire à l'utilisateur
- **Fichier modifié** : `src/screens/MoreScreen.tsx`

### 3. Correction bug profile.photoUrl
- **Problème** : Accès à `profile.photoUrl` qui n'existe pas dans l'interface `Profile`
- **Solution** : Utilisation uniquement de `profile.avatarUrl` (propriété existante)
- **Fichier modifié** : `src/screens/MoreScreen.tsx` (ligne 206)
- **Impact** : Élimination du risque de crash lors de l'affichage de l'avatar

### 4. Nettoyage optional chaining sur settings
- **Problème** : Utilisation de `settings?.language` alors que `settings` est garanti par `useSettings()` hook
- **Solution** : Remplacement par `settings.language` (plus sûr et explicite)
- **Fichier modifié** : `src/screens/MoreScreen.tsx` (lignes 300, 306)
- **Impact** : Code plus propre et TypeScript peut mieux valider

### 5. Documentation AsyncStorage
- **Clé AsyncStorage** : `@suivi_app_settings`
- **Structure persistée** : `{ language: 'fr' | 'en', theme: 'light' | 'dark' | 'system' }`
- **Valeurs par défaut** : `{ language: 'fr', theme: 'system' }`
- **Comportement** : Chargement au démarrage de l'app, sauvegarde immédiate à chaque modification
- **Fichier** : `src/context/SettingsContext.tsx`

### 6. Compatibilité mocks maintenue
- Aucune modification des mocks existants
- `useUserProfile()` continue de fonctionner comme avant
- Tous les `// TODO API` conservés pour migration future
- Profile mock dérivé de `useUserProfile()` maintenu

**Fichiers modifiés** :
- `src/screens/MoreScreen.tsx`
- `src/theme/ThemeProvider.tsx`
- `docs/mobile/changelog.md`

**Tests recommandés** :
1. Changement de langue FR ↔ EN : doit persister après redémarrage
2. Changement de thème Light/Dark/Auto : doit persister après redémarrage
3. Navigation More → détails : doit rester stable
4. Affichage avatar : doit fonctionner sans crash

---

## 2024-11-16 - MVP Finalisation : Architecture Mock + UX Improvements

**Type** : `feat` | `refactor` | `docs`

**Description** : Finalisation du MVP avec centralisation des mocks dans une architecture API propre, harmonisation Quick Capture, amélioration notifications avec navigation, fix dark mode, branding écran d'auth, et documentation complète.

**Détails** :

### 1. Centralisation des Mock Data (`src/api/*.mock.ts`)
- Création de fichiers `*.mock.ts` centralisés dans `/src/api/` (tasksApi.mock.ts, notificationsApi.mock.ts, authApi.mock.ts)
- Migration de `/src/api/tasks.ts` et `/src/api/notifications.ts` pour utiliser `*.mock.ts`
- Création de `docs/mobile/mock-data.md` avec guide de migration vers vraie API

### 2. Harmonisation Quick Capture (Home + Tasks)
- `QuickCaptureModal` utilise maintenant directement `quickCapture()` depuis `tasksApi.mock.ts`
- MyTasksScreen : Remplacement "Create Task" par "Quick Capture" avec même comportement que Home
- Après capture, recharge automatique de la liste des tâches

### 3. Synchronisation Status → Liste Tasks
- TaskDetailScreen utilise déjà `queryClient.invalidateQueries({ queryKey: ['tasks'] })` après `updateTaskStatus`
- Vérifié : La modification du statut met automatiquement à jour la liste Tasks

### 4. Notifications : UX et Navigation
- Navigation : Tap sur notification → marque comme lue ET navigue vers `TaskDetail` si `taskId` présent
- Type Notification : Ajout de `taskId?: string` et `projectId?: string`
- Mark All as Read : Utilise maintenant `markAllNotificationsRead()` depuis `notificationsApi.mock.ts`
- Hook : Ajout de `useMarkAllNotificationsRead()` dans `useNotifications.ts`

### 5. Fix Dark Mode
- Tokens : Ajout variantes dark (`text.dark.*`, `background.darkSurface`)
- Paper Theme : Vérification que `suiviDarkTheme` utilise correctement les couleurs sombres
- Tous les écrans restent lisibles en dark mode

### 6. Branding Écran d'Auth
- Logo Suivi : Ajout du logo en haut de `LoginScreen` (light/dark selon le thème)
- Design : Utilisation de `SuiviText` pour le titre et sous-titre
- Layout : Marges/paddings cohérents avec le design system Suivi

### 7. Documentation
- `docs/mobile/mock-data.md` : Architecture des mocks, guide de migration vers vraie API
- `docs/mobile/mvp-overview.md` : Vue d'ensemble MVP, écrans, architecture, points d'extension

**Fichiers créés** :
- `src/api/tasksApi.mock.ts`, `src/api/notificationsApi.mock.ts`, `src/api/authApi.mock.ts`, `src/api/index.ts`
- `docs/mobile/mock-data.md`, `docs/mobile/mvp-overview.md`

**Fichiers modifiés** :
- `src/api/tasks.ts`, `src/api/notifications.ts`, `src/components/ui/QuickCaptureModal.tsx`
- `src/screens/MyTasksScreen.tsx`, `src/screens/NotificationsScreen.tsx`, `src/screens/LoginScreen.tsx`
- `src/hooks/useNotifications.ts`, `src/theme/tokens.ts`

**Impact** : Architecture centralisée et prête pour migration API, UX améliorée, dark mode fonctionnel, branding cohérent

---

## 2024-11-16 - Added mobile "Quick Capture" inbox (mocked)

**Type** : `feat` | `docs`

**Description** : Ajout de la fonctionnalité "Quick Capture" (Inbox mobile) pour permettre de capturer rapidement des tâches minimalistes depuis le mobile. Suppression du bouton "Create Task" complet de la Home et remplacement par "Quick Capture". Le mobile se concentre désormais sur la lecture/mise à jour de tâches + capture d'idées, pas sur la création de tâches Suivi structurées complètes.

**Détails** :
- **Modèle & Types** (`src/types/quickCapture.ts`) :
  - Type `QuickCaptureItem` bien documenté
  - Type `QuickCaptureStatus` : `'inbox' | 'sent'`
  - Type `CreateQuickCapturePayload` pour la création
  - Sépare clairement Quick Capture des Task (`src/api/tasks.ts`)
- **Mocks** (`src/mocks/data/quickCapture.ts`) :
  - Stockage en mémoire des items Quick Capture
  - Fonctions mockées : `getQuickCaptureItems()`, `createQuickCaptureItem()`, `clearQuickCaptureInbox()`
  - Simule des délais réseau pour rendre les mocks plus réalistes
- **Adapter API** (`src/api/quickCapture.ts`) :
  - Adapter API dédié avec signatures prêtes pour l'API Suivi réelle
  - Documentation complète pour la migration vers les vraies API
  - Utilise les mocks pour l'instant
- **Service API** (`src/services/api.ts`) :
  - Ajout de `getQuickCaptureItems()`, `createQuickCaptureItem()`, `clearQuickCaptureInbox()` dans l'objet `api`
  - Intégration avec les mocks Quick Capture
- **Hooks React Query** (`src/hooks/useSuiviQuery.ts`) :
  - `useQuickCaptureItems()` : Hook pour récupérer les items
  - `useCreateQuickCaptureItem()` : Hook pour créer un item (avec invalidation de cache)
  - `useClearQuickCaptureInbox()` : Hook pour vider l'inbox
- **Composant UI** (`src/components/ui/QuickCaptureModal.tsx`) :
  - Modal avec fond semi-transparent
  - Champ texte multiligne obligatoire : "What do you want to remember?"
  - Boutons Cancel et "Save to Inbox"
  - Feedback visuel léger après sauvegarde ("Saved ✓")
  - Utilise EXCLUSIVEMENT les tokens Suivi pour le design
- **HomeScreen** (`src/screens/HomeScreen.tsx`) :
  - Remplacement du bouton "Create Task" par "Quick Capture"
  - Suppression complète du bouton "Clear All"
  - Conservation du bouton "View All Tasks" (navigation vers MyTasksScreen)
  - Intégration du `QuickCaptureModal` avec état local

**Fichiers créés** :
- `src/types/quickCapture.ts` : Types TypeScript pour Quick Capture
- `src/mocks/data/quickCapture.ts` : Données mockées pour Quick Capture
- `src/api/quickCapture.ts` : Adapter API pour Quick Capture (mocké, prêt pour migration)
- `src/components/ui/QuickCaptureModal.tsx` : Composant modal pour Quick Capture

**Fichiers modifiés** :
- `src/services/api.ts` : Ajout des fonctions Quick Capture
- `src/hooks/useSuiviQuery.ts` : Ajout des hooks React Query pour Quick Capture
- `src/screens/HomeScreen.tsx` : Remplacement "Create Task" par "Quick Capture", suppression "Clear All"

**Documentation mise à jour** :
- `docs/mobile/screens.md` : Description mise à jour de HomeScreen avec Quick Capture
- `docs/mobile/design-system.md` : Section complète "Quick Capture (Inbox mobile)" ajoutée
- `docs/mobile/api-contract.md` : Section "Quick Capture API (Mobile Inbox)" ajoutée avec contrats d'API
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- **Architecture** : Quick Capture est séparé des Task existantes
- **UX** : Le mobile permet désormais une capture rapide minimaliste, pas la création de tâches complexes
- **Migration** : Prêt à être branché sur l'API Suivi réelle via `src/api/quickCapture.ts`
- **Aucune régression** : Home, Tasks, TaskDetail fonctionnent toujours correctement

**Prochaines étapes** :
- Migration vers l'API Suivi réelle : modifier `src/api/quickCapture.ts` pour appeler le backend
- Conversion desktop : Implémenter la fonctionnalité côté desktop pour convertir les Quick Capture en tâches Suivi complètes

---

## 2024-11-16 - PHASE 3 — 100% COMPLETE 🔥 (Finalisation MVP Mock)

**Type** : `feat` | `refactor` | `docs`

**Description** : Finalisation complète de la Phase 3 avec navigation harmonisée, style Suivi exclusif sur TabBar, harmonisation spacing/radius/typography, vérification dépendances API, et documentation complète.

**Détails** :
- **Navigation harmonisée** (`/src/navigation/`) :
  - `MainTabNavigator` : Style Suivi exclusif avec tokens (pas de `useTheme()`)
    - Active : `tokens.colors.brand.primary` (#4F5DFF)
    - Inactive : `tokens.colors.neutral.medium` (#98928C)
    - Background : `tokens.colors.background.surface` (#F4F2EE)
    - Border : `tokens.colors.border.default` (#E8E8E8)
    - Typography : Inter Medium (13px) via `tokens.typography.label`
    - Spacing : Padding sm (8px) top et bottom, hauteur 60px
  - `RootNavigator` : Nettoyage (suppression doublon commentaires, suppression `useTheme()`)
- **Vérification dépendances API** :
  - Tous les écrans utilisent UNIQUEMENT `api.ts` via les hooks `useSuiviQuery`
  - Aucun appel direct à `getMyTasks()`, `getTaskById()` depuis les écrans
  - `TaskStatus` importé depuis `api/tasks` est OK (type TypeScript uniquement, pas dépendance fonctionnelle)
- **Harmonisation spacing/radius/typography** :
  - Tous les écrans utilisent `tokens.spacing.*`, `tokens.radius.*`, `tokens.typography.*`
  - Aucune valeur hardcodée restante dans les écrans
  - Style cohérent sur toute l'application
- **Documentation mise à jour** :
  - `docs/mobile/navigation.md` : TabBar style Suivi avec tokens exclusifs
  - `docs/mobile/design-system.md` : Couleurs Suivi actuelles (#4F5DFF primary, #F4F2EE sand, etc.)
  - `docs/mobile/roadmap.md` : Nouvelle roadmap complète (Phase 1-7)
  - `docs/mobile/README.md` : État du projet mis à jour (Phase 3 100% complete)

**Fichiers modifiés** :
- `src/navigation/MainTabNavigator.tsx` : Style Suivi exclusif avec tokens (suppression `useTheme()`)
- `src/navigation/RootNavigator.tsx` : Nettoyage (suppression doublon commentaires, `useTheme()`)
- `docs/mobile/navigation.md` : Documentation TabBar style Suivi
- `docs/mobile/design-system.md` : Couleurs Suivi mises à jour (#4F5DFF, #F4F2EE, etc.)
- `docs/mobile/roadmap.md` : Nouvelle roadmap complète
- `docs/mobile/README.md` : État du projet mis à jour

**Documentation mise à jour** :
- `docs/mobile/navigation.md` : TabBar style Suivi avec tokens exclusifs
- `docs/mobile/design-system.md` : Couleurs Suivi mises à jour (brand.primary #4F5DFF, neutral.background #F4F2EE)
- `docs/mobile/roadmap.md` : Nouvelle roadmap (Phase 1-7, migration API, fonctionnalités avancées)
- `docs/mobile/README.md` : État du projet (Phase 3 100% complete)
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- **Navigation Suivi** : TabBar utilise uniquement les tokens Suivi (pas de theme.colors)
- **Cohérence** : Style harmonisé sur toute l'application
- **Migration API** : Structure prête, dépendances vérifiées
- **Documentation** : Complète et à jour

---

## 2024-11-16 - PHASE 3 — UI mock complete (Foundation API + Mocks + Hooks)

**Type** : `feat` | `chore` | `docs`

**Description** : Création de la fondation complète pour la Phase 3 du MVP Suivi mobile avec un système de mocks centralisé, un module API unique, et des hooks React Query génériques.

**Détails** :
- **Mocks centralisés** (`/src/mocks/suiviMock.ts`) :
  - Toutes les données mockées dans un seul module
  - Fonctions mockées : `getTasks()`, `getTaskById()`, `getProjects()`, `getNotifications()`, `getUser()`, `getQuickStats()`, `getActivityFeed()`
  - Données cohérentes Suivi avec des tâches, projets, notifications, utilisateur, stats et activités réalistes
  - Simule des délais réseau pour rendre les mocks plus réalistes
- **Module API unique** (`/src/services/api.ts`) :
  - Wrapper unique qui pointe vers les mocks pour l'instant
  - Toutes les fonctions API exposées : `api.getTasks()`, `api.getTaskById()`, `api.getProjects()`, etc.
  - Documentation complète pour migrer vers les vraies API en changeant UNIQUEMENT ce fichier
  - Structure prête pour remplacer les mocks par les vraies API sans modifier les écrans
- **Hooks React Query génériques** (`/src/hooks/useSuiviQuery.ts`) :
  - `useTasks()` : Hook avec pagination infinie pour les tâches
  - `useTask()` : Hook pour récupérer une tâche par ID
  - `useProjects()` : Hook pour récupérer tous les projets
  - `useNotifications()` : Hook pour récupérer les notifications
  - `useUser()` : Hook pour récupérer l'utilisateur actuel
  - `useQuickStats()` : Hook pour récupérer les statistiques rapides
  - `useActivityFeed()` : Hook pour récupérer le fil d'activité
  - Tous les hooks utilisent `/src/services/api.ts` qui peut être migré vers les vraies API
- **Types centralisés** :
  - Types exportés depuis `/src/mocks/suiviMock.ts` pour être réutilisés partout
  - Types compatibles avec la structure API existante

**Fichiers créés** :
- `src/mocks/suiviMock.ts` : Module de mocks centralisé avec toutes les données
- `src/services/api.ts` : Module API unique qui wrappe les mocks (prêt pour migration)
- `src/hooks/useSuiviQuery.ts` : Hooks React Query génériques pour toute l'application

**Documentation mise à jour** :
- `docs/mobile/changelog.md` : Cette entrée
- Documentation inline dans `src/services/api.ts` pour la migration vers les vraies API

**Impact** :
- **Fondation solide** : Système de mocks centralisé et API wrapper unique prêt pour migration
- **Migration facile** : Pour remplacer les mocks par les vraies API, changer UNIQUEMENT `/src/services/api.ts`
- **Hooks réutilisables** : Tous les hooks React Query prêts à être utilisés dans les écrans
- **Types sûrs** : TypeScript garantit la cohérence des types entre mocks et hooks
- **Prêt pour Phase 3** : Base complète pour implémenter tous les écrans du MVP

**Prochaines étapes** :
- Utiliser les hooks `useTasks()`, `useQuickStats()`, etc. dans les écrans
- Implémenter tous les écrans du MVP avec les données mockées
- Migration future : Remplacer les mocks par les vraies API en modifiant uniquement `/src/services/api.ts`

---

## 2024-01-XX - HomeScreen migre entièrement vers SuiviButton/FilterChip/SuiviCard

**Type** : `refactor` | `ui` | `docs`

**Description** : Migration complète de HomeScreen vers les composants UI Suivi exclusifs. Aucun composant visuel brut de React Native Paper n'est utilisé sur cet écran.

**Détails** :
- **HomeScreen** :
  - **Boutons** : Utilise exclusivement `SuiviButton` avec variants :
    - "Create Task" : `variant="primary"` → `theme.colors.primary` (`#005CE6` via tokens Suivi)
    - "View All" : `variant="ghost"` → Bordure et texte `theme.colors.primary` (`#005CE6`)
    - "Clear All" : `variant="destructive"` → `theme.colors.error` (`#D32F2F` via tokens Suivi)
  - **Filtres** : Utilise exclusivement `FilterChip` :
    - Chip "All" sélectionnée par défaut (affiche immédiatement le bleu Suivi `#005CE6`)
    - Chips "Active" et "Done" avec fond `background.surface`, bordure `neutral[200]`
  - **Cards** : Utilise exclusivement `SuiviCard` :
    - "Task Completed" : `variant="default"` avec `elevation="sm"` (shadow)
    - "Upcoming Deadline" : `variant="outlined"` avec bordure
  - **Suppression complète** : Aucun `Button`, `Chip`, ou `Card` de `react-native-paper` utilisé
- **Correction tokens** :
  - `src/theme/tokens.ts` : Correction de `brand.primary` de `#FF00FF` (magenta) à `#005CE6` (bleu Suivi)
- **Verification** :
  - `SuiviButton` utilise bien `theme.colors.primary`, `theme.colors.onPrimary`, `theme.colors.error`
  - `FilterChip` et `SuiviCard` utilisent bien `tokens.colors.*` directement
  - `paper-theme.ts` utilise bien `tokens.colors.brand.primary` (`#005CE6`)
  - Aucun export brut de `MD3LightTheme` ou `MD3DarkTheme`

**Fichiers modifiés** :
- `src/theme/tokens.ts` : Correction `brand.primary` = `#005CE6` (au lieu de `#FF00FF`)
- `src/screens/HomeScreen.tsx` : Vérifié - utilise déjà uniquement `SuiviButton`, `FilterChip`, `SuiviCard`

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : 
  - Exemples concrets HomeScreen pour `SuiviButton`, `FilterChip`, `SuiviCard`
  - Mention explicite : "100% SuiviButton/FilterChip/SuiviCard, aucun Button/Chip/Card de Paper"
  - Mapping détaillé des tokens vers le thème Paper
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- HomeScreen n'utilise plus aucun composant visuel brut de React Native Paper
- Le style visible des boutons et chips dépend UNIQUEMENT des tokens Suivi et du thème personnalisé
- Cohérence garantie : tous les composants visuels utilisent les composants Suivi avec les tokens
- L'UI affiche clairement les couleurs Suivi (`#005CE6` bleu primaire visible sur boutons et chips sélectionnées)

---

## 2024-01-XX - Réécriture complète de paper-theme.ts avec tokens Suivi exclusifs

**Type** : `fix` | `refactor` | `docs`

**Description** : Réécriture complète de `paper-theme.ts` pour utiliser UNIQUEMENT les tokens Suivi. Aucune couleur MD3 générique n'est conservée. `SuiviButton` utilise maintenant `theme.colors` pour rester réactif au thème.

**Détails** :
- **paper-theme.ts** :
  - Réécriture complète de `suiviLightTheme` et `suiviDarkTheme`
  - **Toutes** les couleurs proviennent maintenant des tokens Suivi (`tokens.colors.*`)
  - Mapping complet :
    - `colors.primary` = `tokens.colors.brand.primary` (`#005CE6`)
    - `colors.primaryContainer` = `tokens.colors.brand.primaryLight` (`#4D8FFF`)
    - `colors.secondary` = `tokens.colors.accent.maize` (`#FDD447`)
    - `colors.background` = `tokens.colors.background.default` (`#FFFFFF` light) / `tokens.colors.background.dark` (`#121212` dark)
    - `colors.surface` = `tokens.colors.background.surface` (`#FAFAFA` light) / `tokens.colors.surface.dark` (`#1E1E1E` dark)
    - `colors.onPrimary` = `tokens.colors.text.onPrimary` (`#FFFFFF`)
    - `colors.onBackground` / `colors.onSurface` = `tokens.colors.text.primary` (light) / `tokens.colors.text.onPrimary` (dark)
    - `colors.error` = `tokens.colors.error` (`#D32F2F`)
    - `colors.outline` = `tokens.colors.border.default` / `tokens.colors.border.dark`
  - Ajout des propriétés MD3 requises : `scrim`, `backdrop`, `elevation`
  - `roundness` = `tokens.radius.sm` (12px)
- **SuiviButton** :
  - Utilise maintenant `useTheme()` pour accéder à `theme.colors.primary` et `theme.colors.onPrimary`
  - Variant `primary` : `theme.colors.primary` (vient de `paper-theme.ts` = tokens Suivi)
  - Variant `ghost` : Bordure et texte `theme.colors.primary`
  - Variant `destructive` : `theme.colors.error` (vient de `paper-theme.ts` = tokens Suivi)
  - Reste réactif au thème Paper (light/dark) tout en utilisant les couleurs Suivi
  - Continue d'utiliser les tokens pour spacing, radius, typography

**Fichiers modifiés** :
- `theme/paper-theme.ts` : Réécriture complète avec tokens Suivi exclusifs, ajout `scrim`, `backdrop`, `elevation`
- `src/components/ui/SuiviButton.tsx` : Utilisation de `useTheme()` et `theme.colors` au lieu de `tokens.colors` directement

**Documentation mise à jour** :
- `docs/mobile/design-system.md` :
  - Nouvelle section détaillée sur la personnalisation de `suiviLightTheme` et `suiviDarkTheme`
  - Mapping complet des tokens vers le thème Paper
  - Exemples concrets avec valeurs exactes
  - Mise à jour de la règle : `SuiviButton` utilise `theme.colors` pour réactivité au thème

**Impact** :
- Le thème Paper utilise maintenant **100% les tokens Suivi**, aucune couleur MD3 générique
- `SuiviButton` reste réactif au thème Paper (light/dark) tout en affichant les couleurs Suivi
- Cohérence garantie : toutes les couleurs du thème proviennent des tokens Suivi
- L'UI affiche maintenant clairement les couleurs Suivi (`#005CE6` bleu primaire, etc.)

---

## 2024-01-XX - Correction : Affichage visible des couleurs Suivi sur HomeScreen

**Type** : `fix` | `ui` | `refactor`

**Description** : Correction de l'écran Home pour qu'il affiche clairement et visiblement les couleurs Suivi au lieu des couleurs génériques de React Native Paper.

**Détails** :
- **FilterChip** :
  - Chip sélectionnée : Fond `tokens.colors.brand.primary` (`#005CE6`) au lieu de couleurs génériques
  - Chip non sélectionnée : Fond `tokens.colors.background.surface` (`#FAFAFA`) au lieu de `surface.default`
  - Bordure non sélectionnée : `tokens.colors.neutral[200]` (`#EEEEEE`) pour une meilleure visibilité
- **SuiviCard** :
  - Background : `tokens.colors.background.surface` (`#FAFAFA`) au lieu de `surface.default` pour un contraste clair
  - Shadow et radius depuis les tokens (elevation: sm/md)
- **ScreenContainer** :
  - Suppression de `useTheme()` et utilisation directe de `tokens.colors.background.default` (`#FFFFFF`)
  - Background maintenant 100% Suivi, pas de couleurs génériques MD3
- **HomeScreen** :
  - Chip "All" sélectionnée par défaut pour montrer immédiatement la couleur Suivi (`#005CE6`)
  - Tous les composants utilisent `SuiviButton`, `FilterChip`, `SuiviCard` (pas de composants Paper)
  - Tous les textes utilisent `tokens.colors.text.primary` et `text.secondary`
  - Boutons utilisent les variants : `primary` (brand.primary), `ghost` (border + texte brand.primary), `destructive` (error)
  - Cards utilisent `background.surface` pour un fond légèrement grisé visible

**Fichiers modifiés** :
- `src/components/ui/FilterChip.tsx` : `background.surface` et `neutral[200]` pour la bordure
- `src/components/ui/SuiviCard.tsx` : `background.surface` au lieu de `surface.default`
- `components/layout/ScreenContainer.tsx` : Suppression `useTheme()`, utilisation directe de `tokens.colors.background.default`
- `src/screens/HomeScreen.tsx` : Chip "All" sélectionnée par défaut, commentaires améliorés

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : Exemples concrets avec HomeScreen pour FilterChip, SuiviCard, SuiviButton
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- L'écran Home affiche maintenant clairement les couleurs Suivi :
  - Bleu Suivi (`#005CE6`) visible sur les chips sélectionnées et boutons primary
  - Fond légèrement grisé (`#FAFAFA`) sur les cards pour un contraste clair
  - Aucune couleur générique de React Native Paper visible
- L'UI reflète maintenant visuellement le design system Suivi

---

## 2024-01-XX - Correction : Intégration design system Suivi (tokens exclusifs)

**Type** : `fix` | `refactor` | `docs`

**Description** : Correction critique de l'intégration du design system Suivi pour utiliser EXCLUSIVEMENT les tokens dans les composants UI.

**Détails** :
- **ThemeProvider et paper-theme.ts** :
  - Correction : `theme.colors.secondary` = `tokens.colors.accent.maize` (`#FDD447`) au lieu de `tokens.colors.success`
  - `theme.colors.primary` = `tokens.colors.brand.primary` (`#005CE6`) ✅
  - `theme.colors.background` = `tokens.colors.background.default` (`#FFFFFF`) ✅
  - `theme.colors.surface` = `tokens.colors.background.surface` (`#FAFAFA`) ✅
  - Injection correcte des couleurs Suivi dans React Native Paper
- **SuiviButton** :
  - Suppression complète de `useTheme()` et `theme.colors`
  - Utilisation EXCLUSIVE de `tokens.colors.brand.primary`, `tokens.colors.error`, `tokens.colors.text.onPrimary`, `tokens.colors.text.disabled`, `tokens.colors.neutral[300]`
  - Variant `primary` : Fond `tokens.colors.brand.primary`, texte `tokens.colors.text.onPrimary`
  - Variant `ghost` : Fond transparent, bordure `tokens.colors.brand.primary`, texte `tokens.colors.brand.primary`
  - Variant `destructive` : Fond `tokens.colors.error`, texte `tokens.colors.text.onPrimary`
- **FilterChip** :
  - Suppression complète de `useTheme()` et `theme.colors`
  - Utilisation EXCLUSIVE de `tokens.colors.brand.primary`, `tokens.colors.surface.default`, `tokens.colors.border.default`, `tokens.colors.text.primary`, `tokens.colors.text.onPrimary`, `tokens.colors.text.disabled`, `tokens.colors.neutral[200]`
  - État `selected` : Fond `tokens.colors.brand.primary`, texte `tokens.colors.text.onPrimary`, bordure `tokens.colors.brand.primary`
  - État `default` : Fond `tokens.colors.surface.default`, texte `tokens.colors.text.primary`, bordure `tokens.colors.border.default`
- **SuiviCard** :
  - Suppression complète de `useTheme()` et `theme.colors`
  - Utilisation EXCLUSIVE de `tokens.colors.surface.default`, `tokens.colors.border.default`
  - Variant `default` : Fond `tokens.colors.surface.default` avec shadow
  - Variant `outlined` : Fond `tokens.colors.surface.default` avec bordure `tokens.colors.border.default`
- **Écrans Home et Tasks** :
  - Suppression de `useTheme()` et `theme.colors`
  - Utilisation de `tokens.colors.text.primary`, `tokens.colors.text.secondary`, `tokens.colors.error`, `tokens.colors.brand.primary` pour les ActivityIndicator
  - `getStatusColor()` utilise maintenant `tokens.colors` directement
  - Tous les styles utilisent les tokens (spacing, typography, colors)
- **Variants correctement utilisés** :
  - `SuiviButton` : `primary` (brand.primary), `ghost` (border + texte brand.primary), `destructive` (tokens.colors.error)
  - `SuiviCard` : `default` (shadow), `outlined` (border)
  - `FilterChip` : `selected` (brand.primary), `default` (surface)

**Fichiers modifiés** :
- `theme/paper-theme.ts` : `secondary` = `accent.maize` (light et dark theme)
- `src/components/ui/SuiviButton.tsx` : Suppression `useTheme()`, utilisation EXCLUSIVE de `tokens.colors.*`
- `src/components/ui/FilterChip.tsx` : Suppression `useTheme()`, utilisation EXCLUSIVE de `tokens.colors.*`
- `src/components/ui/SuiviCard.tsx` : Suppression `useTheme()`, utilisation EXCLUSIVE de `tokens.colors.*`
- `src/screens/HomeScreen.tsx` : Suppression `useTheme()`, utilisation de `tokens.colors.*`
- `src/screens/MyTasksScreen.tsx` : Suppression `useTheme()`, utilisation de `tokens.colors.*`, correction `getStatusColor()`

**Documentation mise à jour** :
- `docs/mobile/design-system.md` :
  - Règle importante ajoutée : Les composants UI utilisent EXCLUSIVEMENT les tokens (pas `theme.colors`)
  - Documentation `ThemeProvider` : Injection des couleurs Suivi dans React Native Paper
  - Documentation `SuiviButton`, `FilterChip`, `SuiviCard` : Tokens utilisés (EXCLUSIVEMENT) avec valeurs exactes
  - Variantes documentées avec tokens exacts
- `docs/mobile/coding-conventions.md` :
  - Règle stricte renforcée : Composants UI Suivi = EXCLUSIVEMENT `tokens.colors.*` (pas `theme.colors`)
  - Distinction claire : Composants UI Suivi vs écrans (composants UI = tokens exclusifs)
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- Séparation claire : Composants UI Suivi = tokens exclusifs, composants Paper = theme.colors
- Cohérence garantie : Toutes les couleurs Suivi passent par les tokens
- Maintenabilité : Changements globaux via tokens sans dépendre de React Native Paper
- Vérification : TypeScript compile sans erreurs, tous les composants utilisent les tokens

---

## 2024-01-XX - Phase 2 / UI Kit complet + Intégration dans l'app

**Type** : `feat` | `refactor` | `docs`

**Description** : Implémentation complète du UI Kit Suivi avec la palette officielle et intégration réelle dans les écrans Home et Tasks.

**Détails** :
- Mise à jour complète de `src/theme/tokens.ts` avec la palette Suivi officielle :
  - Brand Primary : `#005CE6` (light: `#4D8FFF`, dark: `#003FA3`)
  - Accent Maize : `#FDD447` (light: `#FFE89A`, dark: `#D7AD1D`)
  - Semantic colors : Success `#4CAF50`, Warning `#F9A825`, Error `#D32F2F`
  - Text colors : Primary `#1A1A1A`, Secondary `#5A5A5A`, OnPrimary `#FFFFFF`
  - Background : Default `#FFFFFF`, Surface `#FAFAFA`
- Renommage et harmonisation des composants UI :
  - `PrimaryButton.tsx` → `SuiviButton.tsx` (variants: primary, ghost, destructive)
  - `Card.tsx` → `SuiviCard.tsx` (variants: default avec shadow, outlined avec border)
  - `FilterChip.tsx` mis à jour avec les nouveaux tokens
- Mise à jour de `theme/paper-theme.ts` avec la nouvelle palette Suivi
- Intégration réelle dans les écrans :
  - **HomeScreen** : Utilise `SuiviCard`, `SuiviButton`, `FilterChip` avec exemples concrets (Quick Filters, Recent Activity cards, Actions buttons)
  - **MyTasksScreen** : Utilise `SuiviCard` pour les task items et `FilterChip` pour les filtres
  - Remplacement des styles inline par les tokens
  - Remplacement des couleurs hardcodées par les couleurs du design system
- Mise à jour de `src/theme/index.ts` pour exporter tokens et helpers
- Tous les imports mis à jour pour utiliser les nouveaux noms de composants

**Fichiers créés** :
- `src/theme/index.ts` (mise à jour complète)

**Fichiers renommés** :
- `src/components/ui/PrimaryButton.tsx` → `SuiviButton.tsx`
- `src/components/ui/Card.tsx` → `SuiviCard.tsx`

**Fichiers modifiés** :
- `src/theme/tokens.ts` (palette Suivi officielle complète)
- `src/components/ui/SuiviButton.tsx` (renommé, imports mis à jour)
- `src/components/ui/SuiviCard.tsx` (renommé, elevation mapping corrigé)
- `src/components/ui/FilterChip.tsx` (imports mis à jour)
- `theme/paper-theme.ts` (utilisation nouvelle palette Suivi)
- `theme/index.ts` (re-export depuis src/theme)
- `src/screens/HomeScreen.tsx` (intégration complète : SuiviCard, SuiviButton, FilterChip avec exemples)
- `src/screens/MyTasksScreen.tsx` (SuiviCard pour task items, FilterChip pour filtres)
- `src/screens/MoreScreen.tsx` (SuiviButton pour Sign Out)
- `components/ui/SuiviText.tsx` (correction fontSize/lineHeight pour correspondre aux tokens)

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : 
  - Mise à jour palette Suivi officielle (brand.primary `#005CE6`, accent.maize `#FDD447`, etc.)
  - Documentation `SuiviButton` (remplace PrimaryButton)
  - Documentation `SuiviCard` (remplace Card)
  - Documentation `FilterChip` mise à jour
  - Ajout des sections "Intégré dans" pour chaque composant
- `docs/mobile/architecture.md` : 
  - Documentation de `src/theme/tokens.ts` et `src/theme/index.ts`
  - Documentation des composants UI : SuiviButton, SuiviCard, FilterChip
- `docs/mobile/coding-conventions.md` : 
  - Règle renforcée : "Tout styling passe par tokens" (pas de valeurs hardcodées)
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- UI Kit complet : Tous les composants utilisent la palette Suivi officielle
- Intégration réelle : HomeScreen et MyTasksScreen consomment les composants du UI Kit
- Cohérence visuelle : Tous les styles passent par les tokens (spacing, radius, colors, typography)
- Maintenabilité : Changements globaux via tokens sans toucher aux composants
- Aucune partie non utilisée : Tous les composants sont intégrés et visibles dans l'app

---

## 2024-01-XX - Phase 2 / Step 5 : Introduction d'un design system mobile minimal (tokens + composants UI de base)

**Type** : `feat` | `refactor` | `docs`

**Description** : Mise en place d'un design system mobile minimal et tokenisé comprenant tokens centralisés et composants UI de base.

**Détails** :
- Amélioration de `theme/tokens.ts` avec structure claire (`colors.brand`, `colors.text`, etc.) pour backward compatibility
- Création de `FilterChip` pour les filtres (All, Open, Done) avec états selected/default
- Création de `Card` basique réutilisable pour les Tasks, sections, etc. (variantes: default avec shadow, outlined avec border)
- Amélioration de `PrimaryButton` avec variante `ghost` (transparent avec bordure) et renommage `danger` → `destructive`
- Application des nouveaux composants sur MyTasksScreen :
  - Remplacement des filtres custom par `FilterChip`
  - Remplacement des task items custom par `Card` pressable
  - Code simplifié, moins de duplication

**Fichiers créés** :
- `src/components/ui/FilterChip.tsx` (nouveau)
- `src/components/ui/Card.tsx` (nouveau)

**Fichiers modifiés** :
- `theme/tokens.ts` (ajout structure `colors.brand` pour clarté, backward compatibility maintenue)
- `src/components/ui/PrimaryButton.tsx` (ajout variante `ghost`, renommage `danger` → `destructive`)
- `src/screens/MyTasksScreen.tsx` (utilisation de `FilterChip` et `Card`, code simplifié)

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : 
  - Section complète "Tokens" avec structure et accès
  - Section "Composants UI de base" documentant PrimaryButton, FilterChip, Card (API, variantes, tokens utilisés)
  - Ajout principe "Pas de valeurs hardcodées"
- `docs/mobile/coding-conventions.md` : 
  - Règle stricte sur l'utilisation des tokens (styles bruts dans `tokens.ts`, pas dans composants)
  - Règle pour nouveaux composants UI (s'appuyer sur tokens)
- `docs/mobile/architecture.md` : 
  - Documentation complète de `/theme/` avec structure des tokens
  - Documentation de `/src/components/ui/` avec les 3 composants de base
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- Design system tokenisé : Tous les tokens centralisés dans `tokens.ts`
- Composants UI réutilisables : PrimaryButton, FilterChip, Card pour une cohérence visuelle
- Code plus simple : Moins de duplication, styles standardisés via tokens
- Maintenance facilitée : Changements globaux via tokens sans toucher aux composants

---

## 2024-01-XX - Phase 2 / Step 6 : Ajout d'un ThemeProvider, intégration avec React Native Paper, préparation light/dark theme

**Type** : `feat` | `refactor` | `docs`

**Description** : Création d'un ThemeProvider propre, basé sur le design system (tokens) et intégré avec React Native Paper, avec gestion light/dark (mode auto qui suit le système, ou mode forcé).

**Détails** :
- Création de `src/theme/ThemeProvider.tsx` qui encapsule `PaperProvider` de React Native Paper
- Gestion du mode de thème : `'light'`, `'dark'`, ou `'auto'` (suit le mode système via `useColorScheme()`)
- Expose `useThemeMode()` hook pour accéder au contexte et changer le mode de thème
- Intégration dans `App.tsx` : remplacement de `PaperProvider` direct par `ThemeProvider`
- Ajout de `AppContent` composant pour gérer la StatusBar selon le thème (light/dark)
- Mise à jour de `theme/index.ts` pour exporter `ThemeProvider` et `useThemeMode`

**Fichiers créés** :
- `src/theme/ThemeProvider.tsx` (nouveau)

**Fichiers modifiés** :
- `src/App.tsx` :
  - Remplacement de `PaperProvider` par `ThemeProvider`
  - Ajout de `AppContent` pour gérer StatusBar selon le thème
  - Structure des providers : QueryClientProvider → ThemeProvider → AuthProvider → NavigationContainer
- `theme/index.ts` (ajout exports ThemeProvider)

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : 
  - Section complète "Theme & Theming" avec :
    - Explication du `ThemeProvider` et de son rôle
    - Description des 3 modes (light, dark, auto)
    - Documentation lightTheme vs darkTheme
    - Exemples d'utilisation dans les composants (`useTheme()`, `useThemeMode()`)
    - Intégration dans l'entrée de l'app
- `docs/mobile/architecture.md` : 
  - Documentation du rôle de `src/theme/ThemeProvider.tsx`
  - Documentation de l'enchaînement `App.tsx -> ThemeProvider -> RootNavigator`
  - Mise à jour du schéma d'architecture (PaperProvider → ThemeProvider)
  - Mise à jour du flow de démarrage de l'app avec ThemeProvider
- `docs/mobile/coding-conventions.md` : 
  - Règles ajoutées :
    - "Les composants doivent éviter d'hardcoder les couleurs et utiliser le thème / tokens"
    - "L'ajout d'un nouveau composant doit être compatible avec le theming (au minimum pour le mode clair)"
  - Documentation complète de l'utilisation du thème (`useTheme()`, `useThemeMode()`)
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- Structure prête pour light/dark theme : ThemeProvider gère automatiquement le changement de thème
- Mode auto : Suit automatiquement le mode système (light/dark)
- Compatibilité : Tous les composants existants continuent de fonctionner (utilisent déjà `useTheme()`)
- Maintenabilité : Centralisation de la gestion du thème dans ThemeProvider
- Extensibilité : Structure prête pour une future UX de choix de thème (sauvegarde dans AsyncStorage/SecureStore)

**Notes** :
- Pour le MVP, la gestion du changement de thème est structurée mais peut être mockée (pas encore de sauvegarde utilisateur)
- Une vraie UX de choix de thème (avec sauvegarde) viendra plus tard si nécessaire
- Tous les composants utilisent déjà `useTheme()` donc ils s'adaptent automatiquement au thème light/dark

---

## 2024-01-XX - Phase 1 / Step 4 : Uniformisation des écrans via ScreenContainer/ScreenHeader

**Type** : `feat` | `refactor` | `docs`

**Description** : Uniformisation de tous les écrans avec une structure commune pour une UX cohérente et limiter les divergences sauvages.

**Détails** :
- Amélioration de `ScreenContainer` avec support du scroll optionnel (`scrollable` prop)
- Création de `ScreenHeader` standardisé (titre, sous-titre, bouton back, action à droite)
- Création de `PrimaryButton` réutilisable (variantes: primary, secondary, danger)
- Harmonisation de tous les écrans principaux :
  - HomeScreen : Utilise ScreenHeader
  - MyTasksScreen : Ajoute ScreenHeader avec titre "My Tasks"
  - NotificationsScreen : Utilise ScreenHeader
  - MoreScreen : Utilise ScreenHeader et PrimaryButton pour Sign Out
  - TaskDetailScreen : Utilise ScreenHeader avec bouton back et status badge à droite, Screen scrollable
- Suppression des headers custom redondants
- Suppression des styles inline redondants (titres, paddings, etc.)

**Fichiers créés** :
- `src/components/layout/ScreenHeader.tsx` (nouveau)
- `src/components/ui/PrimaryButton.tsx` (nouveau)

**Fichiers modifiés** :
- `components/layout/ScreenContainer.tsx` (ajout support scrollable)
- `src/components/Screen.tsx` (ajout support scrollable via ScreenContainer)
- `src/screens/HomeScreen.tsx` (utilise ScreenHeader, code simplifié)
- `src/screens/MyTasksScreen.tsx` (ajoute ScreenHeader)
- `src/screens/NotificationsScreen.tsx` (utilise ScreenHeader, code simplifié)
- `src/screens/MoreScreen.tsx` (utilise ScreenHeader et PrimaryButton)
- `src/screens/TaskDetailScreen.tsx` (utilise ScreenHeader avec back button, Screen scrollable)

**Documentation mise à jour** :
- `docs/mobile/design-system.md` : Section complète "Layout & Structure d'écran" avec ScreenContainer, ScreenHeader, PrimaryButton
- `docs/mobile/screens-overview.md` : Description mise à jour pour refléter la nouvelle structure unifiée
- `docs/mobile/coding-conventions.md` : Règles mises à jour sur la structure des écrans (Screen + ScreenHeader)
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- UX cohérente : Tous les écrans ont maintenant une structure commune
- Code plus simple : Moins de duplication, styles standardisés
- Maintenance facilitée : Changements globaux via ScreenContainer/ScreenHeader
- Meilleure expérience utilisateur : Headers cohérents, boutons uniformes

---

## 2024-01-XX - Phase 1 / Step 3 : Stabilisation de la navigation et ajout d'AppLoadingScreen

**Type** : `feat` | `refactor` | `docs`

**Description** : Refactor léger de la navigation avec organisation propre dans `src/navigation/`, ajout d'un AppLoadingScreen, et typage TypeScript complet.

**Détails** :
- Organisation de tous les fichiers de navigation dans `src/navigation/` (RootNavigator, MainTabNavigator, types.ts)
- Création de `AppLoadingScreen` pour gérer le chargement initial (restauration de session)
- Ajout de `src/navigation/types.ts` avec tous les types de navigation centralisés
- Typage TypeScript complet pour sécuriser la navigation (plus de `as any`)
- Ajout d'icônes MaterialCommunityIcons dans MainTabNavigator (home, check-circle, bell, dots-horizontal)
- Amélioration du typage dans MyTasksScreen et TaskDetailScreen

**Fichiers créés** :
- `src/navigation/RootNavigator.tsx` (déplacé depuis `/navigation/`)
- `src/navigation/types.ts` (nouveau)
- `src/screens/AppLoadingScreen.tsx` (nouveau)

**Fichiers modifiés** :
- `src/navigation/MainTabNavigator.tsx` (ajout icônes, typage amélioré)
- `src/App.tsx` (import RootNavigator depuis `./navigation/` au lieu de `../navigation/`)
- `src/screens/MyTasksScreen.tsx` (typage amélioré avec NativeStackNavigationProp)
- `src/screens/TaskDetailScreen.tsx` (typage amélioré avec AppStackParamList)

**Fichiers supprimés** :
- `navigation/RootNavigator.tsx` (déplacé vers `src/navigation/`)

**Documentation mise à jour** :
- `docs/mobile/navigation.md` : Documentation complète de AppLoadingScreen, nouvelle structure, types TypeScript
- `docs/mobile/screens-overview.md` : Ajout de AppLoadingScreen
- `docs/mobile/architecture.md` : Mise à jour de l'organisation de `src/navigation/`
- `docs/mobile/changelog.md` : Cette entrée

**Impact** :
- Navigation plus robuste avec typage complet
- Meilleure expérience utilisateur avec un écran de chargement propre
- Organisation du code plus claire (tous les navigateurs dans `src/navigation/`)
- Plus d'erreurs de typage dans la navigation

---

## 2024-01-XX - Initialisation du système de documentation automatique

**Type** : `docs` | `chore`

**Description** : Mise en place d'un système de documentation continue avec règles automatiques de mise à jour.

**Détails** :
- Création du fichier `changelog.md` pour suivre l'évolution du projet
- Mise en place de règles strictes de documentation automatique
- Vérification de cohérence de toute la documentation existante avec le code actuel

**Fichiers modifiés** :
- `docs/mobile/changelog.md` (créé)

**Documentation mise à jour** :
- Toutes les docs existantes vérifiées et validées comme cohérentes avec le code

---

## 2024-01-XX - Création de la documentation technique initiale

**Type** : `docs`

**Description** : Création de la documentation technique complète du projet mobile Suivi.

**Détails** :
- Documentation de l'architecture complète
- Documentation de la navigation (RootNavigator, MainTabNavigator)
- Documentation du flux d'authentification
- Documentation du design system (couleurs Suivi, typographies MD3)
- Vue d'ensemble de tous les écrans
- Contrats d'API attendus
- Conventions de code
- Guide d'environnement de développement

**Fichiers créés** :
- `docs/mobile/README.md`
- `docs/mobile/architecture.md`
- `docs/mobile/navigation.md`
- `docs/mobile/auth-flow.md`
- `docs/mobile/design-system.md`
- `docs/mobile/screens-overview.md`
- `docs/mobile/api-contract.md`
- `docs/mobile/coding-conventions.md`
- `docs/mobile/dev-environment.md`

---

## Format des entrées

Chaque entrée doit suivre ce format :

```markdown
## YYYY-MM-DD - Titre court et descriptif

**Type** : `feat` | `fix` | `docs` | `refactor` | `chore` | `perf` | `test`

**Description** : Description courte (1-2 phrases)

**Détails** :
- Point 1
- Point 2
- Point 3

**Fichiers modifiés** :
- `chemin/fichier.ts` (créé/modifié/supprimé)

**Documentation mise à jour** :
- `docs/mobile/fichier.md` (section mise à jour)
```

---

## Légende des types

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Modification de la documentation uniquement
- `refactor` : Refactoring du code (pas de changement fonctionnel)
- `chore` : Maintenance, configuration, dépendances
- `perf` : Amélioration de performance
- `test` : Ajout ou modification de tests

---

## Notes

- Les dates sont au format `YYYY-MM-DD`
- Les entrées sont triées par ordre chronologique inverse (plus récent en premier)
- Seules les modifications significatives sont documentées (pas les corrections de typo mineures)
- Chaque modification de code doit être accompagnée d'une mise à jour de la documentation correspondante

