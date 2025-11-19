# 🔍 AUDIT ULTRA PRÉCIS : NotificationItem - Layout & Alignement

**Date** : 2024-11-19  
**Objectif** : Identifier les causes exactes des problèmes d'alignement et de présentation des cartes dans NotificationsScreen

---

## 1. 🧱 STRUCTURE EXACTE DE LA CARTE LORSQU'ELLE EST RENDUE

### 1.1. Hiérarchie complète depuis FlatList

```
NotificationsScreen.tsx
└── <FlatList
      contentContainerStyle={styles.listContent}  ← paddingHorizontal: tokens.spacing.lg (16px)
      renderItem={renderNotificationItem}
      └── <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
            style={undefined}  ← Pas de style passé depuis NotificationsScreen
            └── <Pressable
                  style={[
                    styles.card,  ← marginBottom: tokens.spacing.md (12px)
                    {
                      backgroundColor: cardBackgroundColor,  ← Light: #FFFFFF, Dark: #1A1A1A
                      borderRadius: 12,
                      paddingVertical: 14,  ← ⚠️ Hardcodé, pas de paddingHorizontal
                      opacity: pressed ? 0.8 : 1,
                      ...cardShadow,  ← iOS: shadowOffset {0,1}, shadowOpacity 0.08, shadowRadius 4 | Android: elevation 2
                    },
                    style,  ← undefined
                  ]}
                  └── {/* Liseret latéral - conditionnel si !read */}
                      {!notification.read && (
                        <View
                          style={[
                            styles.liseret,  ← position: absolute, left: 0, top: 0, bottom: 0, width: 4
                            { backgroundColor: getBorderColor() },  ← Couleur selon type
                          ]}
                        />
                      )}
                      
                      {/* Badge unread - conditionnel si !read */}
                      {!notification.read && (
                        <View
                          style={styles.unreadBadge}  ← position: absolute, top: 10, right: 10, width: 10, height: 10
                        />
                      )}
                      
                      <View style={styles.contentRow}>  ← flexDirection: row, alignItems: flex-start, paddingVertical: tokens.spacing.xs (4px)
                          └── <View style={styles.iconContainer}>  ← width: 36, height: 36, marginRight: tokens.spacing.md (12px), marginTop: tokens.spacing.xs (4px)
                                └── {renderIconOrAvatar()}
                                      ├── CAS 1: Avatar (si isHumanEvent)
                                      │     └── <UserAvatar
                                      │           size={36}
                                      │           imageSource={avatarUrl}
                                      │           fullName={actorName}
                                      │           style={theme.dark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' } : undefined}
                                      │           └── <View style={containerStyle}>  ← width: 36, height: 36, borderRadius: 18
                                      │                 └── <Image style={imageStyle} /> OU <Text style={initials} />
                                      │
                                      └── CAS 2: Icône (si événement système)
                                            └── <View style={styles.iconCircle}>  ← width: 36, height: 36, borderRadius: 18, backgroundColor: `${iconColor}20`
                                                  └── <MaterialIcons
                                                        name={iconName}  ← assignment, check-circle, error-outline, bolt, schedule
                                                        size={22}
                                                        color={iconColor}
                                                      />
                          
                          └── <View style={styles.textContainer}>  ← flex: 1
                                └── <View style={styles.header}>  ← flexDirection: row, justifyContent: space-between, alignItems: center, marginBottom: tokens.spacing.xs (4px)
                                      └── <SuiviText
                                            variant="h2"  ← Inter_500Medium, fontSize: 18, lineHeight: 24
                                            style={styles.title}  ← flex: 1, marginBottom: tokens.spacing.xs (4px)
                                          >
                                            {notificationTitle}
                                          </SuiviText>
                                
                                └── <SuiviText
                                      variant="body"  ← Inter_400Regular, fontSize: 15, lineHeight: 22
                                      color="secondary"  ← Light: #98928C, Dark: #CACACA
                                      style={styles.message}  ← marginBottom: tokens.spacing.xs (4px)
                                    >
                                      {notification.message}
                                    </SuiviText>
                                
                                └── <SuiviText
                                      variant="body"  ← Inter_400Regular, fontSize: 15, lineHeight: 22
                                      color="secondary"  ← Light: #98928C, Dark: #CACACA
                                      style={styles.date}  ← marginTop: tokens.spacing.xs (4px)
                                    >
                                      {formatNotificationDate(notification.createdAt)}
                                    </SuiviText>
```

