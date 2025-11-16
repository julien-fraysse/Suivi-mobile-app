# MVP Overview - Suivi Mobile App

## Vue d'ensemble

Application mobile Suivi (React Native + Expo) avec navigation à onglets, design system custom (tokens + Inter / IBM Plex Mono), et architecture prête pour migration vers l'API Suivi réelle.

## Écrans du MVP

### 1. **LoginScreen** (`src/screens/LoginScreen.tsx`)

**Fonctionnalités** :
- Authentification mockée (email + password)
- Logo Suivi (light/dark selon le thème)
- Design system Suivi avec tokens

**Migration** : Remplacer `signIn()` dans `authApi.mock.ts` par un vrai appel API Suivi

---

### 2. **HomeScreen** (`src/screens/HomeScreen.tsx`)

**Fonctionnalités** :
- **Quick Actions** : Statistiques rapides (Active Tasks, Due Today)
- **Recent Activity** : Fil d'activité récent (5 dernières activités)
- **Actions** : 
  - Quick Capture : Modal pour capturer rapidement une idée/tâche
  - View All Tasks : Navigation vers MyTasksScreen

**Données** : Via `useQuickStats()` et `useActivityFeed()`

---

### 3. **MyTasksScreen** (`src/screens/MyTasksScreen.tsx`)

**Fonctionnalités** :
- **Filtres** : All / Active / Completed (chips)
- **Liste des tâches** : Pagination infinie
- **Quick Capture** : Même modal que HomeScreen
- **Empty State** : Message quand aucune tâche
- **Loading/Error States** : Skeleton loaders et retry

**Données** : Via `useTasks()` avec filtres et pagination

---

### 4. **TaskDetailScreen** (`src/screens/TaskDetailScreen.tsx`)

**Fonctionnalités** :
- Détails complets de la tâche (titre, description, statut, dates, projet, assigné)
- **Status Toggle** : Changer le statut (Todo → In Progress → Blocked → Done)
- **Activity Timeline** : Historique des actions sur la tâche
- **Navigation** : Retour vers MyTasksScreen

**Données** : Via `useTask(taskId)` et `useTaskActivity(taskId)`

**Synchronisation** : La modification du statut met à jour automatiquement la liste Tasks via React Query invalidation

---

### 5. **NotificationsScreen** (`src/screens/NotificationsScreen.tsx`)

**Fonctionnalités** :
- Liste des notifications avec indicateurs visuels (point bleu pour non lues)
- **Navigation** : Tap sur une notification → navigue vers TaskDetail (si `taskId` présent)
- **Mark as Read** : Marquer une notification comme lue au tap
- **Mark All as Read** : Bouton pour marquer toutes les notifications comme lues

**Données** : Via `useNotifications()` et `useMarkNotificationAsRead()`

---

### 6. **MoreScreen** (`src/screens/MoreScreen.tsx`)

**Fonctionnalités** :
- Profil utilisateur (nom, email, avatar, rôle)
- **Theme Settings** : Toggle Light / Dark / Auto
- **About** : Version de l'app (mock)
- **Sign Out** : Déconnexion

**Données** : Via `useUser()` pour le profil

---

## Architecture

### Couches

1. **UI Layer** (`src/screens/`, `src/components/`)
   - Écrans et composants réutilisables
   - Utilise uniquement les hooks React Query

2. **Hooks Layer** (`src/hooks/`)
   - Hooks React Query pour chaque ressource
   - Gestion du cache et de l'invalidation

3. **API Layer** (`src/api/`)
   - Fonctions API switchables (mock/real via `USE_MOCK_API`)
   - Types TypeScript partagés

4. **Mock Layer** (`src/api/*.mock.ts`)
   - Implémentations mockées (stockage en mémoire)
   - Simule les délais réseau

### Design System

