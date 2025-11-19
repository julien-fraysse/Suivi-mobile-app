# 🔍 AUDIT ULTRA CIBLÉ : MyTasksScreen.tsx - Header (Date, Titre, Filtres)

**Date** : 2024-11-19  
**Objectif** : Diagnostic précis des conteneurs Date, Titre et Filtres pour alignement avec la Home

---

## 1. 📍 CONTENEUR DATE (MERCREDI...)

### 1.1. Identification

**Composant** : `<View style={styles.dateTitleHeader}>`  
**Ligne** : 99  
**Fichier** : `src/screens/MyTasksScreen.tsx`

### 1.2. Hiérarchie (Parents directs)

```
<Screen> (via ScreenContainer)
  └── <AppHeader />
  └── <View style={styles.dateTitleHeader}>  ← ICI
        ├── <SuiviText variant="label"> (date)
        └── <SuiviText variant="h1"> (titre)
```

**Parent direct** : `<Screen>` (composant wrapper qui utilise `ScreenContainer`)

### 1.3. Styles appliqués

**Fichier** : `src/screens/MyTasksScreen.tsx` (lignes 142-144)

```typescript
dateTitleHeader: {
  marginBottom: tokens.spacing.lg,  // 16px
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**Styles enfants** :
- `dateText` : `marginBottom: tokens.spacing.xs`, `textTransform: 'uppercase'`
- `titleText` : Aucun style (commentaire seulement)

### 1.4. Comment la Home applique ses marges

**Dans HomeScreen.tsx** :
- La Home **n'a pas de date** dans le header
- Le titre "Activités récentes" est dans :
  ```
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <SuiviText variant="h1">Activités récentes</SuiviText>
      </View>
    </View>
  </ScrollView>
  ```
- Le `ScrollView` a `contentContainerStyle={styles.scrollContent}` avec :
  ```typescript
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,  // 16px ✅
    paddingBottom: tokens.spacing.xl,
  }
  ```
- Donc le titre de la Home **hérite** du `paddingHorizontal: tokens.spacing.lg` du ScrollView

**Problème identifié** :
- ❌ `dateTitleHeader` dans MyTasksScreen **n'a pas de paddingHorizontal**
- ❌ Il est **en dehors** du FlatList qui a le padding, donc il colle au bord gauche
- ❌ La date et le titre ne sont **pas alignés** avec le contenu de la Home

---

## 2. 📍 CONTENEUR TITRE ("Mes Tâches")

### 2.1. Identification

**Composant** : `<SuiviText variant="h1" style={styles.titleText}>`  
**Ligne** : 103  
**Fichier** : `src/screens/MyTasksScreen.tsx`

### 2.2. Hiérarchie (Parents directs)

```
<View style={styles.dateTitleHeader}>
  ├── <SuiviText variant="label"> (date)
  └── <SuiviText variant="h1" style={styles.titleText}>  ← ICI
```

**Parent direct** : `<View style={styles.dateTitleHeader}>`

### 2.3. Styles appliqués

**Fichier** : `src/screens/MyTasksScreen.tsx` (lignes 149-151)

```typescript
titleText: {
  // fontWeight est déjà géré par variant="h1" (Inter_600SemiBold)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
  // ❌ PAS de style défini
}
```

**Styles du parent** (`dateTitleHeader`) :
- `marginBottom: tokens.spacing.lg`
- ❌ PAS de `paddingHorizontal`

### 2.4. Comment la Home applique ses marges

**Dans HomeScreen.tsx** :
- Le titre "Activités récentes" est dans :
  ```typescript
  <View style={styles.headerRow}>
    <SuiviText variant="h1" style={styles.titleText}>
      {t('home.recentActivities')}
    </SuiviText>
  </View>
  ```
- `headerRow` a :
  ```typescript
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 0,  // Explicitement 0
    width: '100%',
  }
  ```
- Mais `headerRow` est dans `<View style={styles.section}>` qui est dans le `ScrollView` avec `paddingHorizontal: tokens.spacing.lg`
- Donc le titre de la Home **hérite** du `paddingHorizontal: tokens.spacing.lg` du ScrollView parent

**Problème identifié** :
- ❌ Le titre "Mes Tâches" **n'hérite pas** de padding horizontal car `dateTitleHeader` est **en dehors** du FlatList
- ❌ Il n'est **pas aligné** avec le contenu de la Home

---

## 3. 📍 CONTENEUR FILTRES (Tous / Actives / Terminées)

### 3.1. Identification

**Composant racine** : `<View style={styles.filterBar}>`  
**Composant wrapper** : `<View style={{ alignSelf: 'flex-start', marginTop: 12 }}>`  
**Composant réel** : `<TasksFilterControl>` → `<SegmentedControl>`  
**Lignes** : 118-125  
**Fichier** : `src/screens/MyTasksScreen.tsx`

### 3.2. Hiérarchie (Parents directs)

```
<Screen>
  └── <View style={styles.filterBar}>  ← Conteneur principal
        └── <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>  ← Wrapper inline
              └── <TasksFilterControl>  ← Composant wrapper
                    └── <SegmentedControl>  ← Composant réel