---

## 2. 🎨 STYLES EFFECTIVEMENT APPLIQUÉS PAR NIVEAU

### 2.1. FlatList (NotificationsScreen.tsx)

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 156-162)

**Props** :
- `data={filteredNotifications}`
- `keyExtractor={(item) => item.id}`
- `renderItem={renderNotificationItem}`
- `contentContainerStyle={styles.listContent}`

**Styles appliqués** (`styles.listContent`, lignes 198-202) :
```typescript
listContent: {
  paddingHorizontal: tokens.spacing.lg,  // 16px ✅
  paddingBottom: tokens.spacing.md,      // 12px
  flexGrow: 1,
}
```

**Aucun wrapper supplémentaire** : NotificationItem est rendu directement dans le FlatList.

---

### 2.2. Pressable (styles.card)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 184-198)

**Styles de base** (`styles.card`, lignes 294-298) :
```typescript
card: {
  marginBottom: tokens.spacing.md,  // 12px (espacement entre cartes)
  position: 'relative',              // Pour liseret et badge absolute
  overflow: 'hidden',                // Pour masquer le liseret qui dépasse
}
```

**Styles inline** (lignes 188-196) :
```typescript
{
  backgroundColor: cardBackgroundColor,  // Light: #FFFFFF, Dark: #1A1A1A
  borderRadius: 12,                     // ⚠️ Hardcodé (devrait être tokens.radius.md = 12)
  paddingVertical: 14,                   // ⚠️ Hardcodé (devrait être tokens.spacing.md = 12)
  // ❌ PAS de paddingHorizontal (géré par le parent FlatList)
  opacity: pressed ? 0.8 : 1,           // Feedback visuel au press
  ...cardShadow,                         // Voir section 2.2.1
}
```

**Shadow** (`cardShadow`, lignes 169-181) :
- **Light mode** :
  - iOS : `shadowColor: '#000'`, `shadowOffset: { width: 0, height: 1 }`, `shadowOpacity: 0.08`, `shadowRadius: 4`
  - Android : `elevation: 2`
- **Dark mode** : `{}` (pas de shadow)

**Platform.OS** : ✅ Utilisé pour différencier iOS/Android pour les shadows.

---

### 2.3. Liseret (styles.liseret)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 201-208)

**Condition** : Rendu uniquement si `!notification.read`

**Styles** (`styles.liseret`, lignes 299-306) :
```typescript
liseret: {
  position: 'absolute',  // Positionné absolument par rapport à la carte
  left: 0,               // Collé au bord gauche
  top: 0,                // Du haut
  bottom: 0,             // Jusqu'en bas
  width: 4,              // ⚠️ Hardcodé (devrait être tokens.spacing.xs = 4)
  borderRadius: 4,       // ⚠️ Hardcodé (devrait être tokens.radius.xs = 4)
}
```

**Couleur dynamique** (ligne 205) :
- `backgroundColor: getBorderColor()` selon `notification.type`
- `task_assigned` → `#4F5DFF` (primary)
- `task_completed` → `#00C853` (success)
- `task_overdue` → `#D32F2F` (error)
- `project_update` → `#FDD447` (maize)
- `comment` / `mention_in_comment` / `status_changed` → `#4F5DFF` (primary)
- `task_due_today` → `#FDD447` (maize)

**Impact sur le layout** :
- Le liseret est en `position: absolute`, donc **ne prend pas d'espace** dans le flux
- Il est masqué par `overflow: 'hidden'` sur la carte
- **N'affecte pas** l'alignement du contenu

---

