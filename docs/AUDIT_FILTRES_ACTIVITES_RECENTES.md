# 🔍 AUDIT COMPLET : Filtres "Tous / Boards / Portails" sur la Home

**Date** : 2024-11-19  
**Objectif** : Diagnostic détaillé des 3 boutons de filtre affichés à côté du titre "Activités récentes" sur la Home Screen

---

## 1. 📁 FICHIERS CONCERNÉS

### 1.1. Occurrences trouvées

#### "Activités récentes"
| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `src/screens/HomeScreen.tsx` | 125, 145 | JSX pour l'écran Home | Commentaire et titre de section |
| `src/i18n/resources/fr.json` | 11 | Label i18n | Traduction française |
| `src/i18n/resources/en.json` | 9 | Label i18n | Traduction anglaise |

#### "Tous"
| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `src/screens/HomeScreen.tsx` | 155 | JSX pour l'écran Home | Label du premier filtre |
| `src/i18n/resources/fr.json` | 16 | Label i18n | Traduction française |
| `src/i18n/resources/en.json` | 13 | Label i18n | Traduction anglaise |

#### "Boards"
| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `src/screens/HomeScreen.tsx` | 164 | JSX pour l'écran Home | Label du deuxième filtre |
| `src/i18n/resources/fr.json` | 17 | Label i18n | Traduction française |
| `src/i18n/resources/en.json` | 14 | Label i18n | Traduction anglaise |

#### "Portails"
| Fichier | Ligne | Type | Description |
|---------|-------|------|-------------|
| `src/screens/HomeScreen.tsx` | 173 | JSX pour l'écran Home | Label du troisième filtre |
| `src/i18n/resources/fr.json` | 18 | Label i18n | Traduction française |
| `src/i18n/resources/en.json` | 15 | Label i18n | Traduction anglaise |

### 1.2. Composants identifiés

**Composant écran principal** :
- **`HomeScreen`** (`src/screens/HomeScreen.tsx`)
  - Ligne 143-182 : Bloc JSX contenant le titre "Activités récentes" et les 3 filtres

**Composant des filtres** :
- **`FilterChip`** (`src/components/ui/FilterChip.tsx`)
  - Composant maison (pas de lib externe)
  - Utilisé 3 fois dans `HomeScreen.tsx` (lignes 154, 163, 172)
  - **IMPORTANT** : Le composant a 2 styles différents :
    - Style par défaut (utilisé actuellement sur Home)
    - Style Material 3 (activé avec prop `material3={true}`, **NON utilisé** sur Home actuellement)

---

## 2. 📐 STRUCTURE ACTUELLE (JSX)

### 2.1. JSX du bloc "Activités récentes" + filtres

**Fichier** : `src/screens/HomeScreen.tsx` (lignes 143-182)

```tsx
<View style={styles.headerRow}>
  <SuiviText variant="h1" style={styles.headerTitle}>
    {t('home.recentActivities')}
  </SuiviText>
  {/**
   * Pills de filtres (Tous / Boards / Portails)
   * - Style restauré selon le design original Suivi
   * - Compatibles avec les futurs filtres API
   * - Alignés avec les tokens (couleurs, typo, radius)
   */}
  <View style={styles.filtersRow}>
    <FilterChip
      label={t('home.filters.all')}
      selected={filter === 'all'}
      onPress={() => {
        setFilter('all');
        setLimit(5);
      }}
      style={styles.filterPill}
    />
    <FilterChip
      label={t('home.filters.boards')}
      selected={filter === 'board'}
      onPress={() => {
        setFilter('board');
        setLimit(5);
      }}
      style={styles.filterPill}
    />
    <FilterChip
      label={t('home.filters.portals')}
      selected={filter === 'portal'}
      onPress={() => {
        setFilter('portal');
        setLimit(5);
      }}
      style={styles.filterPill}
    />
  </View>
</View>
```

### 2.2. JSX du composant FilterChip

**Fichier** : `src/components/ui/FilterChip.tsx` (lignes 128-155)

