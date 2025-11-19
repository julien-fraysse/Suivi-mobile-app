# 🔍 AUDIT ULTRA CIBLÉ : NotificationsScreen.tsx - Structure Complète

**Date** : 2024-11-19  
**Objectif** : Diagnostic exhaustif de tous les conteneurs pour alignement avec la Home

---

## 1. 📍 CONTENEUR DATE ("MERCREDI 19 NOVEMBRE")

### 1.1. Identification

**Composant** : `<View style={styles.dateTitleHeader}>`  
**Ligne** : 115  
**Fichier** : `src/screens/NotificationsScreen.tsx`

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

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 168-170)

```typescript
dateTitleHeader: {
  marginBottom: tokens.spacing.lg,  // 16px
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**Styles enfants** :
- `dateText` (lignes 171-174) : 
  ```typescript
  dateText: {
    marginBottom: tokens.spacing.xs,  // 4px
    textTransform: 'uppercase',
    // ❌ PAS de paddingHorizontal
  }
  ```
- `titleText` (lignes 175-177) : 
  ```typescript
  titleText: {
    // fontWeight est déjà géré par variant="h1" (Inter_600SemiBold)
    // ❌ PAS de style défini
  }
  ```

### 1.4. Problème identifié

- ❌ `dateTitleHeader` **n'a pas de paddingHorizontal**
- ❌ Il est **en dehors** du FlatList qui a le padding, donc il colle au bord gauche
- ❌ La date n'est **pas alignée** avec le contenu de la Home

---

## 2. 📍 CONTENEUR TITRE ("Vous avez X notifications")

### 2.1. Identification

**Composant** : `<SuiviText variant="h1" style={styles.titleText}>`  
**Lignes** : 119-124  
**Fichier** : `src/screens/NotificationsScreen.tsx`

### 2.2. Hiérarchie (Parents directs)

```
<View style={styles.dateTitleHeader}>
  ├── <SuiviText variant="label"> (date)
  └── <SuiviText variant="h1" style={styles.titleText}>  ← ICI
        └── <SuiviText variant="h1"> (partie dynamique en violet)
```

**Parent direct** : `<View style={styles.dateTitleHeader}>`

**Structure JSX** :
```tsx
<SuiviText variant="h1" style={styles.titleText}>
  {t('notifications.youHave')}{' '}
  <SuiviText variant="h1" style={{ color: tokens.colors.brand.primary }}>
    {unreadCount} {t('notifications.notifications')}
  </SuiviText>
</SuiviText>
```

### 2.3. Styles appliqués

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 175-177)

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

**Style inline** (ligne 121) :
- `color: tokens.colors.brand.primary` (pour la partie dynamique)

### 2.4. Problème identifié

- ❌ Le titre **n'hérite pas** de padding horizontal car `dateTitleHeader` est **en dehors** du FlatList
- ❌ Il n'est **pas aligné** avec le contenu de la Home

---

## 3. 📍 CONTENEUR FILTRES ("Toutes / Non lues")

### 3.1. Identification

**Composant racine** : `<View style={styles.filterBarContainer}>`  
**Composant réel** : `<SegmentedControl>`  
**Lignes** : 128-136  
**Fichier** : `src/screens/NotificationsScreen.tsx`

### 3.2. Hiérarchie (Parents directs)

```
<Screen>
  └── <View style={styles.filterBarContainer}>  ← Conteneur principal
        └── <SegmentedControl>  ← Composant réel
```

**Parent direct** : `<Screen>` (via `filterBarContainer`)

### 3.3. Styles appliqués

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 178-183)

```typescript
filterBarContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: tokens.spacing.lg,  // 16px
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**Composant SegmentedControl** (`src/components/ui/SegmentedControl.tsx`) :
- `alignSelf: 'center'` (ligne 135) : Centre le composant
- `width: 'auto'` (ligne 134) : Largeur automatique
- `borderRadius: 14` (ligne 132)
- `padding: 4` (ligne 133) : Padding interne
- ❌ PAS de `paddingHorizontal` ou `marginHorizontal` dans le composant

### 3.4. Problème identifié

- ❌ `filterBarContainer` **n'a pas de paddingHorizontal**
- ❌ Il est **en dehors** du FlatList qui a le padding, donc il colle au bord gauche
- ❌ Les filtres ne sont **pas alignés** avec le contenu de la Home
- ⚠️ `SegmentedControl` a `alignSelf: 'center'` mais le conteneur parent n'a pas de padding, donc le centrage se fait par rapport au bord de l'écran, pas par rapport au contenu

---