### 2.4. Badge Unread (styles.unreadBadge)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 211-213)

**Condition** : Rendu uniquement si `!notification.read`

**Styles** (`styles.unreadBadge`, lignes 340-348) :
```typescript
unreadBadge: {
  width: 10,                              // ⚠️ Hardcodé
  height: 10,                             // ⚠️ Hardcodé
  borderRadius: 5,                         // ⚠️ Hardcodé
  backgroundColor: tokens.colors.brand.primary,  // #4F5DFF
  position: 'absolute',                    // Positionné absolument
  top: 10,                                 // ⚠️ Hardcodé (10px du haut)
  right: 10,                               // ⚠️ Hardcodé (10px de la droite)
}
```

**Impact sur le layout** :
- Le badge est en `position: absolute`, donc **ne prend pas d'espace** dans le flux
- Il peut **chevaucher** le contenu si le titre est long
- **N'affecte pas** l'alignement du contenu principal

---

### 2.5. Content Row (styles.contentRow)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 215-240)

**Styles** (`styles.contentRow`, lignes 307-311) :
```typescript
contentRow: {
  flexDirection: 'row',                   // Layout horizontal
  alignItems: 'flex-start',               // ✅ Aligné en haut (modifié récemment)
  paddingVertical: tokens.spacing.xs,    // 4px (ajouté récemment)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
}
```

**Contenu** :
- `iconContainer` (gauche)
- `textContainer` (droite, flex: 1)

**Impact** :
- `alignItems: 'flex-start'` : Les éléments sont alignés en haut (pas centrés verticalement)
- `paddingVertical: tokens.spacing.xs` (4px) : Ajoute un espacement vertical autour du contenu

---

### 2.6. Icon Container (styles.iconContainer)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 217-219)

**Styles** (`styles.iconContainer`, lignes 312-319) :
```typescript
iconContainer: {
  width: 36,                              // Taille fixe
  height: 36,                             // Taille fixe
  marginRight: tokens.spacing.md,         // 12px (espacement avec le texte)
  marginTop: tokens.spacing.xs,           // 4px (ajouté récemment pour aligner avec le titre)
  alignItems: 'center',                   // Centre horizontalement
  justifyContent: 'center',               // Centre verticalement
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
}
```

**Contenu** :
- Soit `<UserAvatar size={36} />`
- Soit `<View style={styles.iconCircle}>` avec `<MaterialIcons size={22} />`

**Impact** :
- `marginTop: tokens.spacing.xs` (4px) : Décale l'avatar/icône vers le bas pour l'aligner avec le titre
- `width: 36, height: 36` : Taille fixe, garantit un espacement constant

---

### 2.7. Icon Circle (styles.iconCircle)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 155-162)

**Condition** : Utilisé uniquement pour les événements système (pas pour les avatars)

**Styles** (`styles.iconCircle`, lignes 320-326) :
```typescript
iconCircle: {
  width: 36,                              // Même taille que iconContainer
  height: 36,                             // Même taille que iconContainer
  borderRadius: 18,                       // Cercle parfait
  alignItems: 'center',                   // Centre l'icône
  justifyContent: 'center',               // Centre l'icône
  backgroundColor: `${iconColor}20`,     // 12% d'opacité de la couleur de l'icône
}
```

**Contenu** :
- `<MaterialIcons name={iconName} size={22} color={iconColor} />`

**Taille réelle de l'icône** :
- `size={22}` : L'icône MaterialIcons fait **22px × 22px**
- Dans un conteneur de **36px × 36px**, l'icône est centrée avec **7px de marge** de chaque côté

---

### 2.8. UserAvatar

**Fichier** : `src/components/ui/UserAvatar.tsx` (lignes 138-147)

**Props passées** :
- `size={36}`
- `imageSource={avatarUrl}`
- `fullName={actorName}`
- `style={theme.dark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' } : undefined}`

