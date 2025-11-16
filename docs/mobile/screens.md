# Screens Documentation

## Vue d'ensemble

Cette documentation décrit tous les écrans du MVP Suivi mobile, leur structure, leurs données, et leur utilisation du design system.

**RÈGLE ABSOLUE** : Toutes les données viennent de `/src/services/api.ts` via les hooks React Query. Aucune donnée hardcodée dans les écrans.

---

## HomeScreen

**Fichier** : `src/screens/HomeScreen.tsx`

**Description** : Écran d'accueil avec statistiques rapides, fil d'activité et actions principales.

### Fonctionnalités

- **Quick Actions** : Statistiques rapides affichées dans des `StatCard`
  - Active Tasks (depuis `useQuickStats().activeTasks`)
  - Due Today (depuis `useQuickStats().dueToday`)
- **Activity Feed** : Fil d'activité récent (depuis `useActivityFeed(5)`)
- **Actions** : Boutons d'action (`SuiviButton`)
  - **Quick Capture** : Ouvre un modal pour capturer rapidement une tâche minimaliste (inbox mobile)
  - **View All Tasks** : Navigation vers MyTasksScreen

**Note** : 
- Les filtres de tâches sont disponibles sur l'écran Tasks (MyTasksScreen), pas sur Home.
- Les tâches complexes sont créées côté desktop. Le mobile permet uniquement une capture rapide (Quick Capture) pour l'inbox mobile, qui sera convertie en tâches Suivi complètes côté desktop.

### Hooks utilisés

- `useQuickStats()` : Statistiques rapides
- `useActivityFeed(5)` : Fil d'activité (5 derniers)
- `useCreateQuickCaptureItem()` : Créer un item Quick Capture (via QuickCaptureModal)

### Composants design system

- `Screen` : Conteneur principal
- `ScreenHeader` : Header avec titre et sous-titre
- `StatCard` : Cards pour les statistiques (Quick Actions)
- `SuiviCard` : Cards pour les activités
- `SuiviButton` : Boutons d'action (primary, ghost, destructive)
- `SuiviText` : Textes typographiés
- `QuickCaptureModal` : Modal pour capturer rapidement une tâche minimaliste

### Données

Toutes les données viennent de `api.getQuickStats()` et `api.getActivityFeed()` via les hooks.

---

## MyTasksScreen (TasksScreen)

**Fichier** : `src/screens/MyTasksScreen.tsx`

**Description** : Liste des tâches avec filtres, pagination infinie et empty state.

### Fonctionnalités

- **Liste des tâches** : Liste paginée avec `FlatList` et pagination infinie
- **Filtres** : All / Active / Completed (`FilterChip`)
- **Empty State** : Affichage quand aucune tâche avec bouton "Create Task"
- **Actions** : Create Task (mock) dans la barre d'action

### Hooks utilisés

- `useTasks({ filters, pageSize: 20 })` : Tâches avec pagination infinie et filtres

### Composants design system

- `Screen` : Conteneur principal
- `ScreenHeader` : Header avec titre "My Tasks"
- `SuiviButton` : Bouton "Create Task" (primary)
- `FilterChip` : Chips de filtrage (All, Active, Completed)
- `SuiviCard` : Cards pour chaque tâche avec statut coloré
- `SuiviText` : Textes typographiés
- `ActivityIndicator` : Loading states

### Données

Toutes les données viennent de `api.getTasks()` via `useTasks()`.

### États

- **Loading** : Spinner avec texte "Loading tasks..."
- **Error** : Message d'erreur
- **Empty** : Empty state avec message et bouton "Create Task"
- **Success** : Liste des tâches avec pagination infinie

### Couleurs de statut

