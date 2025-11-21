# Audit Header TaskDetailScreen — Préparation Refonte

**Date** : Analyse du code actuel  
**Objectif** : Préparer la refonte du header pour afficher uniquement un header React Navigation blanc avec bouton Back pill  
**Scope** : `TaskDetailScreen.tsx`, `AppHeader.tsx`, `Screen.tsx`, composants locaux

---

## SECTION 1 — Comment le header actuel fonctionne

### 1.1 Header React Navigation (Configuré via `useEffect`)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 116-123

```typescript
// Configure header avec bouton pill custom
useEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerLeft: () => <BackPillButton />,
    headerTitle: () => <HeaderTitle />,
  });
}, [navigation, theme]);
```

**Fonctionnement actuel** :
- ✅ Le header React Navigation est **ACTIF** (`headerShown: true`)
- ✅ Le bouton Back pill est rendu à gauche via `headerLeft: () => <BackPillButton />`
- ⚠️ Le logo Suivi est rendu au centre via `headerTitle: () => <HeaderTitle />` (À SUPPRIMER)

**Configuration React Navigation** :
- Dans `RootNavigator.tsx`, `TaskDetailScreen` a `headerShown: false` par défaut (ligne 40)
- Le `useEffect` dans TaskDetailScreen **surcharge** cette configuration et active le header

---

### 1.2 Composant BackPillButton (Local)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 30-65

**Emplacement** : Défini **localement** dans TaskDetailScreen.tsx (pas dans un fichier séparé)