```tsx
// Style par défaut (utilisé actuellement sur Home)
return (
  <TouchableOpacity
    style={[
      styles.chip,
      {
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
        opacity: disabled ? 0.6 : 1,
      },
      style, // ← styles.filterPill de HomeScreen est appliqué ici
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.chipText,
        {
          color: getTextColor(),
        },
        textStyle,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
```

### 2.3. Gestion de l'état sélectionné

**State** : `filter` (ligne 44 de `HomeScreen.tsx`)
```typescript
const [filter, setFilter] = useState<'all' | 'board' | 'portal'>('all');
```

**Logique de sélection** :
- Chaque `FilterChip` reçoit `selected={filter === 'all'}` (ou `'board'`, `'portal'`)
- Le prop `selected` est utilisé dans `FilterChip` pour déterminer les couleurs (actif/inactif)
- Lors du `onPress`, `setFilter()` met à jour le state, ce qui re-rend les 3 chips avec le bon état

**Style appliqué** :
- Le composant `FilterChip` utilise son **style par défaut** (pas Material 3)
- Le style `styles.filterPill` de `HomeScreen` est appliqué en override via la prop `style`

---

## 3. 🎨 STYLES QUI CONTRÔLENT L'APPARENCE

### 3.1. Fichiers de styles

**Styles dans `HomeScreen.tsx`** :
- `styles.headerRow` (ligne 234) : Container horizontal titre + filtres
- `styles.headerTitle` (ligne 245) : Style du titre "Activités récentes"
- `styles.filtersRow` (ligne 252) : Container horizontal des 3 filtres
- `styles.filterPill` (ligne 258) : Style override appliqué à chaque `FilterChip`

**Styles dans `FilterChip.tsx`** :
- `styles.chip` (ligne 159) : Style principal du chip (style par défaut)
- `styles.chipText` (ligne 169) : Style du texte du chip
- `styles.material3Chip` (ligne 175) : Style Material 3 (NON utilisé sur Home)
- `styles.material3ChipText` (ligne 197) : Style texte Material 3 (NON utilisé)

### 3.2. Détail des styles appliqués

#### Style `chip` (style par défaut utilisé sur Home)

**Fichier** : `src/components/ui/FilterChip.tsx` (ligne 159-168)

```typescript
chip: {
  flex: 1,                    // ← Overridé par filterPill: { flex: 0 }
  paddingVertical: tokens.spacing.sm,      // 8px
  paddingHorizontal: tokens.spacing.md,    // 12px
  borderRadius: tokens.radius.lg,          // 16px
  borderWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 36,              // Hauteur minimale ~36px
}
```

**Couleurs dynamiques** (fonctions dans `FilterChip.tsx`) :