- `todo` : `tokens.colors.brand.primary` (#4F5DFF)
- `in_progress` : `tokens.colors.accent.maize` (#FDD447)
- `blocked` : `tokens.colors.semantic.error` (#D32F2F)
- `done` : `tokens.colors.semantic.success` (#00C853)

---

## TaskDetailScreen

**Fichier** : `src/screens/TaskDetailScreen.tsx`

**Description** : Détails d'une tâche avec status toggle, breadcrumb projet, utilisateur assigné et mises à jour récentes.

### Fonctionnalités

- **Détails de la tâche** : Titre, statut, projet, assigné, date d'échéance, date de mise à jour
- **Status Toggle** : Bouton pour changer le statut (mock, cycle : todo → in_progress → blocked → done)
- **Breadcrumb projet** : Affichage du nom du projet
- **Assigned User** : Affichage de l'assigné avec nom complet (depuis `useUser()`)
- **Recent Updates** : Section avec les mises à jour récentes filtrées par taskId (depuis `useActivityFeed(10)`)

### Hooks utilisés

- `useTask(taskId)` : Détails de la tâche
- `useUser()` : Utilisateur actuel (pour afficher l'assigné)
- `useActivityFeed(10)` : Fil d'activité (filtré par taskId)

### Composants design system

- `Screen` : Conteneur principal (scrollable)
- `ScreenHeader` : Header avec titre, sous-titre (statut) et bouton back
- `SuiviButton` : Bouton pour toggle le statut (primary)
- `SuiviCard` : Cards pour les détails et les activités
- `SuiviText` : Textes typographiés

### Données

Toutes les données viennent de `api.getTaskById()`, `api.getUser()`, et `api.getActivityFeed()` via les hooks.

### États

- **Loading** : Spinner avec texte "Loading task..."
- **Error** : Message d'erreur
- **Success** : Détails complets de la tâche avec activités

---

## NotificationsScreen

**Fichier** : `src/screens/NotificationsScreen.tsx`

**Description** : Liste des notifications avec marquage comme lues.

### Fonctionnalités

- **Liste des notifications** : Liste avec `FlatList`
- **Mark as Read** : Tap sur une notification pour la marquer comme lue (mock)
- **Mark All as Read** : Bouton pour marquer toutes comme lues (mock)
- **Visual indicators** : Badge pour les notifications non lues (point bleu)

### Hooks utilisés

- `useNotifications()` : Liste de toutes les notifications

### Composants design system

- `Screen` : Conteneur principal
- `ScreenHeader` : Header avec titre et sous-titre (compte des non lues)
- `SuiviButton` : Bouton "Mark All as Read" (ghost)
- `SuiviCard` : Cards pour chaque notification
  - Variant `default` avec elevation pour non lues
  - Variant `outlined` pour lues
- `SuiviText` : Textes typographiés

### Données

Toutes les données viennent de `api.getNotifications()` via `useNotifications()`.

### États

- **Loading** : Spinner avec texte "Loading notifications..."
- **Error** : Message d'erreur
- **Empty** : Empty state avec message "No notifications"
- **Success** : Liste des notifications avec indicateurs visuels

### Indicateurs visuels

- **Non lue** : Bordure gauche bleue (4px), point bleu (8px), elevation card
- **Lue** : Variant outlined, pas de point, elevation sm

---

## MoreScreen

**Fichier** : `src/screens/MoreScreen.tsx`

**Description** : Écran de profil, paramètres et informations.

### Fonctionnalités

- **Profil utilisateur** : Avatar avec initiales, nom complet, email, rôle (depuis `useUser()`)
- **Paramètres thème** : Toggle entre auto/light/dark (depuis `useThemeMode()`)
- **About** : Version app (mock : "1.0.0"), Design System version
- **Sign Out** : Bouton de déconnexion (depuis `useAuth()`)

### Hooks utilisés

- `useUser()` : Profil utilisateur actuel
- `useThemeMode()` : Mode de thème (light/dark/auto)
- `useAuth()` : Fonction de déconnexion

### Composants design system

- `Screen` : Conteneur principal (scrollable)
- `ScreenHeader` : Header avec titre "More"
- `SuiviCard` : Cards pour profil, paramètres, about
- `SuiviButton` : Boutons (theme toggle: ghost, sign out: destructive)
- `SuiviText` : Textes typographiés

### Données

- Profil : `api.getUser()` via `useUser()`
- Thème : `useThemeMode()` (local state)
- Version app : Mock ("1.0.0")

### Avatar

Avatar circulaire (64x64) avec :
- Fond : `tokens.colors.brand.primary`
- Initiales : Premières lettres du prénom et nom
- Texte : Blanc, variant h1, bold

### Toggle thème

Cycle : `auto` → `light` → `dark` → `auto`

---

## Architecture des écrans

### Structure commune

Tous les écrans suivent cette structure :

```typescript
export function ScreenName() {
  // 1. Hooks pour les données (depuis api.ts)
  const { data, isLoading, isError, error } = useHook();

  // 2. Handlers (mocks ou navigation)
  const handleAction = () => {
    // ...
  };

  // 3. États (loading, error, empty, success)
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!data || data.length === 0) return <EmptyState />;

  // 4. Render principal
  return (
    <Screen>
      <ScreenHeader title="..." />
      {/* Contenu */}
    </Screen>
  );
}
```

### Règles strictes

1. **Aucune donnée hardcodée** : Toutes les données viennent de `api.ts` via les hooks
2. **Design system exclusif** : Utilisation uniquement des composants Suivi (SuiviButton, SuiviCard, SuiviText, etc.)
3. **Tokens uniquement** : Styles avec `tokens.spacing`, `tokens.colors`, `tokens.typography`, `tokens.radius`
4. **États gérés** : Loading, error, empty states pour tous les écrans
5. **Navigation typée** : Utilisation de `NativeStackNavigationProp` pour la navigation

### Hooks disponibles

- `useTasks({ filters, pageSize })` : Tâches avec pagination infinie
- `useTask(taskId)` : Détails d'une tâche
- `useProjects()` : Liste des projets
- `useNotifications()` : Liste des notifications
- `useUser()` : Utilisateur actuel
- `useQuickStats()` : Statistiques rapides
- `useActivityFeed(limit)` : Fil d'activité

### Composants design system

- `Screen` : Conteneur principal avec SafeAreaView et padding
- `ScreenHeader` : Header standardisé avec titre, sous-titre, bouton back, action à droite
- `SuiviButton` : Boutons (variants: primary, ghost, destructive)
- `SuiviCard` : Cards (variants: default avec shadow, outlined avec border)
- `SuiviTile` : Tiles pour KPIs et shortcuts (fond primary, texte inverse)
- `FilterChip` : Chips de filtrage (selected/default)
- `SuiviText` : Textes typographiés (variants: display, h1, h2, body, label, caption, mono)
- `SuiviText` : Textes avec couleurs (primary, secondary, disabled, hint, inverse)

---

## Migration vers vraies API

Quand les vraies API seront disponibles :

1. **Modifier uniquement `/src/services/api.ts`** : Remplacer les appels mocks par les vraies fonctions API
2. **Aucun changement dans les écrans** : Les hooks et composants restent identiques
3. **Types compatibles** : Les types doivent rester compatibles entre mocks et vraies API

Voir la documentation dans `/src/services/api.ts` pour le guide de migration détaillé.

---

## Notes de développement

- Tous les écrans utilisent React Query pour le cache et la gestion des états
- Les mocks simulent des délais réseau (100-300ms) pour plus de réalisme
- Les états loading/error sont gérés de manière cohérente sur tous les écrans
- La navigation est typée avec TypeScript pour éviter les erreurs
- Le design system garantit la cohérence visuelle entre tous les écrans