```

**Parent direct** : `<Screen>` (via `filterBar`)

### 3.3. Styles appliqués

**Fichier** : `src/screens/MyTasksScreen.tsx` (lignes 155-157)

```typescript
filterBar: {
  marginBottom: tokens.spacing.lg,  // 16px
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**Wrapper inline** (ligne 119) :
```typescript
<View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
```
- `alignSelf: 'flex-start'` : Aligne à gauche
- `marginTop: 12` : Espacement vertical
- ❌ PAS de `paddingHorizontal`

**Composant SegmentedControl** (`src/components/ui/SegmentedControl.tsx`) :
- `alignSelf: 'center'` (ligne 135) : Centre le composant
- `width: 'auto'` (ligne 134) : Largeur automatique
- ❌ PAS de `paddingHorizontal` ou `marginHorizontal` dans le composant

### 3.4. Comment la Home applique ses marges

**Dans HomeScreen.tsx** :
- Les filtres sont dans :
  ```typescript
  <View style={styles.headerRow}>
    <View style={styles.filtersRow}>
      <SegmentedControl ... />
    </View>
  </View>
  ```
- `filtersRow` a :
  ```typescript
  filtersRow: {
    flexShrink: 0,
    alignItems: 'center',
    // ❌ PAS de paddingHorizontal
  }
  ```
- Mais `headerRow` est dans `<View style={styles.section}>` qui est dans le `ScrollView` avec `paddingHorizontal: tokens.spacing.lg`
- Donc les filtres de la Home **héritent** du `paddingHorizontal: tokens.spacing.lg` du ScrollView parent

**Problème identifié** :
- ❌ `filterBar` dans MyTasksScreen **n'a pas de paddingHorizontal**
- ❌ Il est **en dehors** du FlatList qui a le padding, donc il colle au bord gauche
- ❌ Les filtres ne sont **pas alignés** avec le contenu de la Home
- ⚠️ `SegmentedControl` a `alignSelf: 'center'` mais le wrapper a `alignSelf: 'flex-start'`, ce qui crée une incohérence

---

## 4. 📊 COMPARAISON HOME vs MYTASKS

### 4.1. Structure HomeScreen

```
<Screen>
  <AppHeader />
  <View style={styles.searchBarWrapper}>  ← paddingHorizontal: tokens.spacing.lg
    <HomeSearchBar />
  </View>
  <ScrollView contentContainerStyle={styles.scrollContent}>  ← paddingHorizontal: tokens.spacing.lg
    <View style={styles.section}>
      <View style={styles.headerRow}>  ← paddingHorizontal: 0 (hérite du parent)
        <SuiviText variant="h1">Titre</SuiviText>
        <View style={styles.filtersRow}>
          <SegmentedControl />
        </View>
      </View>
    </View>
  </ScrollView>
</Screen>
```

**Résultat** : Date, Titre et Filtres héritent du `paddingHorizontal: tokens.spacing.lg` du ScrollView

---

### 4.2. Structure MyTasksScreen (ACTUELLE)

```
<Screen>
  <AppHeader />
  <View style={styles.dateTitleHeader}>  ← ❌ PAS de paddingHorizontal
    <SuiviText>Date</SuiviText>
    <SuiviText variant="h1">Titre</SuiviText>
  </View>
  <AiBriefingButton />  ← marginHorizontal: tokens.spacing.lg (déjà corrigé)
  <View style={styles.filterBar}>  ← ❌ PAS de paddingHorizontal
    <View style={{ alignSelf: 'flex-start' }}>
      <TasksFilterControl />
    </View>
  </View>
  <FlatList contentContainerStyle={styles.listContent}>  ← ✅ paddingHorizontal: tokens.spacing.lg (déjà corrigé)
    <TaskItem />
  </FlatList>
</Screen>
```

**Résultat** : Date, Titre et Filtres **ne sont pas alignés** avec le contenu du FlatList

---

## 5. 🎯 DIAGNOSTIC FINAL

### 5.1. Problèmes identifiés

1. **Date (MERCREDI...)** :
   - ❌ `dateTitleHeader` n'a pas de `paddingHorizontal`
   - ❌ Il est en dehors du FlatList, donc colle au bord gauche
   - ❌ Pas aligné avec le contenu de la Home

2. **Titre "Mes Tâches"** :
   - ❌ `titleText` n'a pas de style avec `paddingHorizontal`
   - ❌ Il hérite de `dateTitleHeader` qui n'a pas de padding
   - ❌ Pas aligné avec le contenu de la Home

3. **Filtres (Tous / Actives / Terminées)** :
   - ❌ `filterBar` n'a pas de `paddingHorizontal`
   - ❌ Il est en dehors du FlatList, donc colle au bord gauche
   - ❌ Pas aligné avec le contenu de la Home
   - ⚠️ Incohérence : `SegmentedControl` a `alignSelf: 'center'` mais le wrapper a `alignSelf: 'flex-start'`

### 5.2. Solution recommandée

**Option 1 : Ajouter paddingHorizontal aux conteneurs** (Recommandé)
- Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.dateTitleHeader`
- Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.filterBar`
- ✅ Alignement parfait avec la Home
- ✅ Cohérence avec le FlatList

**Option 2 : Wrapper commun** (Plus complexe)
- Créer un wrapper `<View style={{ paddingHorizontal: tokens.spacing.lg }}>` autour de dateTitleHeader, AiBriefingButton et filterBar
- ✅ Moins de duplication
- ⚠️ Plus de refactoring

---

## 6. 📋 FICHIERS CONCERNÉS

### 6.1. Fichiers à modifier

1. **`src/screens/MyTasksScreen.tsx`** :
   - Ligne 142-144 : Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.dateTitleHeader`
   - Ligne 155-157 : Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.filterBar`

### 6.2. Fichiers de référence

1. **`src/screens/HomeScreen.tsx`** :
   - Ligne 286-289 : `styles.scrollContent` avec `paddingHorizontal: tokens.spacing.lg`
   - Ligne 231-238 : `styles.headerRow` avec `paddingHorizontal: 0` (hérite du parent)

2. **`src/components/ui/SegmentedControl.tsx`** :
   - Ligne 134-135 : `alignSelf: 'center'`, `width: 'auto'`
   - Pas de padding/margin horizontal dans le composant

---

## 7. ✅ VALIDATION POST-CORRECTION

Après modifications, vérifier que :

1. ✅ La date (MERCREDI...) commence à `tokens.spacing.lg` (16px) du bord gauche
2. ✅ Le titre "Mes Tâches" commence à `tokens.spacing.lg` (16px) du bord gauche
3. ✅ Les filtres (Tous / Actives / Terminées) commencent à `tokens.spacing.lg` (16px) du bord gauche
4. ✅ Alignement parfait avec le contenu du FlatList (TaskItem)
5. ✅ Alignement parfait avec la Home (titre "Activités récentes" et filtres)

---

**Fin du rapport d'audit**