**Styles internes** (`containerStyle`, lignes 92-100) :
```typescript
containerStyle: {
  width: 36,                              // Taille fixe
  height: 36,                             // Taille fixe
  borderRadius: 18,                       // Cercle parfait
  backgroundColor,                        // Light: #E8E8E8, Dark: #242424
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}
```

**Taille réelle de l'avatar** :
- **36px × 36px** (exactement la même taille que `iconContainer` et `iconCircle`)
- Si image : `<Image style={{ width: 36, height: 36 }} resizeMode="cover" />`
- Si initiales : `<Text style={{ fontSize: 14, fontWeight: '600' }} />` (car size >= 34)

**Différence avec l'icône** :
- Avatar : **36px × 36px** (pleine taille du conteneur)
- Icône : **22px × 22px** dans un conteneur de **36px × 36px** (avec 7px de marge)

**Impact visuel** :
- L'avatar **remplit** complètement le conteneur (36×36)
- L'icône est **plus petite** (22×22) dans le même conteneur (36×36)
- Cela peut créer une **différence visuelle** de densité entre les deux types

---

### 2.9. Text Container (styles.textContainer)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 222-239)

**Styles** (`styles.textContainer`, lignes 327-329) :
```typescript
textContainer: {
  flex: 1,                                // Prend tout l'espace restant
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
  // ❌ PAS de marginHorizontal
  // ❌ PAS de marginVertical
  // ❌ PAS de flexShrink
  // ❌ PAS de numberOfLines
  // ❌ PAS de ellipsizeMode
}
```

**Contenu** :
- `header` (titre)
- `message`
- `date`

**Impact** :
- `flex: 1` : Le texte prend tout l'espace horizontal disponible après l'icône/avatar
- Aucune contrainte de largeur, donc le texte peut s'étendre jusqu'au bord droit de la carte

---

### 2.10. Header (styles.header)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 224-228)

**Styles** (`styles.header`, lignes 330-335) :
```typescript
header: {
  flexDirection: 'row',                   // Layout horizontal
  justifyContent: 'space-between',        // Espace entre les éléments
  alignItems: 'center',                   // Centre verticalement
  marginBottom: tokens.spacing.xs,        // 4px (espacement avec le message)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
}
```

**Contenu** :
- `<SuiviText variant="h2" style={styles.title}>` (seul élément actuellement)

**Impact** :
- `justifyContent: 'space-between'` : Préparé pour un élément supplémentaire (ex: badge, action) à droite
- `alignItems: 'center'` : Centre verticalement le titre (mais le titre a aussi `marginBottom`)

---

### 2.11. Title (styles.title)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 225-227)

**Styles** (`styles.title`, lignes 336-339) :
```typescript
title: {
  flex: 1,                                // Prend tout l'espace disponible dans le header
  marginBottom: tokens.spacing.xs,        // 4px (ajouté récemment)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
  // ❌ PAS de lineHeight override
  // ❌ PAS de numberOfLines
  // ❌ PAS de ellipsizeMode
}
```

**Variant** : `variant="h2"`

**Propriétés typographiques réelles** (via `SuiviText`, `tokens.typography.h2`) :
- `fontFamily`: `Inter_500Medium`
- `fontSize`: **18px**
- `lineHeight`: **24px** (1.33× fontSize)
- `fontWeight`: `'500'`
- `color`: Light mode `#4F4A45` (primary), Dark mode `#FFFFFF` (primary)

**Impact** :
- `marginBottom: tokens.spacing.xs` (4px) : Ajoute un espacement avec le message
- `flex: 1` : Le titre peut s'étendre sur plusieurs lignes si nécessaire
- **Pas de limite de lignes** : Le titre peut être très long et prendre beaucoup d'espace vertical

---

### 2.12. Message (styles.message)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 231-233)

**Styles** (`styles.message`, lignes 349-351) :
```typescript
message: {
  marginBottom: tokens.spacing.xs,        // 4px (espacement avec la date)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
  // ❌ PAS de lineHeight override
  // ❌ PAS de numberOfLines
  // ❌ PAS de ellipsizeMode
}
```