## 4. 📍 CONTENEUR BOUTON "Tout marquer comme lu"

### 4.1. Identification

**Composant** : `<TouchableOpacity style={styles.markAllReadLink}>`  
**Lignes** : 138-152  
**Fichier** : `src/screens/NotificationsScreen.tsx`

### 4.2. Hiérarchie (Parents directs)

```
<View style={styles.filterBarContainer}>
  ├── <SegmentedControl />
  └── <TouchableOpacity style={styles.markAllReadLink}>  ← ICI
        ├── <MaterialCommunityIcons style={styles.markAllReadIcon}>
        └── <SuiviText variant="label" style={styles.markAllReadText}>
```

**Parent direct** : `<View style={styles.filterBarContainer}>`

### 4.3. Styles appliqués

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 184-195)

```typescript
markAllReadLink: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: tokens.spacing.xs,  // 4px
  paddingHorizontal: tokens.spacing.sm,  // 8px
  // ✅ A un paddingHorizontal mais seulement pour le bouton lui-même
}
```

**Styles enfants** :
- `markAllReadIcon` (lignes 190-192) :
  ```typescript
  markAllReadIcon: {
    marginRight: tokens.spacing.xs,  // 4px
  }
  ```
- `markAllReadText` (lignes 193-195) :
  ```typescript
  markAllReadText: {
    color: tokens.colors.brand.primary,
    // ❌ PAS de paddingHorizontal
  }
  ```

### 4.4. Problème identifié

- ⚠️ Le bouton a un `paddingHorizontal: tokens.spacing.sm` (8px) mais c'est **interne au bouton**
- ❌ Le conteneur parent `filterBarContainer` **n'a pas de paddingHorizontal**
- ❌ Le bouton n'est **pas aligné** avec le contenu de la Home
- ❌ Le bouton est positionné à droite via `justifyContent: 'space-between'` dans `filterBarContainer`, mais sans padding du parent, il colle au bord droit

---

## 5. 📍 COMPOSANT NotificationItem (Carte de notification)

### 5.1. Identification

**Composant** : `<NotificationItem>`  
**Ligne** : 87-92 (dans `renderNotificationItem`)  
**Fichier** : `src/components/ui/NotificationItem.tsx`

### 5.2. Hiérarchie (Parents directs)

```
<FlatList contentContainerStyle={styles.listContent}>
  └── <NotificationItem>  ← ICI (rendu via renderItem)
        └── <Pressable style={styles.card}>
```

**Parent direct** : `<FlatList>` avec `contentContainerStyle={styles.listContent}`

### 5.3. Conteneur de la carte

**Composant** : `<Pressable style={styles.card}>`  
**Lignes** : 184-198  
**Fichier** : `src/components/ui/NotificationItem.tsx`

**Styles appliqués** (lignes 293-298) :

```typescript
card: {
  marginBottom: tokens.spacing.md,  // 12px
  position: 'relative',
  overflow: 'hidden',
  // ❌ PAS de paddingHorizontal dans le style
}
```

**Style inline** (lignes 188-196) :

```typescript
{
  backgroundColor: cardBackgroundColor,
  borderRadius: 12,
  paddingVertical: 14,
  // Note: paddingHorizontal est géré par le parent FlatList (NotificationsScreen)
  // via contentContainerStyle.paddingHorizontal pour un alignement cohérent avec la Home
  opacity: pressed ? 0.8 : 1,
  ...cardShadow,
}
```

**Important** : Le `paddingHorizontal` a été **supprimé** du style inline (ligne 192-193) et un commentaire indique qu'il est géré par le parent.

### 5.4. Structure interne de NotificationItem

**Layout** (lignes 215-240) :

```
<Pressable style={styles.card}>
  ├── <View style={styles.liseret}> (si !read)
  ├── <View style={styles.unreadBadge}> (si !read)
  └── <View style={styles.contentRow}>
        ├── <View style={styles.iconContainer}>
        │     └── {renderIconOrAvatar()}
        └── <View style={styles.textContainer}>
              ├── <View style={styles.header}>
              │     └── <SuiviText variant="h2" style={styles.title}>
              ├── <SuiviText variant="body" style={styles.message}>
              └── <SuiviText variant="body" style={styles.date}>
```

### 5.5. Styles des conteneurs internes

**1. Liseret latéral** (lignes 299-306) :

```typescript
liseret: {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
  borderRadius: 4,
  // ❌ PAS de paddingHorizontal (position absolute)
}
```

**2. Content Row** (lignes 307-310) :