**Background** :
- Actif : `tokens.colors.brand.primary` (#4F5DFF - bleu Suivi)
- Inactif : `#FFFFFF` (blanc)
- Disabled : `tokens.colors.neutral.light` (#E8E8E8)

**Border** :
- Actif : `tokens.colors.brand.primary` (#4F5DFF)
- Inactif : `tokens.colors.neutral.light` (#E8E8E8)
- BorderWidth : `1` (toujours)

**Texte** :
- Actif : `#FFFFFF` (blanc)
- Inactif : `tokens.colors.neutral.dark` (#4F4A45)
- FontFamily : `tokens.typography.label.fontFamily` (Inter_500Medium)
- FontSize : `tokens.typography.label.fontSize` (13px)
- LineHeight : `13 * 1.3` ≈ 17px

#### Style `filterPill` (override depuis HomeScreen)

**Fichier** : `src/screens/HomeScreen.tsx` (ligne 258-261)

```typescript
filterPill: {
  flex: 0,        // Override le flex: 1 du chip pour largeur auto
  minWidth: 60,   // Largeur minimale pour éviter les pills trop petites
}
```

#### Style `filtersRow` (container des 3 filtres)

**Fichier** : `src/screens/HomeScreen.tsx` (ligne 252-257)

```typescript
filtersRow: {
  flexDirection: 'row',
  gap: 8,                    // Espacement horizontal entre les pills
  flexShrink: 0,             // Les filtres gardent leur taille
  alignItems: 'center',
}
```

### 3.3. Style effectif actuel

**Design actuel** : Style par défaut de `FilterChip` (pas Material 3)

**Caractéristiques** :
- ✅ Hauteur : `minHeight: 36px` (proche de 32px demandé)
- ✅ Padding horizontal : `12px` (tokens.spacing.md)
- ✅ BorderRadius : `16px` (tokens.radius.lg)
- ✅ Fond actif : `#4F5DFF` (tokens.colors.brand.primary)
- ✅ Fond inactif : `#FFFFFF` (blanc)
- ✅ Texte actif : `#FFFFFF` (blanc)
- ✅ Texte inactif : `#4F4A45` (tokens.colors.neutral.dark)
- ✅ Typography : Inter_500Medium, 13px
- ✅ Border : `1px`, couleur selon état

**Note importante** : Le style Material 3 existe dans `FilterChip.tsx` mais **N'EST PAS UTILISÉ** sur la Home car la prop `material3` n'est pas passée (elle est `false` par défaut).

---

## 4. 🔄 COMPARAISON AVEC LE DESIGN ATTENDU

### 4.1. Composant principal à modifier

**Pour modifier le design des 3 filtres, il faut modifier** :
1. **`src/components/ui/FilterChip.tsx`** : Le composant lui-même
   - Modifier le style `chip` (ligne 159) pour les dimensions, padding, borderRadius
   - Modifier les fonctions `getBackgroundColor()`, `getTextColor()`, `getBorderColor()` (lignes 107-126) pour les couleurs
   - Modifier le style `chipText` (ligne 169) pour la typography

2. **`src/screens/HomeScreen.tsx`** : Le style override `filterPill` (ligne 258)
   - Actuellement : `flex: 0`, `minWidth: 60`
   - Peut être ajusté pour la largeur/layout

### 4.2. Style effectif actuel

**Style actuel** : Style par défaut de `FilterChip` (design custom Suivi, pas Material 3)

**Pourquoi le style précédent n'a pas été restauré** :
- La dernière PR a retiré la prop `material3` des `FilterChip` sur la Home
- Cela a restauré le style par défaut, qui est le style original Suivi
- Le style par défaut utilise :
  - Fond blanc pour inactif (au lieu d'un gris très clair)
  - Border visible pour inactif (au lieu de transparent)
  - Hauteur `minHeight: 36px` (au lieu de 32px)

**Si le design attendu est différent** :
- Il faudra modifier les valeurs dans `FilterChip.tsx` (style `chip` et fonctions de couleur)
- Ou créer un nouveau style spécifique pour la Home
- Ou utiliser le style Material 3 en passant `material3={true}` (mais cela donnerait un design différent)

---

## 5. 📋 RÉSUMÉ

### Pour modifier le design des 3 filtres, il faudra changer :

**1. Composant principal** :
- **`src/components/ui/FilterChip.tsx`**
  - Style `chip` (ligne 159) : dimensions, padding, borderRadius
  - Fonctions `getBackgroundColor()`, `getTextColor()`, `getBorderColor()` (lignes 107-126) : couleurs
  - Style `chipText` (ligne 169) : typography

**2. Style override (optionnel)** :
- **`src/screens/HomeScreen.tsx`**
  - Style `filterPill` (ligne 258) : largeur, flex

**3. Style actuel** :
- Style par défaut de `FilterChip` (design custom Suivi)
- **NON** Material 3 (la prop `material3` n'est pas utilisée)
- Fond inactif : blanc (#FFFFFF) avec border gris
- Fond actif : bleu Suivi (#4F5DFF) avec texte blanc
- Hauteur : `minHeight: 36px`
- BorderRadius : `16px`
- Padding horizontal : `12px`

**4. Points d'attention** :
- Le composant `FilterChip` a 2 styles (défaut + Material 3)
- Le style Material 3 existe mais n'est pas utilisé sur la Home
- Les couleurs sont gérées dynamiquement selon l'état `selected`
- Le style `filterPill` de HomeScreen override seulement `flex` et `minWidth`

---

**Fin du rapport d'audit**