**Variant** : `variant="body"` avec `color="secondary"`

**Propriétés typographiques réelles** (via `SuiviText`, `tokens.typography.body`) :
- `fontFamily`: `Inter_400Regular`
- `fontSize`: **15px**
- `lineHeight`: **22px** (1.47× fontSize)
- `fontWeight`: `'400'`
- `color`: Light mode `#98928C` (secondary), Dark mode `#CACACA` (secondary)

**Impact** :
- `marginBottom: tokens.spacing.xs` (4px) : Ajoute un espacement avec la date
- **Pas de limite de lignes** : Le message peut être très long et prendre beaucoup d'espace vertical
- **Pas de clipping** : Le texte peut déborder si très long

---

### 2.13. Date (styles.date)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 236-238)

**Styles** (`styles.date`, lignes 352-354) :
```typescript
date: {
  marginTop: tokens.spacing.xs,          // 4px (espacement avec le message)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de paddingVertical
  // ❌ PAS de lineHeight override
  // ❌ PAS de numberOfLines
  // ❌ PAS de ellipsizeMode
}
```

**Variant** : `variant="body"` avec `color="secondary"`

**Propriétés typographiques réelles** (via `SuiviText`, `tokens.typography.body`) :
- `fontFamily`: `Inter_400Regular`
- `fontSize`: **15px**
- `lineHeight`: **22px** (1.47× fontSize)
- `fontWeight`: `'400'`
- `color`: Light mode `#98928C` (secondary), Dark mode `#CACACA` (secondary)

**Impact** :
- `marginTop: tokens.spacing.xs` (4px) : Ajoute un espacement avec le message
- **Pas de limite de lignes** : Normalement la date est courte, mais peut être longue si formatée différemment

---

## 3. 🧩 DÉTECTER CE QUI PEUT CAUSER UN DÉCALAGE OU UN MAUVAIS RENDU

### 3.1. Différences entre types d'icône (MaterialIcons) et avatars humains

**Avatar (UserAvatar)** :
- **Taille réelle** : **36px × 36px** (remplit complètement le conteneur)
- **Conteneur** : `iconContainer` (36×36) avec `marginTop: 4px`
- **Alignement** : Centré dans le conteneur, mais le conteneur a un `marginTop: 4px`

**Icône (MaterialIcons)** :
- **Taille réelle** : **22px × 22px** (dans un conteneur de 36×36)
- **Conteneur** : `iconCircle` (36×36) dans `iconContainer` (36×36) avec `marginTop: 4px`
- **Alignement** : Centré dans `iconCircle`, qui est centré dans `iconContainer`

**Problème identifié** :
- ⚠️ **Différence visuelle de densité** : L'avatar remplit 100% du conteneur (36×36), tandis que l'icône ne remplit que 60% (22×22 dans 36×36)
- ⚠️ **Double conteneur pour l'icône** : `iconCircle` est dans `iconContainer`, ce qui peut créer des problèmes d'alignement si les styles ne sont pas parfaitement synchronisés
- ⚠️ **Background de l'icône** : `iconCircle` a un `backgroundColor: ${iconColor}20` (12% d'opacité), ce qui peut créer une différence visuelle avec l'avatar qui a un background solide

---

### 3.2. Différence de taille réelle

**Avatar** :
- Conteneur : **36px × 36px**
- Contenu : **36px × 36px** (Image ou initiales)
- **Remplissage** : **100%**

**Icône** :
- Conteneur externe (`iconContainer`) : **36px × 36px**
- Conteneur interne (`iconCircle`) : **36px × 36px**
- Icône MaterialIcons : **22px × 22px**
- **Remplissage** : **60%** (22/36)

**Impact** :
- L'avatar **semble plus grand** visuellement car il remplit complètement le conteneur
- L'icône **semble plus petite** car elle est centrée avec des marges

---

### 3.3. Différences de marginTop / marginBottom entre les component-types

**iconContainer** :
- `marginTop: tokens.spacing.xs` (4px) : ✅ **Identique pour avatar et icône**