**Tokens** : `/src/theme/tokens.ts`
- Couleurs : Brand (violet #4F5DFF), Accent (jaune #FDD447), Neutral (gris/sand)
- Typography : Inter (interface) + IBM Plex Mono (technique)
- Spacing, Radius, Shadows, Elevation

**Thème** : `/src/theme/ThemeProvider.tsx`
- Light / Dark / Auto (suit le système)
- Intégration React Native Paper

**Composants** : `/src/components/ui/`
- `SuiviButton`, `SuiviCard`, `SuiviText`, `SuiviTile`
- `FilterChip`, `TaskItem`, `NotificationItem`, `UserAvatar`
- `QuickCaptureModal`, `StatCard`

## Ce qui est Mock vs Prêt pour API

### ✅ Mock (actuellement)

- **Authentification** : `authApi.mock.ts` → `signIn()` retourne un token mock
- **Tâches** : `tasksApi.mock.ts` → Stockage en mémoire, mutations simulées
- **Notifications** : `notificationsApi.mock.ts` → Stockage en mémoire
- **Utilisateurs** : `usersApi.mock.ts` → Données mockées

### ✅ Prêt pour API (architecture en place)

- **Hooks React Query** : Prêts à fonctionner avec vraies API
- **Types TypeScript** : Définis et partagés
- **Gestion d'erreurs** : Loading/Error/Empty states implémentés
- **Navigation** : Complète et fonctionnelle
- **Theme** : Light/Dark mode fonctionnel

## Points d'extension prévus

### 1. Quick Capture → Création de tâche Suivi complète

**Actuel** : `quickCapture(text)` crée une tâche minimaliste dans le mock

**Futur** : Convertir les Quick Capture en tâches Suivi structurées complètes (côté desktop ou via API)

**Fichier** : `/src/api/tasks.ts` → fonction `quickCapture()`

---

### 2. Notifications Push

**Actuel** : Notifications mockées, pas de push

**Futur** : Intégrer Expo Notifications + Backend Suivi pour notifications push en temps réel

**Fichiers à créer** :
- `/src/services/pushNotifications.ts`
- Configuration Expo Notifications dans `app.json`

---

### 3. Création de tâche complète

**Actuel** : Seulement Quick Capture (minimaliste)

**Futur** : Écran de création de tâche complet avec :
- Titre, description, dates, projet, assigné, labels, etc.
- Navigation depuis MyTasksScreen

**Écran à créer** : `/src/screens/CreateTaskScreen.tsx`

---

### 4. Gestion de projets

**Actuel** : Affichage du nom du projet dans les tâches

**Futur** :
- Liste des projets
- Détails d'un projet
- Navigation Notifications → ProjectDetail

**Écrans à créer** :
- `/src/screens/ProjectsScreen.tsx`
- `/src/screens/ProjectDetailScreen.tsx`

---

### 5. Recherche et filtres avancés

**Actuel** : Filtres basiques (All / Active / Completed)

**Futur** :
- Recherche par texte
- Filtres par projet, assigné, dates
- Tri (date, priorité, statut)

---

### 6. Synchronisation offline

**Actuel** : Pas de stockage local

**Futur** :
- AsyncStorage ou SQLite pour cache local
- Synchronisation avec l'API Suivi au retour en ligne
- Indicateur de synchronisation

---

## Migration vers API Suivi

### Checklist

- [ ] Passer `USE_MOCK_API = false` dans `/src/config/environment.ts`
- [ ] Configurer l'URL de base dans `/src/api/client.ts`
- [ ] Implémenter les fonctions API dans `/src/api/*.ts`
- [ ] Tester chaque endpoint individuellement
- [ ] Vérifier que les hooks fonctionnent correctement
- [ ] Vérifier que tous les écrans s'affichent correctement
- [ ] Tester les mutations (updateTaskStatus, markNotificationRead, etc.)
- [ ] Vérifier la gestion d'erreurs (timeout, 401, 500, etc.)

### Documentation

- **Mock Data Architecture** : `docs/mobile/mock-data.md`
- **API Contract** : `docs/mobile/api-contract.md`
- **Design System** : `docs/mobile/design-system.md`

## Notes importantes

- **Aucune modification** des écrans/hooks nécessaire pour migrer vers la vraie API
- **Architecture scalable** : Facile d'ajouter de nouveaux endpoints
- **Types partagés** : Les types TypeScript sont définis dans `/src/api/*.ts`
- **Tests** : Architecture prête pour l'ajout de tests unitaires et d'intégration


