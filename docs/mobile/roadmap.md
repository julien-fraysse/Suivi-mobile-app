# Roadmap Mobile Suivi

## Vue d'ensemble

Cette roadmap décrit l'évolution prévue de l'application mobile Suivi, depuis le MVP actuel jusqu'à la version complète.

## État actuel : MVP Phase 3 (100% Complète)

### ✅ Phase 1 : Fondation (Complète)
- Architecture de navigation (RootNavigator, MainTabNavigator)
- Système d'authentification (AuthProvider, SecureStore)
- Design system Suivi (tokens, thème, composants UI)
- Structure de base des écrans

### ✅ Phase 2 : Design System (Complète)
- Tokens Suivi complets (couleurs, spacing, radius, typography)
- Polices Inter et IBM Plex Mono intégrées
- Composants UI Suivi (SuiviButton, SuiviCard, SuiviText, FilterChip, SuiviTile)
- Thème React Native Paper personnalisé
- Documentation design system complète

### ✅ Phase 3 : MVP Mock (100% Complète)
- **Foundation** :
  - Module de mocks centralisé (`/src/mocks/suiviMock.ts`)
  - Module API unique (`/src/services/api.ts`)
  - Hooks React Query génériques (`/src/hooks/useSuiviQuery.ts`)
- **Écrans MVP** :
  - HomeScreen (Quick Actions, Quick Filters, Activity Feed, Calls to Action)
  - MyTasksScreen (Liste, filtres, empty state, create task mock)
  - TaskDetailScreen (Détails, status toggle, breadcrumb, recent updates)
  - NotificationsScreen (Liste, mark as read)
  - MoreScreen (Profil, paramètres thème, about)
- **Composants UI** :
  - StatCard (Quick Actions)
  - TaskItem (Liste des tâches)
  - NotificationItem (Liste des notifications)
  - UserAvatar (Avatar initiales)
- **Navigation** :
  - RootNavigator avec style Suivi
  - MainTabNavigator avec TabBar style Suivi (tokens exclusifs)
  - Navigation typée TypeScript complète
- **Documentation** :
  - `docs/mobile/screens.md` : Documentation complète des écrans
  - `docs/mobile/components.md` : Documentation complète des composants
  - `docs/mobile/design-system.md` : Design system Suivi complet
  - `docs/mobile/navigation.md` : Navigation avec style Suivi
  - `docs/mobile/changelog.md` : Changelog complet

---

## Phase 4 : Intégration API (À venir)

### Objectif
Remplacer les mocks par les vraies API Suivi en modifiant UNIQUEMENT `/src/services/api.ts`.

### Migration API

**Fichier à modifier** : `/src/services/api.ts`

**Étapes** :
1. Importer les vraies fonctions API depuis `/src/api/tasks.ts`, `/src/api/projects.ts`, etc.
2. Adapter les signatures pour passer `accessToken` si nécessaire
3. Remplace les appels mocks par les vraies fonctions API
4. Tester chaque endpoint individuellement
5. Vérifier que les types restent compatibles

**Documentation** : Voir `/src/services/api.ts` pour le guide de migration détaillé.

### Impact
- **Aucun changement dans les écrans** : Les hooks et composants restent identiques
- **Aucun changement dans les composants** : Tout continue de fonctionner
- **Types compatibles** : Les types doivent rester identiques entre mocks et vraies API

---

## Phase 5 : Fonctionnalités avancées (À venir)

### Fonctionnalités prévues

#### 5.1 Gestion des tâches
- Création de tâches (formulaire)
- Édition de tâches
- Suppression de tâches
- Attribution de tâches
- Changement de statut (avec API)

#### 5.2 Gestion des projets
- Liste des projets
- Détails d'un projet
- Création de projet
- Filtrage par projet

#### 5.3 Notifications
- Notifications push (expo-notifications)
- Mark as read (API)
- Filtrage des notifications
- Badges de notification

#### 5.4 Profil utilisateur
- Édition du profil
- Upload d'avatar
- Préférences utilisateur

#### 5.5 Recherche et filtres
- Recherche globale (tâches, projets)
- Filtres avancés
- Tri des résultats

#### 5.6 Mode offline
- Cache local (AsyncStorage)
- Sync offline/online
- Gestion des conflits

---

## Phase 6 : Polish et Performance (À venir)

### Optimisations

#### 6.1 Performance
- Optimisation des listes (FlatList, VirtualizedList)
- Lazy loading des images
- Memoization des composants
- Code splitting si nécessaire

#### 6.2 UX/UI
- Animations fluides
- Transitions entre écrans
- Feedback visuel (loading, success, error)
- Empty states améliorés

#### 6.3 Accessibilité
- Support VoiceOver (iOS) / TalkBack (Android)
- Labels accessibles
- Contraste des couleurs
- Taille de texte ajustable

#### 6.4 Tests
- Tests unitaires (Jest)
- Tests d'intégration
- Tests E2E (Detox ou Maestro)
- Tests de régression visuelle

---

## Phase 7 : Publication (À venir)

### Préparation à la publication

#### 7.1 Configuration
- App Store Connect (iOS)
- Google Play Console (Android)
- Configuration des builds de production
- Certificats et provisioning profiles

#### 7.2 Assets
- Icônes d'app (toutes les tailles)
- Splash screens (iOS et Android)
- Screenshots pour stores
- Description et metadata

#### 7.3 Déploiement
- Build de production (EAS Build)
- Upload sur les stores
- Configuration de la distribution (TestFlight, Internal Testing)
- Monitoring et analytics

---

## Principes de développement

### Règles strictes

1. **Aucune donnée hardcodée** : Toutes les données viennent de `api.ts` via les hooks
2. **Design system exclusif** : Utilisation uniquement des tokens Suivi
3. **Types TypeScript** : Typage complet pour éviter les erreurs
4. **Documentation** : Toute modification doit être documentée dans `changelog.md`
5. **Migration facile** : Structure prête pour migration API sans casser les écrans

### Architecture

- **Mocks** : `/src/mocks/suiviMock.ts` (données mockées)
- **API** : `/src/services/api.ts` (wrapper vers mocks ou vraies API)
- **Hooks** : `/src/hooks/useSuiviQuery.ts` (React Query vers api.ts)
- **Écrans** : `/src/screens/*` (utilisation des hooks uniquement)
- **Composants** : `/src/components/ui/*` (composants réutilisables)

### Migration vers vraies API

**1 clic** : Modifier uniquement `/src/services/api.ts`

```typescript
// Avant (mocks)
import * as mock from '../mocks/suiviMock';
export const api = {
  getTasks: mock.getTasks,
  // ...
};

// Après (vraies API)
import { getMyTasks } from '../api/tasks';
export const api = {
  getTasks: async (params, accessToken) => {
    return getMyTasks(accessToken, params);
  },
  // ...
};
```

---

## Notes de développement

- **MVP actuel** : 100% mocké, prêt pour démo
- **Migration API** : Structure prête, changement simple dans api.ts
- **Extensibilité** : Architecture modulaire pour ajouter facilement des fonctionnalités
- **Documentation** : Complète et à jour pour chaque phase

---

## Prochaines étapes

1. **Phase 4** : Intégration API Suivi (migration vers vraies API)
2. **Phase 5** : Fonctionnalités avancées (CRUD tâches, projets, etc.)
3. **Phase 6** : Polish et performance (optimisations, animations, tests)
4. **Phase 7** : Publication (build production, stores)