**header** :
- `marginBottom: tokens.spacing.xs` (4px) : ✅ **Identique pour tous les types**

**title** :
- `marginBottom: tokens.spacing.xs` (4px) : ✅ **Identique pour tous les types**

**message** :
- `marginBottom: tokens.spacing.xs` (4px) : ✅ **Identique pour tous les types**

**date** :
- `marginTop: tokens.spacing.xs` (4px) : ✅ **Identique pour tous les types**

**Conclusion** : ✅ **Pas de différence** entre les types de notifications pour les marges verticales.

---

### 3.4. Effets du overflow: hidden et de position: absolute du liseret

**Liseret** :
- `position: 'absolute'` : Ne prend pas d'espace dans le flux
- `left: 0, top: 0, bottom: 0` : Collé au bord gauche, du haut au bas
- `width: 4px` : Largeur fixe
- `overflow: 'hidden'` sur la carte : Masque le liseret qui dépasse

**Impact** :
- ✅ Le liseret **n'affecte pas** l'alignement du contenu
- ✅ Le liseret **ne prend pas d'espace** dans le flux
- ✅ Le liseret est **masqué** par `overflow: 'hidden'` si nécessaire

**Conclusion** : ✅ **Pas de problème** avec le liseret.

---

### 3.5. Effets de la shadow box sur le Pressable

**Shadow** (light mode uniquement) :
- iOS : `shadowOffset: { width: 0, height: 1 }`, `shadowOpacity: 0.08`, `shadowRadius: 4`
- Android : `elevation: 2`

**Impact** :
- La shadow est **très légère** (opacité 0.08, offset 1px)
- Elle ne devrait **pas affecter** l'alignement du contenu
- Elle peut créer une **légère élévation visuelle** mais n'impacte pas le layout

**Conclusion** : ✅ **Pas de problème** avec la shadow.

---

### 3.6. Comportements différents entre iOS / Android

**Platform.OS utilisé** :
- ✅ Utilisé pour différencier les shadows (iOS vs Android)
- ❌ **Pas utilisé** pour les autres styles (padding, margin, alignment)

**Différences potentielles** :
- **LineHeight** : Peut être interprété différemment entre iOS et Android
- **Font rendering** : Les polices peuvent être rendues légèrement différemment
- **Shadow** : iOS utilise `shadow*`, Android utilise `elevation`

**Conclusion** : ⚠️ **Différences mineures** possibles, mais pas de problème majeur identifié.

---

### 3.7. Wrapper supplémentaire dans NotificationsScreen

**NotificationsScreen.tsx** (lignes 85-93) :
```typescript
const renderNotificationItem = ({ item }: { item: any }) => {
  return (
    <NotificationItem
      key={item.id}
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );
};
```

**Aucun wrapper supplémentaire** : NotificationItem est rendu directement dans le FlatList.

**Props passées** :
- `notification={item}` : ✅ Données de la notification
- `onPress={handleNotificationPress}` : ✅ Handler de navigation
- `style={undefined}` : ❌ **Pas de style passé**

**Conclusion** : ✅ **Pas de wrapper supplémentaire**, pas de style externe appliqué.

---

### 3.8. Props passées depuis NotificationsScreen

**Props passées** :
- `notification` : Données de la notification
- `onPress` : Handler de navigation
- `style` : **undefined** (pas de style passé)

**Props non passées** :
- `dense` : ❌ N'existe pas
- `compact` : ❌ N'existe pas
- `withLiseret` : ❌ N'existe pas (le liseret est géré par `notification.read`)

**Conclusion** : ✅ **Pas de props supplémentaires** qui pourraient affecter le layout.

---

## 4. 🔍 ANALYSER SPÉCIFIQUEMENT LES TEXTES

### 4.1. Title (variant="h2")

**Propriétés réelles** :
- `fontFamily`: `Inter_500Medium`
- `fontSize`: **18px**
- `lineHeight`: **24px** (1.33× fontSize)
- `fontWeight`: `'500'`
- `color`: Light mode `#4F4A45`, Dark mode `#FFFFFF`