**Structure** :
- Utilise `Pressable` avec styles inline
- Icône `MaterialIcons` "arrow-back" (18px, couleur #333)
- Texte traduit via `t('common.back')`
- Style pill : fond gris (#F3F4F6), borderRadius 24px, padding horizontal 14px

**Rendu** : Dans le header React Navigation via `headerLeft: () => <BackPillButton />` (ligne 120)

---

### 1.3 Composant HeaderTitle (Local, À SUPPRIMER)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 67-82

**Emplacement** : Défini **localement** dans TaskDetailScreen.tsx (pas dans un fichier séparé)

**Structure** :
- Affiche le logo Suivi centré (`SuiviLogo`)
- Adapte le variant selon le thème (dark/light)
- Dimensions : 136x34px

**Rendu** : Dans le header React Navigation via `headerTitle: () => <HeaderTitle />` (ligne 121)

**⚠️ ACTION REQUISE** : Retirer ce composant ET retirer `headerTitle` du `useEffect` (ligne 121) pour supprimer le logo du header

---

### 1.4 Header AppHeader dans le Body (À SUPPRIMER COMPLÈTEMENT)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Occurrences** : **3 endroits**

#### 1.4.1 Dans le render principal
**Ligne** : 207
```typescript
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Contexte** :
- Rendu dans le body scrollable (dans `<View style={styles.pagePadding}>`)
- Apparaît **juste après** l'ouverture du View principal
- Prend **~30px d'espace vertical** (paddingTop 14px + paddingBottom 16px selon AppHeader.tsx)

#### 1.4.2 Dans l'état Loading
**Ligne** : 165
```typescript
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Contexte** : Rendu dans le Screen avant le `centerContainer` (vue de chargement)

#### 1.4.3 Dans l'état Error
**Ligne** : 180
```typescript
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Contexte** : Rendu dans le Screen avant le `centerContainer` (vue d'erreur)

**⚠️ PROBLÈME** : Ces trois `<AppHeader />` dans le body créent un **doublon visuel** avec le header React Navigation qui est déjà actif

---

### 1.5 AppHeader.tsx (Référence uniquement)

**Fichier** : `src/components/AppHeader.tsx`

**Structure** :
- Logo Suivi centré (lignes 95-101)
- Bouton retour optionnel à gauche (lignes 77-93)
- Avatar optionnel à droite (lignes 104-117)
- Padding : `paddingTop: 14px`, `paddingBottom: tokens.spacing.lg` (16px) = **30px total**

**Utilisation dans TaskDetailScreen** : À retirer complètement (3 occurrences)

---

### 1.6 Screen.tsx (Pas de modification nécessaire)

**Fichier** : `src/components/Screen.tsx`

**Fonctionnement** :
- Wrapper simple qui délègue à `ScreenContainer`
- Prop `scrollable={true}` utilisée dans TaskDetailScreen (ligne 205)
- Ne gère **pas directement** le header
- **AUCUNE MODIFICATION REQUISE**

---

## SECTION 2 — Où se trouve l'ancien header interne

### 2.1 Dans le Body Principal (Render Normal)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Ligne** : 207

**Position exacte** :
```typescript
return (
  <Screen scrollable>
    <View style={styles.pagePadding}>
      <AppHeader showBackButton onBack={() => navigation.goBack()} />  // ← LIGNE 207
      
      {/* Task Overview Title */}
      <SuiviText variant="label" color="secondary" style={styles.overviewTitle}>
```

**Position dans la hiérarchie** :
1. `<Screen scrollable>` (ligne 205)
2. `<View style={styles.pagePadding}>` (ligne 206)
3. `<AppHeader />` (ligne 207) ← **ICI**
4. Sous-titre "Task overview" (ligne 210)
5. Titre de la tâche (ligne 215)

**Espace vertical occupé** : 30px (14px top + 16px bottom selon AppHeader.tsx)

---

### 2.2 Dans l'État Loading

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Ligne** : 165

**Position exacte** :
```typescript
if (isLoadingTask) {
  return (
    <Screen>
      <AppHeader showBackButton onBack={() => navigation.goBack()} />  // ← LIGNE 165
      <View style={styles.centerContainer}>
```

**Position dans la hiérarchie** :
1. `<Screen>` (ligne 164)
2. `<AppHeader />` (ligne 165) ← **ICI**
3. `<View style={styles.centerContainer}>` (ligne 166)

---

### 2.3 Dans l'État Error

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Ligne** : 180

**Position exacte** :
```typescript
if (taskError || !task) {
  return (
    <Screen>
      <AppHeader showBackButton onBack={() => navigation.goBack()} />  // ← LIGNE 180
      <View style={styles.centerContainer}>
```

**Position dans la hiérarchie** :
1. `<Screen>` (ligne 179)
2. `<AppHeader />` (ligne 180) ← **ICI**
3. `<View style={styles.centerContainer}>` (ligne 181)

---

## SECTION 3 — Ce qu'il faut supprimer plus tard

### 3.1 Supprimer AppHeader dans le Body

#### 3.1.1 Render Principal
**Ligne à supprimer** : 207
```typescript
// À SUPPRIMER COMPLÈTEMENT
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Contexte** : Juste après `<View style={styles.pagePadding}>` et avant le sous-titre "Task overview"

---

#### 3.1.2 État Loading
**Ligne à supprimer** : 165
```typescript
// À SUPPRIMER COMPLÈTEMENT
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Contexte** : Juste après `<Screen>` et avant `centerContainer`

---

#### 3.1.3 État Error
**Ligne à supprimer** : 180
```typescript
// À SUPPRIMER COMPLÈTEMENT
<AppHeader showBackButton onBack={() => navigation.goBack()} />
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Contexte** : Juste après `<Screen>` et avant `centerContainer`

---

### 3.2 Supprimer le Logo Suivi du Header React Navigation

#### 3.2.1 Retirer HeaderTitle du useEffect
**Ligne à modifier** : 121
```typescript
// AVANT
headerTitle: () => <HeaderTitle />,

// APRÈS (supprimer complètement cette ligne)
// OU remplacer par :
headerTitle: () => null,
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Contexte** : Dans le `useEffect` qui configure le header React Navigation

---

#### 3.2.2 Supprimer le composant HeaderTitle (Optionnel)
**Lignes à supprimer** : 67-82
```typescript
// À SUPPRIMER si non utilisé ailleurs
/**
 * HeaderTitle
 * ...
 */
function HeaderTitle() { ... }
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Note** : Ce composant sera inutilisé après suppression de `headerTitle` dans le `useEffect`

---

### 3.3 Nettoyer les Imports (Optionnel)

#### 3.3.1 Supprimer l'import AppHeader
**Ligne à supprimer** : 14
```typescript
// À SUPPRIMER si AppHeader n'est plus utilisé nulle part dans le fichier
import { AppHeader } from '../components/AppHeader';
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Vérification** : S'assurer qu'`AppHeader` n'est plus utilisé après les suppressions

---

#### 3.3.2 Supprimer l'import SuiviLogo (Si HeaderTitle est supprimé)
**Ligne à vérifier** : 15
```typescript
// À SUPPRIMER si HeaderTitle est supprimé ET si SuiviLogo n'est pas utilisé ailleurs
import { SuiviLogo } from '../../components/ui/SuiviLogo';
```

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Vérification** : Si `HeaderTitle` est supprimé et que `SuiviLogo` n'est utilisé nulle part, supprimer cet import

---

## SECTION 4 — Ce qu'il faut garder

### 4.1 Header React Navigation (À Modifier)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 116-123

**À GARDER ET MODIFIER** :
- ✅ Le `useEffect` qui configure le header React Navigation
- ✅ `headerShown: true` (garde le header actif)
- ✅ `headerLeft: () => <BackPillButton />` (garde le bouton pill)
- ❌ `headerTitle: () => <HeaderTitle />` (À SUPPRIMER ou remplacer par `null`)

**Modification requise** :
```typescript
useEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerStyle: {
      backgroundColor: '#FFFFFF', // Blanc (ou couleur du thème)
    },
    headerLeft: () => <BackPillButton />,  // ✅ GARDER
    headerTitle: () => null,  // ❌ SUPPRIMER le logo
  });
}, [navigation, theme]);
```

---

### 4.2 Composant BackPillButton (À Garder)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 30-65

**À GARDER INTÉGRALEMENT** :
- ✅ Définition complète du composant
- ✅ Styles inline (pill button)
- ✅ Navigation et traduction
- ✅ **AUCUNE MODIFICATION REQUISE**

---

### 4.3 Structure du Body (À Conserver)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 205-219

**À GARDER** :
- ✅ `<Screen scrollable>` (ligne 205)
- ✅ `<View style={styles.pagePadding}>` (ligne 206)
- ✅ Sous-titre "Task overview" (ligne 210-212)
- ✅ Titre de la tâche (ligne 215-219)
- ✅ Toutes les autres sections (Status, Quick Action, Details, Activity Timeline)

**⚠️ SEULE MODIFICATION** : Retirer `<AppHeader />` de la ligne 207

---

### 4.4 Styles (À Conserver avec Ajustements Potentiels)

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 533-542

**Styles à GARDER** :
- ✅ `pagePadding` (lignes 533-536) - Peut nécessiter un ajustement de `paddingTop`
- ✅ `overviewTitle` (lignes 537-542) - Peut nécessiter un ajustement de `marginTop`
- ✅ `taskTitleContainer` (lignes 543-546) - À garder tel quel
- ✅ Tous les autres styles

---

## SECTION 5 — Où placer le sous-titre + titre

### 5.1 Position Actuelle du Sous-titre et Titre

**Fichier** : `src/screens/TaskDetailScreen.tsx`  
**Lignes** : 209-219

**Structure actuelle** :
```typescript
<View style={styles.pagePadding}>
  <AppHeader showBackButton onBack={() => navigation.goBack()} />  // ← À SUPPRIMER
  
  {/* Task Overview Title */}
  <SuiviText variant="label" color="secondary" style={styles.overviewTitle}>
    {t('taskDetail.overview')}
  </SuiviText>

  {/* Task Title */}
  <View style={styles.taskTitleContainer}>
    <SuiviText variant="h1" style={styles.taskTitleText}>
      {task.title}
    </SuiviText>
  </View>
```

**Position relative** :
1. `AppHeader` (30px vertical) ← **À SUPPRIMER**
2. Sous-titre "Task overview" (`overviewTitle` avec `marginTop: tokens.spacing.lg` = 16px)
3. Titre de la tâche (`taskTitleContainer` avec `marginTop: 4px`)

---

### 5.2 Position Après Suppression d'AppHeader

**Structure cible** :
```typescript
<View style={styles.pagePadding}>
  {/* AppHeader supprimé */}
  
  {/* Task Overview Title - IMMÉDIATEMENT après l'ouverture de pagePadding */}
  <SuiviText variant="label" color="secondary" style={styles.overviewTitle}>
    {t('taskDetail.overview')}
  </SuiviText>

  {/* Task Title - Juste après le sous-titre */}
  <View style={styles.taskTitleContainer}>
    <SuiviText variant="h1" style={styles.taskTitleText}>
      {task.title}
    </SuiviText>
  </View>
```

**⚠️ PROBLÈME** : Après suppression d'`AppHeader` (30px), le sous-titre remontera de 30px. Il faudra ajuster les marges.

---

### 5.3 Recommandation pour le Positionnement

#### 5.3.1 Emplacement Final
**Le sous-titre et le titre DOIVENT rester EXACTEMENT où ils sont** (lignes 209-219)

**Justification** :
- La position actuelle est logique (sous-titre puis titre)
- L'ordre visuel est correct
- **SEULEMENT les marges doivent être ajustées**

#### 5.3.2 Ajustement des Marges Requis

**Option 1 : Ajuster `marginTop` de `overviewTitle`** (Recommandé)
```typescript
overviewTitle: {
  marginTop: tokens.spacing.xl, // Augmenter de lg (16px) à xl (24px) pour compenser
  // OU
  marginTop: tokens.spacing.lg + 14, // 16px + 14px = 30px pour compenser exactement AppHeader
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
},
```

**Option 2 : Ajuster `paddingTop` de `pagePadding`**
```typescript
pagePadding: {
  paddingHorizontal: tokens.spacing.lg,
  paddingTop: tokens.spacing.lg, // Augmenter de md (12px) à lg (16px)
  // OU
  paddingTop: tokens.spacing.md + 14, // 12px + 14px = 26px
},
```

**Option 3 : Combinaison des deux** (Plus précis)
```typescript
pagePadding: {
  paddingHorizontal: tokens.spacing.lg,
  paddingTop: tokens.spacing.md + 10, // 12px + 10px = 22px
},
overviewTitle: {
  marginTop: tokens.spacing.md, // Réduire de lg (16px) à md (12px)
  // Total : 22px + 12px = 34px (proche des 30px d'AppHeader + marge actuelle)
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
},
```

**⚠️ RECOMMANDATION** : Tester visuellement après suppression d'`AppHeader` et ajuster selon le rendu souhaité

---

## SECTION 6 — Risques de marges + propositions

### 6.1 Analyse de l'Espace Vertical Actuel

**Espace occupé actuellement** :
1. Header React Navigation natif : ~44-60px (hauteur standard)
2. `AppHeader` dans le body : **30px** (paddingTop 14px + paddingBottom 16px)
3. `pagePadding.paddingTop` : 12px (`tokens.spacing.md`)
4. `overviewTitle.marginTop` : 16px (`tokens.spacing.lg`)
5. **Total espacement avant sous-titre** : 30px + 12px + 16px = **58px**

**Espace après suppression d'AppHeader** :
1. Header React Navigation natif : ~44-60px (inchangé)
2. `pagePadding.paddingTop` : 12px (inchangé)
3. `overviewTitle.marginTop` : 16px (inchangé)
4. **Total espacement avant sous-titre** : 12px + 16px = **28px**

**⚠️ PROBLÈME** : Perte de **30px d'espacement** après suppression d'`AppHeader`

---

### 6.2 Risques Identifiés

#### 6.2.1 Contenu Trop Près du Header Natif

**Risque** : Après suppression d'`AppHeader`, le sous-titre sera trop proche du header React Navigation blanc

**Impact** : Aspect visuel trop serré, manque de respiration

**Solution** : Augmenter `overviewTitle.marginTop` ou `pagePadding.paddingTop` de ~20-30px

---

#### 6.2.2 Incohérence avec les Autres Écrans

**Risque** : Si d'autres écrans utilisent `AppHeader` dans le body, TaskDetailScreen aura un espacement différent

**Vérification requise** : Comparer avec les autres écrans pour maintenir une cohérence visuelle

---

#### 6.2.3 États Loading/Error Sans Espacement

**Risque** : Les états Loading/Error (lignes 165, 180) perdront également l'espace d'`AppHeader`

**Impact** : Le contenu centré remontera de 30px

**Solution** : Ajouter un `marginTop` au `centerContainer` dans ces états OU s'assurer que le header React Navigation est visible

---

### 6.3 Propositions d'Ajustement

#### Proposition 1 : Compensation Exacte (Recommandé)

**Objectif** : Compenser exactement les 30px perdus d'`AppHeader`

**Modification `overviewTitle`** :
```typescript
overviewTitle: {
  marginTop: tokens.spacing.lg + 14, // 16px + 14px = 30px (compensation exacte)
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
},
```

**Avantages** :
- Compensation exacte (30px)
- Aucun changement nécessaire à `pagePadding`
- Espacement identique avant/après

---

#### Proposition 2 : Compensation Partielle + Padding

**Objectif** : Répartir la compensation entre `pagePadding` et `overviewTitle`

**Modifications** :
```typescript
pagePadding: {
  paddingHorizontal: tokens.spacing.lg,
  paddingTop: tokens.spacing.md + 14, // 12px + 14px = 26px
},
overviewTitle: {
  marginTop: tokens.spacing.md, // Réduire de 16px à 12px
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
},
```

**Total compensation** : 26px + 12px = 38px (légèrement plus que 30px, meilleure respiration)

---

#### Proposition 3 : Ajustement Minimal

**Objectif** : Compenser uniquement l'espace critique

**Modification `overviewTitle`** :
```typescript
overviewTitle: {
  marginTop: tokens.spacing.xl, // Augmenter de lg (16px) à xl (24px)
  marginBottom: 12,
  fontSize: 16,
  fontWeight: '600',
},
```

**Compensation** : +8px (24px - 16px) seulement, le reste sera compensé par l'espace naturel du header natif

---

### 6.4 Recommandation Finale

**✅ PROPOSITION 1 (Compensation Exacte)** est recommandée pour :

1. **Prévisibilité** : Compensation exacte des 30px
2. **Simplicité** : Un seul style à modifier
3. **Cohérence** : Espacement visuel identique avant/après refonte

**Modification à appliquer** :
- Ligne 538 : `marginTop: tokens.spacing.lg + 14` (au lieu de `tokens.spacing.lg`)

**Test visuel requis** : Après suppression d'`AppHeader`, vérifier que l'espacement est acceptable. Ajuster de ±4-8px si nécessaire pour une meilleure respiration.

---

## SECTION 7 — Checklist avant refactor

### 7.1 Préparation

- [ ] Comprendre que le header React Navigation est déjà actif (via `useEffect`)
- [ ] Comprendre qu'`AppHeader` dans le body crée un doublon visuel
- [ ] Savoir que la suppression d'`AppHeader` libérera 30px d'espace vertical
- [ ] Vérifier que le header React Navigation blanc est cohérent avec l'UX globale

---

### 7.2 Modifications à Effectuer

#### Étape 1 : Modifier le Header React Navigation
- [ ] Modifier le `useEffect` (ligne 117-123) pour ajouter `headerStyle: { backgroundColor: '#FFFFFF' }`
- [ ] Retirer `headerTitle: () => <HeaderTitle />` et remplacer par `headerTitle: () => null`
- [ ] Vérifier que `headerLeft: () => <BackPillButton />` reste intact

#### Étape 2 : Supprimer AppHeader
- [ ] Supprimer `<AppHeader />` de la ligne 207 (render principal)
- [ ] Supprimer `<AppHeader />` de la ligne 165 (état Loading)
- [ ] Supprimer `<AppHeader />` de la ligne 180 (état Error)

#### Étape 3 : Ajuster les Marges
- [ ] Modifier `overviewTitle.marginTop` pour compenser la perte d'`AppHeader` (recommandation : `tokens.spacing.lg + 14`)
- [ ] Tester visuellement l'espacement
- [ ] Ajuster de ±4-8px si nécessaire pour respiration optimale

#### Étape 4 : Nettoyage Optionnel
- [ ] Supprimer le composant `HeaderTitle` (lignes 67-82) si non utilisé
- [ ] Supprimer l'import `AppHeader` (ligne 14) si non utilisé
- [ ] Supprimer l'import `SuiviLogo` (ligne 15) si `HeaderTitle` est supprimé et non utilisé ailleurs

---

### 7.3 Validation Visuelle

- [ ] Le header blanc s'affiche correctement en haut de l'écran
- [ ] Le bouton Back pill est visible et fonctionnel dans le header
- [ ] **AUCUN logo Suivi** n'apparaît dans le header React Navigation
- [ ] **AUCUN AppHeader** n'apparaît dans le body
- [ ] Le sous-titre "Task overview" est bien positionné (espacement correct)
- [ ] Le titre de la tâche est bien positionné (espacement correct)
- [ ] L'espacement vertical est cohérent avec le reste de l'app
- [ ] Les états Loading/Error affichent correctement le header React Navigation
- [ ] Le dark mode fonctionne correctement (fond blanc devient foncé si nécessaire)
- [ ] Le ScrollView fonctionne correctement (le header ne scroll pas avec le contenu)

---

### 7.4 Validation Technique

- [ ] Aucune erreur de linting après modifications
- [ ] Le header React Navigation est bien monté (pas de glitch visuel)
- [ ] La navigation retour fonctionne correctement
- [ ] Les dépendances du `useEffect` sont correctes (`[navigation, theme]`)
- [ ] Aucune régression sur les autres écrans (vérifier MyTasksScreen, HomeScreen, etc.)

---

### 7.5 Récapitulatif des Lignes à Modifier

| Ligne | Action | Modification |
|-------|--------|--------------|
| 117-123 | Modifier | `useEffect` : ajouter `headerStyle`, remplacer `headerTitle` |
| 121 | Supprimer/Modifier | `headerTitle: () => <HeaderTitle />` → `headerTitle: () => null` |
| 165 | Supprimer | `<AppHeader showBackButton onBack={() => navigation.goBack()} />` |
| 180 | Supprimer | `<AppHeader showBackButton onBack={() => navigation.goBack()} />` |
| 207 | Supprimer | `<AppHeader showBackButton onBack={() => navigation.goBack()} />` |
| 538 | Modifier | `marginTop: tokens.spacing.lg` → `marginTop: tokens.spacing.lg + 14` |
| 67-82 | Supprimer (Optionnel) | Composant `HeaderTitle` |
| 14 | Supprimer (Optionnel) | Import `AppHeader` |
| 15 | Supprimer (Optionnel) | Import `SuiviLogo` |

---

## 📝 Notes Finales

**État actuel** : Double header (React Navigation + AppHeader dans le body)  
**État cible** : Header React Navigation blanc uniquement avec bouton Back pill  
**Complexité** : Faible (suppression d'éléments, ajustement de marges)  
**Risque global** : Faible (attention à l'espacement vertical)

**Principe de base** :
1. Le header React Navigation est déjà actif via `useEffect`
2. `AppHeader` dans le body crée un doublon et prend de l'espace inutilement
3. Après suppression d'`AppHeader`, ajuster les marges pour maintenir l'espacement visuel
4. Le sous-titre et le titre restent à leur position actuelle (seules les marges changent)

**Recommandation finale** : Suivre **Proposition 1 (Compensation Exacte)** pour un résultat prévisible et cohérent.