```typescript
contentRow: {
  flexDirection: 'row',
  alignItems: 'center',
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**3. Icon Container** (lignes 311-317) :

```typescript
iconContainer: {
  width: 36,
  height: 36,
  marginRight: tokens.spacing.md,  // 12px
  alignItems: 'center',
  justifyContent: 'center',
  // ❌ PAS de paddingHorizontal
}
```

**4. Icon Circle** (lignes 318-324) :

```typescript
iconCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  // ❌ PAS de paddingHorizontal
}
```

**5. Text Container** (lignes 325-327) :

```typescript
textContainer: {
  flex: 1,
  // ❌ PAS de paddingHorizontal
}
```

**6. Header** (lignes 328-333) :

```typescript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: tokens.spacing.xs,  // 4px
  // ❌ PAS de paddingHorizontal
}
```

**7. Title** (lignes 334-336) :

```typescript
title: {
  flex: 1,
  // ❌ PAS de paddingHorizontal
}
```

**8. Message** (lignes 346-348) :

```typescript
message: {
  marginBottom: tokens.spacing.xs,  // 4px
  // ❌ PAS de paddingHorizontal
}
```

**9. Date** (lignes 349-351) :

```typescript
date: {
  marginTop: tokens.spacing.xs,  // 4px
  // ❌ PAS de paddingHorizontal
}
```

### 5.6. Emplacement de l'avatar

**Composant** : `<UserAvatar>` (lignes 139-147)  
**Fichier** : `src/components/ui/NotificationItem.tsx`

**Rendu conditionnel** :
- Si `isHumanEvent(notification)` : Affiche `<UserAvatar>` avec `size={36}`
- Sinon : Affiche `<View style={styles.iconCircle}>` avec `<MaterialIcons>`

**Styles de l'avatar** :
- `size={36}` : Taille fixe
- `style={theme.dark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' } : undefined}` : Bordure en dark mode uniquement

**Conteneur** : `<View style={styles.iconContainer}>` (lignes 217-219)
- `width: 36`, `height: 36`
- `marginRight: tokens.spacing.md` (12px)
- `alignItems: 'center'`, `justifyContent: 'center'`

### 5.7. Problème identifié

- ✅ Le `paddingHorizontal` a été **supprimé** du style inline de la carte (ligne 192-193)
- ✅ Un commentaire indique que le padding vient du parent FlatList
- ✅ La carte **hérite** du `paddingHorizontal: tokens.spacing.lg` du FlatList via `contentContainerStyle`
- ✅ **Pas de problème** pour NotificationItem, le padding est correctement géré par le parent

---

## 6. 📍 CONTENEUR FLATLIST

### 6.1. Identification

**Composant** : `<FlatList>`  
**Lignes** : 156-162  
**Fichier** : `src/screens/NotificationsScreen.tsx`

### 6.2. Hiérarchie (Parents directs)

```
<Screen>
  └── <FlatList contentContainerStyle={styles.listContent}>  ← ICI
        └── <NotificationItem /> (rendu via renderItem)
```

**Parent direct** : `<Screen>`

### 6.3. Styles appliqués

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 196-200)

```typescript
listContent: {
  paddingHorizontal: tokens.spacing.lg,  // 16px ✅
  paddingBottom: tokens.spacing.md,  // 12px
  flexGrow: 1,
}
```

**État** : ✅ **Correct** - Le FlatList a `paddingHorizontal: tokens.spacing.lg` (16px)

---

## 7. 🏠 COMMENT LA HOME APPLIQUE SES MARGES

### 7.1. Structure HomeScreen

**Fichier** : `src/screens/HomeScreen.tsx`

**Layout** :
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

### 7.2. Styles HomeScreen

**Fichier** : `src/screens/HomeScreen.tsx` (lignes 283-289)

```typescript
searchBarWrapper: {
  paddingHorizontal: tokens.spacing.lg,  // 16px ✅
},
scrollContent: {
  paddingHorizontal: tokens.spacing.lg,  // 16px ✅
  paddingBottom: tokens.spacing.xl,
},
```

**Header Row** (lignes 231-238) :

```typescript
headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
  paddingHorizontal: 0,  // Explicitement 0 (hérite du parent)
  width: '100%',
}
```

### 7.3. Héritage du padding

**Dans la Home** :
1. Le `ScrollView` a `contentContainerStyle={styles.scrollContent}` avec `paddingHorizontal: tokens.spacing.lg` (16px)
2. Le titre "Activités récentes" est dans `<View style={styles.headerRow}>` qui a `paddingHorizontal: 0`
3. Mais `headerRow` est dans `<View style={styles.section}>` qui est dans le `ScrollView`
4. Donc le titre **hérite** du `paddingHorizontal: tokens.spacing.lg` du ScrollView parent
5. Les filtres sont dans `headerRow`, donc ils **héritent** aussi du padding du ScrollView