**Marges effectives** :
- `marginBottom: tokens.spacing.xs` (4px) : Dans `styles.title`
- `marginBottom: tokens.spacing.xs` (4px) : Dans `styles.header` (parent)

**Total marginBottom** : **8px** (4px du header + 4px du title)

**Contraintes** :
- ❌ **Pas de numberOfLines** : Le titre peut être très long et prendre plusieurs lignes
- ❌ **Pas de ellipsizeMode** : Le texte n'est pas tronqué
- ❌ **Pas de flexShrink** : Le titre peut s'étendre indéfiniment

**Clipping** :
- ❌ **Pas de clipping** : Le texte peut déborder si très long

---

### 4.2. Message (variant="body", color="secondary")

**Propriétés réelles** :
- `fontFamily`: `Inter_400Regular`
- `fontSize`: **15px**
- `lineHeight`: **22px** (1.47× fontSize)
- `fontWeight`: `'400'`
- `color`: Light mode `#98928C`, Dark mode `#CACACA`

**Marges effectives** :
- `marginBottom: tokens.spacing.xs` (4px) : Dans `styles.message`

**Contraintes** :
- ❌ **Pas de numberOfLines** : Le message peut être très long et prendre plusieurs lignes
- ❌ **Pas de ellipsizeMode** : Le texte n'est pas tronqué
- ❌ **Pas de flexShrink** : Le message peut s'étendre indéfiniment

**Clipping** :
- ❌ **Pas de clipping** : Le texte peut déborder si très long

---

### 4.3. Date (variant="body", color="secondary")

**Propriétés réelles** :
- `fontFamily`: `Inter_400Regular`
- `fontSize`: **15px**
- `lineHeight`: **22px** (1.47× fontSize)
- `fontWeight`: `'400'`
- `color`: Light mode `#98928C`, Dark mode `#CACACA`

**Marges effectives** :
- `marginTop: tokens.spacing.xs` (4px) : Dans `styles.date`

**Contraintes** :
- ❌ **Pas de numberOfLines** : Normalement la date est courte, mais peut être longue
- ❌ **Pas de ellipsizeMode** : Le texte n'est pas tronqué
- ❌ **Pas de flexShrink** : La date peut s'étendre indéfiniment

**Clipping** :
- ❌ **Pas de clipping** : Le texte peut déborder si très long

---

## 5. 🖼️ ANALYSER L'AVATAR vs ICÔNE

### 5.1. Taille réelle de l'avatar rendu

**UserAvatar avec `size={36}`** :
- **Conteneur** : **36px × 36px** (exact)
- **Image** : **36px × 36px** avec `resizeMode="cover"` (remplit le conteneur)
- **Initiales** : `fontSize: 14` (car size >= 34), `fontWeight: '600'`

**Taille réelle rendue** : **36px × 36px** (100% du conteneur)

---

### 5.2. Taille réelle des icônes MaterialIcons

**MaterialIcons avec `size={22}`** :
- **Icône** : **22px × 22px** (exact)
- **Conteneur** (`iconCircle`) : **36px × 36px**
- **Marge autour de l'icône** : **7px** de chaque côté (36 - 22) / 2

**Taille réelle rendue** : **22px × 22px** (60% du conteneur de 36×36)

---

### 5.3. Différences de vertical offset

**iconContainer** :
- `marginTop: tokens.spacing.xs` (4px) : ✅ **Identique pour avatar et icône**

**Alignement vertical** :
- Avatar : Centré dans `iconContainer` (36×36) avec `marginTop: 4px`
- Icône : Centrée dans `iconCircle` (36×36), qui est centrée dans `iconContainer` (36×36) avec `marginTop: 4px`

**Problème identifié** :
- ⚠️ **Double conteneur pour l'icône** : `iconCircle` est dans `iconContainer`, ce qui peut créer des problèmes d'alignement si les styles ne sont pas parfaitement synchronisés
- ⚠️ **Différence visuelle** : L'avatar remplit 100% du conteneur, tandis que l'icône ne remplit que 60%

