# Documentation Mobile Suivi

## Introduction

Bienvenue dans la documentation technique de l'application mobile Suivi. Cette documentation est destinée aux développeurs qui souhaitent comprendre l'architecture, contribuer au projet, ou intégrer une future API Suivi.

## Structure de la documentation

### 📐 [Architecture](./architecture.md)

Vue d'ensemble technique de l'application : structure des dossiers, responsabilités, flux de données, et points de connexion futurs avec l'API Suivi.

**À lire en premier** si vous débutez sur le projet.

### 🧭 [Navigation](./navigation.md)

Documentation complète de la navigation React Navigation : RootNavigator, MainTabNavigator, écrans, et comment ajouter de nouveaux écrans.

**À lire** si vous travaillez sur la navigation ou ajoutez de nouveaux écrans.

### 🔐 [Authentification](./auth-flow.md)

Flux d'authentification complet : LoginScreen, AuthProvider, stockage sécurisé du token, et points de branchement pour l'API d'authentification Suivi.

**À lire** si vous travaillez sur l'authentification ou branchez l'API d'auth.

### 🎨 [Design System](./design-system.md)

Documentation du design system : couleurs Suivi, typographies Material Design 3, spacing, composants UI, et intégration avec React Native Paper.

**À lire** si vous créez de nouveaux composants UI ou modifiez le design.

### 📱 [Vue d'ensemble des écrans](./screens-overview.md)

Cartographie de tous les écrans : route, navigateur, description, données consommées, et endpoints API futurs.

**À lire** si vous travaillez sur un écran spécifique ou ajoutez de nouvelles fonctionnalités.

### 🔌 [Contrats d'API](./api-contract.md)

Contrats d'API attendus côté mobile : endpoints, types TypeScript, structures de réponse, et comment remplacer les mocks par le backend réel.

**À lire** si vous branchez l'API Suivi ou ajoutez de nouveaux appels API.

### 📝 [Conventions de code](./coding-conventions.md)

Règles de code pour l'équipe : nommage, structure des fichiers, TypeScript, React Query, et bonnes pratiques.

**À lire** avant de commiter du code pour garantir la cohérence.

### 🛠️ [Environnement de développement](./dev-environment.md)

Guide complet pour configurer et lancer l'app en développement : prérequis, commandes, dépannage, et bonnes pratiques.

**À lire** lors de la première installation ou en cas de problème de configuration.

### 📋 [Changelog](./changelog.md)

Journal technique de tous les changements significatifs apportés au projet : fonctionnalités, corrections, refactorings, et mises à jour de documentation.

**À consulter** pour suivre l'évolution du projet et comprendre les modifications récentes.

## Navigation rapide

### Pour démarrer rapidement

1. **[Environnement de développement](./dev-environment.md)** : Configuration initiale
2. **[Architecture](./architecture.md)** : Comprendre la structure du projet
3. **[Conventions de code](./coding-conventions.md)** : Standards à suivre

### Pour brancher l'API Suivi

1. **[Contrats d'API](./api-contract.md)** : Endpoints attendus
2. **[Authentification](./auth-flow.md)** : Flow d'auth et branchement API
3. **[Architecture](./architecture.md)** : Points de connexion API

### Pour ajouter une nouvelle fonctionnalité

1. **[Conventions de code](./coding-conventions.md)** : Standards de code
2. **[Navigation](./navigation.md)** : Ajouter un nouvel écran
3. **[Design System](./design-system.md)** : Utiliser les composants et tokens
4. **[Vue d'ensemble des écrans](./screens-overview.md)** : Pattern existant

### Pour créer un nouveau composant UI

1. **[Design System](./design-system.md)** : Tokens, couleurs, typographies
2. **[Conventions de code](./coding-conventions.md)** : Structure et nommage

## Points importants

### Architecture actuelle

- **Framework** : React Native + Expo SDK 54
- **Navigation** : React Navigation v7
- **State Management** : React Query pour les données serveur, Context pour l'auth
- **UI** : React Native Paper (Material Design 3)
- **TypeScript** : Typage strict

### État du projet

- ✅ **Phase 1 - Fondation** : Architecture complète
- ✅ **Phase 2 - Design System** : Tokens Suivi complets, polices Inter + IBM Plex Mono
- ✅ **Phase 3 - MVP Mock** : **100% COMPLETE 🔥**
  - ✅ Foundation : Mocks centralisés (`/src/mocks/suiviMock.ts`), API wrapper (`/src/services/api.ts`), Hooks React Query (`/src/hooks/useSuiviQuery.ts`)
  - ✅ Écrans MVP : HomeScreen, MyTasksScreen, TaskDetailScreen, NotificationsScreen, MoreScreen
  - ✅ Composants UI : StatCard, TaskItem, NotificationItem, UserAvatar
  - ✅ Navigation : RootNavigator + MainTabNavigator avec style Suivi (tokens exclusifs)
  - ✅ Documentation : screens.md, components.md, navigation.md, roadmap.md
- ⏳ **Phase 4 - Intégration API** : Migration vers vraies API (changer uniquement `/src/services/api.ts`)
- ⏳ **Phase 5 - Fonctionnalités avancées** : CRUD tâches, projets, notifications push, etc.

### Points de branchement API

**RÈGLE ABSOLUE** : Pour remplacer les mocks par les vraies API, changer **UNIQUEMENT** `/src/services/api.ts`.

**Architecture actuelle** :
- **Mocks** : `/src/mocks/suiviMock.ts` (données mockées)
- **API Wrapper** : `/src/services/api.ts` (pointe vers mocks pour l'instant)
- **Hooks** : `/src/hooks/useSuiviQuery.ts` (React Query vers api.ts)
- **Écrans** : `/src/screens/*` (utilisent les hooks uniquement)

**Migration vers vraies API** :
1. Modifier `/src/services/api.ts` pour remplacer les appels mocks par les vraies fonctions API
2. Aucun changement nécessaire dans les écrans ou hooks
3. Les types doivent rester compatibles

Voir `/src/services/api.ts` pour le guide de migration détaillé et `/docs/mobile/roadmap.md` pour la roadmap complète.

## Contribuer

### Avant de commiter

1. ✅ Lire les [Conventions de code](./coding-conventions.md)
2. ✅ Vérifier que l'app démarre sans erreur
3. ✅ Vérifier TypeScript (`npx tsc --noEmit`)
4. ✅ Tester sur iOS et/ou Android si possible

### Structure des commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug
- `docs:` : Documentation
- `style:` : Formatage (pas de changement de code)
- `refactor:` : Refactoring
- `test:` : Tests
- `chore:` : Maintenance

**Exemple** :
```bash
git commit -m "feat: add ProjectsScreen with React Query hook"
```

## Questions ?

Si vous avez des questions ou des suggestions d'amélioration :

1. Consulter la documentation correspondante ci-dessus
2. Vérifier les commentaires dans le code (notamment les `TODO`)
3. Contacter l'équipe backend Suivi pour les questions d'API

## Mise à jour de la documentation

Cette documentation est **maintenue automatiquement** à chaque modification du code grâce à un système de règles strictes.

**Règles de mise à jour automatique** :

1. **Écrans** → Mise à jour de `screens-overview.md` et `navigation.md`
2. **API / Mocks** → Mise à jour de `api-contract.md`
3. **UI / Composants / Thème** → Mise à jour de `design-system.md`
4. **Architecture / Navigation / Structure** → Mise à jour de `architecture.md`
5. **Toute évolution significative** → Entrée dans `changelog.md`

**La documentation est garantie à 100% synchronisée avec le code.** 📚