**Résultat** : Titre et filtres sont **parfaitement alignés** avec le contenu du ScrollView

---

## 8. 📊 COMPARAISON HOME vs NOTIFICATIONS

### 8.1. Structure HomeScreen

```
<Screen>
  <AppHeader />
  <View style={styles.searchBarWrapper}>  ← paddingHorizontal: tokens.spacing.lg ✅
    <HomeSearchBar />
  </View>
  <ScrollView contentContainerStyle={styles.scrollContent}>  ← paddingHorizontal: tokens.spacing.lg ✅
    <View style={styles.section}>
      <View style={styles.headerRow}>  ← paddingHorizontal: 0 (hérite du parent) ✅
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

### 8.2. Structure NotificationsScreen (ACTUELLE)

```
<Screen>
  <AppHeader />
  <View style={styles.dateTitleHeader}>  ← ❌ PAS de paddingHorizontal
    <SuiviText>Date</SuiviText>
    <SuiviText variant="h1">Titre</SuiviText>
  </View>
  <View style={styles.filterBarContainer}>  ← ❌ PAS de paddingHorizontal
    <SegmentedControl />
    <TouchableOpacity style={styles.markAllReadLink}>  ← paddingHorizontal: tokens.spacing.sm (interne)
      <MaterialCommunityIcons />
      <SuiviText>Tout marquer comme lu</SuiviText>
    </TouchableOpacity>
  </View>
  <FlatList contentContainerStyle={styles.listContent}>  ← ✅ paddingHorizontal: tokens.spacing.lg
    <NotificationItem />  ← ✅ Pas de paddingHorizontal interne (hérite du parent)
  </FlatList>