---

### 5.4. Styles du conteneur (marginTop, marginBottom)

**iconContainer** :
- `marginTop: tokens.spacing.xs` (4px) : ✅ **Identique pour avatar et icône**
- `marginBottom: 0` : ❌ **Pas de marginBottom**

**Impact** :
- Le `marginTop: 4px` décale l'avatar/icône vers le bas pour l'aligner avec le titre
- Mais il n'y a **pas de marginBottom**, donc l'espacement vertical n'est pas symétrique

---

## 6. 🧭 IDENTIFIER LA SOURCE PROBABLE DE L'IMPERFECTION VISUELLE

### 6.1. Éléments responsables du décalage perçu

**1. Différence de taille visuelle entre avatar et icône** :
- Avatar : **36px × 36px** (100% du conteneur)
- Icône : **22px × 22px** (60% du conteneur de 36×36)
- **Impact** : L'avatar semble plus grand et plus dense visuellement que l'icône

**2. Double conteneur pour l'icône** :
- `iconCircle` (36×36) est dans `iconContainer` (36×36)
- **Impact** : Peut créer des problèmes d'alignement si les styles ne sont pas parfaitement synchronisés

**3. marginTop du iconContainer** :
- `marginTop: tokens.spacing.xs` (4px) : Décale l'avatar/icône vers le bas
- **Impact** : Peut créer un décalage visuel si le titre a une `lineHeight` différente

**4. paddingVertical du contentRow** :
- `paddingVertical: tokens.spacing.xs` (4px) : Ajoute un espacement vertical autour du contenu
- **Impact** : Peut créer un espacement vertical supplémentaire qui n'est pas nécessaire

**5. marginBottom du header** :
- `marginBottom: tokens.spacing.xs` (4px) : Dans `styles.header`
- **Impact** : Ajoute un espacement avec le message, mais peut créer un double espacement avec `marginBottom` du title

**6. marginBottom du title** :
- `marginBottom: tokens.spacing.xs` (4px) : Dans `styles.title`
- **Impact** : Ajoute un espacement avec le message, mais crée un **double espacement** avec `marginBottom` du header (total : 8px)

**7. lineHeight du variant h2** :
- `lineHeight: 24px` (1.33× fontSize de 18px)
- **Impact** : Peut créer un espacement vertical supplémentaire si le titre est sur une seule ligne

**8. Alignement vertical incohérent** :
- `contentRow` : `alignItems: 'flex-start'` (aligné en haut)
- `iconContainer` : `justifyContent: 'center'` (centré verticalement)
- **Impact** : Peut créer un décalage si le contenu texte a une hauteur différente

---

### 6.2. Les 3 causes les plus probables

**1. 🥇 Différence de taille visuelle entre avatar (36×36) et icône (22×22 dans 36×36)** :
- **Probabilité** : **Très élevée**
- **Impact** : L'avatar semble plus grand et plus dense visuellement que l'icône
- **Solution potentielle** : Uniformiser la taille visuelle (ex: réduire l'avatar à 32×32 ou augmenter l'icône à 24×24)

**2. 🥈 Double espacement vertical (marginBottom du header + marginBottom du title = 8px)** :
- **Probabilité** : **Élevée**
- **Impact** : Crée un espacement vertical trop grand entre le titre et le message (8px au lieu de 4px)
- **Solution potentielle** : Supprimer `marginBottom` du header ou du title (garder seulement un)

**3. 🥉 Alignement vertical incohérent (alignItems: 'flex-start' + justifyContent: 'center')** :
- **Probabilité** : **Moyenne**
- **Impact** : Peut créer un décalage si le contenu texte a une hauteur différente (titre long vs court)
- **Solution potentielle** : Uniformiser l'alignement vertical (ex: `alignItems: 'center'` dans contentRow ou supprimer `justifyContent: 'center'` dans iconContainer)

---

**Fin du rapport d'audit**