</Screen>
```

**Résultat** : Date, Titre et Filtres **ne sont pas alignés** avec le contenu du FlatList

---

## 9. 🎯 DIAGNOSTIC STRUCTUREL

### 9.1. Éléments non alignés

1. **Date ("MERCREDI 19 NOVEMBRE")** :
   - ❌ `dateTitleHeader` n'a pas de `paddingHorizontal`
   - ❌ Il est en dehors du FlatList, donc colle au bord gauche
   - ❌ Pas aligné avec le contenu de la Home

2. **Titre ("Vous avez X notifications")** :
   - ❌ `titleText` n'a pas de style avec `paddingHorizontal`
   - ❌ Il hérite de `dateTitleHeader` qui n'a pas de padding
   - ❌ Pas aligné avec le contenu de la Home

3. **Filtres ("Toutes / Non lues")** :
   - ❌ `filterBarContainer` n'a pas de `paddingHorizontal`
   - ❌ Il est en dehors du FlatList, donc colle au bord gauche
   - ❌ Pas aligné avec le contenu de la Home
   - ⚠️ `SegmentedControl` a `alignSelf: 'center'` mais le conteneur parent n'a pas de padding, donc le centrage se fait par rapport au bord de l'écran

4. **Bouton "Tout marquer comme lu"** :
   - ⚠️ Le bouton a un `paddingHorizontal: tokens.spacing.sm` (8px) mais c'est **interne au bouton**
   - ❌ Le conteneur parent `filterBarContainer` n'a pas de `paddingHorizontal`
   - ❌ Le bouton n'est **pas aligné** avec le contenu de la Home
   - ❌ Le bouton est positionné à droite via `justifyContent: 'space-between'` dans `filterBarContainer`, mais sans padding du parent, il colle au bord droit

---

### 9.2. Composants avec hardcodes

**Aucun hardcode identifié** dans NotificationsScreen.tsx :
- ✅ Tous les styles utilisent des tokens (`tokens.spacing.lg`, `tokens.spacing.sm`, etc.)
- ✅ Pas de valeurs hardcodées comme `16`, `12`, etc.

**Dans NotificationItem.tsx** :
- ✅ Tous les styles utilisent des tokens
- ✅ Pas de hardcodes identifiés

---

### 9.3. Incohérences d'alignement

1. **Date et Titre** :
   - ❌ Collent au bord gauche (pas de padding)
   - ❌ Pas alignés avec les NotificationItem dans le FlatList

2. **Filtres** :
   - ❌ `SegmentedControl` est centré (`alignSelf: 'center'`) mais le conteneur parent n'a pas de padding
   - ❌ Le centrage se fait par rapport au bord de l'écran, pas par rapport au contenu
   - ❌ Pas aligné avec les NotificationItem dans le FlatList

3. **Bouton "Tout marquer comme lu"** :
   - ❌ Positionné à droite via `justifyContent: 'space-between'` mais colle au bord droit
   - ❌ Pas aligné avec le contenu de la Home

4. **NotificationItem** :
   - ✅ **Correct** - Le padding horizontal est géré par le parent FlatList
   - ✅ Pas de problème d'alignement pour les cartes

---

### 9.4. Problèmes dans NotificationItem

**État actuel** : ✅ **Correct**

1. **Padding horizontal** :
   - ✅ Le `paddingHorizontal: 16` hardcodé a été **supprimé** du style inline (ligne 192-193)
   - ✅ Un commentaire indique que le padding vient du parent FlatList
   - ✅ La carte **hérite** correctement du `paddingHorizontal: tokens.spacing.lg` du FlatList

2. **Structure interne** :
   - ✅ Tous les conteneurs internes (iconContainer, textContainer, header, etc.) n'ont pas de padding horizontal
   - ✅ L'alignement est géré par le parent FlatList

3. **Avatar** :
   - ✅ L'avatar est dans `iconContainer` avec `marginRight: tokens.spacing.md` (12px)
   - ✅ Pas de problème d'alignement

**Conclusion** : NotificationItem est **correctement implémenté** et n'a **pas besoin de modifications**.

---

## 10. 📋 RÉSUMÉ DES PROBLÈMES

### 10.1. Problèmes identifiés

| Élément | Problème | Fichier | Ligne |
|---------|----------|---------|-------|
| Date | ❌ Pas de `paddingHorizontal` | `NotificationsScreen.tsx` | 168-170 |
| Titre | ❌ Pas de `paddingHorizontal` (hérite de dateTitleHeader) | `NotificationsScreen.tsx` | 175-177 |
| Filtres | ❌ Pas de `paddingHorizontal` | `NotificationsScreen.tsx` | 178-183 |
| Bouton "Tout marquer comme lu" | ⚠️ Padding interne mais parent sans padding | `NotificationsScreen.tsx` | 184-195 |
| NotificationItem | ✅ Correct (padding géré par parent) | `NotificationItem.tsx` | 192-193 |

### 10.2. Solutions recommandées

**Option 1 : Ajouter paddingHorizontal aux conteneurs** (Recommandé)
- Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.dateTitleHeader`
- Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.filterBarContainer`
- ✅ Alignement parfait avec la Home
- ✅ Cohérence avec le FlatList

**Option 2 : Wrapper commun** (Plus complexe)
- Créer un wrapper `<View style={{ paddingHorizontal: tokens.spacing.lg }}>` autour de dateTitleHeader et filterBarContainer
- ✅ Moins de duplication
- ⚠️ Plus de refactoring

---

## 11. 📋 FICHIERS CONCERNÉS

### 11.1. Fichiers à modifier

1. **`src/screens/NotificationsScreen.tsx`** :
   - Ligne 168-170 : Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.dateTitleHeader`
   - Ligne 178-183 : Ajouter `paddingHorizontal: tokens.spacing.lg` à `styles.filterBarContainer`

### 11.2. Fichiers de référence

1. **`src/screens/HomeScreen.tsx`** :
   - Ligne 286-289 : `styles.scrollContent` avec `paddingHorizontal: tokens.spacing.lg`
   - Ligne 231-238 : `styles.headerRow` avec `paddingHorizontal: 0` (hérite du parent)

2. **`src/components/ui/SegmentedControl.tsx`** :
   - Ligne 134-135 : `alignSelf: 'center'`, `width: 'auto'`
   - Pas de padding/margin horizontal dans le composant

3. **`src/components/ui/NotificationItem.tsx`** :
   - Ligne 192-193 : Commentaire indiquant que le padding vient du parent
   - ✅ Pas de modifications nécessaires

---

## 12. ✅ VALIDATION POST-CORRECTION

Après modifications, vérifier que :

1. ✅ La date ("MERCREDI 19 NOVEMBRE") commence à `tokens.spacing.lg` (16px) du bord gauche
2. ✅ Le titre ("Vous avez X notifications") commence à `tokens.spacing.lg` (16px) du bord gauche
3. ✅ Les filtres ("Toutes / Non lues") commencent à `tokens.spacing.lg` (16px) du bord gauche
4. ✅ Le bouton "Tout marquer comme lu" est aligné avec le contenu (via le padding du parent)
5. ✅ Alignement parfait avec le contenu du FlatList (NotificationItem)
6. ✅ Alignement parfait avec la Home (titre "Activités récentes" et filtres)

---

**Fin du rapport d'audit**

