# 🔍 AUDIT STRUCTUREL COMPLET : Décalage Horizontal NotificationItem

**Date** : 2024-11-19  
**Objectif** : Identifier la cause exacte du décalage horizontal des icônes/avatars dans NotificationItem

---

## 1. 🧱 HIÉRARCHIE COMPLÈTE DU RENDU

### 1.1. Structure depuis FlatList jusqu'au contenu

```
NotificationsScreen.tsx
└── <FlatList
      contentContainerStyle={styles.listContent}  ← paddingHorizontal: tokens.spacing.lg (16px)
      renderItem={renderNotificationItem}
      └── <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
            style={undefined}
            └── <Pressable
                  style={[
                    styles.card,  ← marginBottom: 12px, position: relative, overflow: hidden
                    {
                      backgroundColor: cardBackgroundColor,
                      borderRadius: 12,
                      paddingVertical: 14,  ← ⚠️ Hardcodé
                      // ❌ PAS de paddingHorizontal (géré par parent)
                      opacity: pressed ? 0.8 : 1,
                      ...cardShadow,
                    },
                    style,  ← undefined
                  ]}
                  └── {/* Liseret latéral - conditionnel si !read */}
                      {!notification.read && (
                        <View
                          style={[
                            styles.liseret,  ← position: absolute, left: 0, top: 0, bottom: 0, width: 4
                            { backgroundColor: getBorderColor() },
                          ]}
                        />
                      )}
                      
                      {/* Badge unread - conditionnel si !read */}
                      {!notification.read && (
                        <View
                          style={styles.unreadBadge}  ← position: absolute, top: 10, right: 10, 10×10
                        />
                      )}
                      
                      <View style={styles.contentRow}>  ← flexDirection: row, alignItems: center, paddingVertical: 4px
                          └── <View style={styles.iconContainer}>  ← width: 36, height: 36, marginRight: 12px
                                └── {renderIconOrAvatar()}
                                      ├── CAS 1: Avatar (si isHumanEvent)
                                      │     └── <UserAvatar
                                      │           size={32}  ← ⚠️ 32×32 dans iconContainer 36×36
                                      │           imageSource={avatarUrl}
                                      │           fullName={actorName}
                                      │           style={theme.dark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' } : undefined}
                                      │           └── <View style={containerStyle}>  ← width: 32, height: 32, borderRadius: 16
                                      │                 └── <Image style={imageStyle} /> OU <Text style={initials} />
                                      │
                                      └── CAS 2: Icône (si événement système)
                                            └── <View style={styles.iconCircle}>  ← width: 36, height: 36, borderRadius: 18
                                                  └── <MaterialIcons
                                                        name={iconName}
                                                        size={24}  ← ⚠️ 24×24 dans iconCircle 36×36
                                                        color={iconColor}
                                                      />
                          
                          └── <View style={styles.textContainer}>  ← flex: 1
                                └── <View style={styles.header}>
                                      └── <SuiviText variant="h2" style={styles.title}>
                                └── <SuiviText variant="body" style={styles.message}>
                                └── <SuiviText variant="body" style={styles.date}>
```

---

## 2. 🎨 STYLES EFFECTIVEMENT APPLIQUÉS PAR NIVEAU

### 2.1. FlatList (NotificationsScreen.tsx)

**Fichier** : `src/screens/NotificationsScreen.tsx` (lignes 156-162)

**Props** :
- `contentContainerStyle={styles.listContent}`

**Styles appliqués** (`styles.listContent`, lignes 198-202) :
```typescript
listContent: {
  paddingHorizontal: tokens.spacing.lg,  // 16px ✅
  paddingBottom: tokens.spacing.md,       // 12px
  flexGrow: 1,
}
```

**Offset total depuis le bord gauche de l'écran** : **16px** (paddingHorizontal du FlatList)

---

### 2.2. Pressable (styles.card)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 184-198)

**Styles de base** (`styles.card`, lignes 294-298) :
```typescript
card: {
  marginBottom: tokens.spacing.md,  // 12px (espacement entre cartes)
  position: 'relative',             // Pour liseret et badge absolute
  overflow: 'hidden',               // ⚠️ Masque le liseret qui dépasse
}
```

**Styles inline** (lignes 188-196) :
```typescript
{
  backgroundColor: cardBackgroundColor,  // Light: #FFFFFF, Dark: #1A1A1A
  borderRadius: 12,
  paddingVertical: 14,                  // ⚠️ Hardcodé (devrait être tokens.spacing.md = 12)
  // ❌ PAS de paddingHorizontal (géré par le parent FlatList)
  opacity: pressed ? 0.8 : 1,
  ...cardShadow,
}
```

**Offset total depuis le bord gauche de l'écran** : **16px** (hérite du FlatList, pas de paddingHorizontal sur la carte)

**Largeur réelle** : `100% - 32px` (16px de chaque côté via FlatList)

---

### 2.3. Liseret (styles.liseret)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 201-208)

**Condition** : Rendu uniquement si `!notification.read`

**Styles** (`styles.liseret`, lignes 299-306) :
```typescript
liseret: {
  position: 'absolute',  // ⚠️ Positionné absolument, ne prend pas d'espace dans le flux
  left: 0,               // Collé au bord gauche de la carte
  top: 0,                // Du haut
  bottom: 0,             // Jusqu'en bas
  width: 4,              // ⚠️ 4px de largeur
  borderRadius: 4,
}
```

**Impact sur le layout** :
- ✅ Le liseret est en `position: absolute`, donc **ne prend pas d'espace** dans le flux
- ✅ Il est masqué par `overflow: 'hidden'` sur la carte si nécessaire
- ⚠️ **MAIS** : Le liseret est collé à `left: 0`, donc il commence **exactement au bord gauche de la carte**
- ⚠️ **PROBLÈME POTENTIEL** : Si le liseret est visible, il peut créer une **illusion visuelle** de décalage car il occupe 4px à gauche, mais le contenu (contentRow) commence toujours à `left: 0` de la carte

**Offset total depuis le bord gauche de l'écran** : **16px** (même que la carte, car position absolute)

---

### 2.4. Content Row (styles.contentRow)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 215-240)

**Styles** (`styles.contentRow`, lignes 307-311) :
```typescript
contentRow: {
  flexDirection: 'row',                   // Layout horizontal
  alignItems: 'center',                  // ✅ Centre verticalement
  paddingVertical: tokens.spacing.xs,    // 4px (haut et bas)
  // ❌ PAS de paddingHorizontal
  // ❌ PAS de marginHorizontal
  // ❌ PAS de marginLeft
  // ❌ PAS de paddingLeft
}
```

**Offset total depuis le bord gauche de l'écran** : **16px** (hérite du FlatList, pas de padding/margin supplémentaire)

**Largeur réelle** : `100% - 32px` (16px de chaque côté via FlatList)

---

### 2.5. Icon Container (styles.iconContainer)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 217-219)

**Styles** (`styles.iconContainer`, lignes 312-318) :
```typescript
iconContainer: {
  width: 36,                              // ✅ Taille fixe
  height: 36,                             // ✅ Taille fixe
  marginRight: tokens.spacing.md,         // 12px (espacement avec le texte)
  alignItems: 'center',                   // Centre horizontalement
  justifyContent: 'center',               // Centre verticalement
  // ❌ PAS de marginLeft
  // ❌ PAS de paddingLeft
  // ❌ PAS de paddingHorizontal
}
```

**Offset total depuis le bord gauche de l'écran** : **16px** (hérite du FlatList, pas de marginLeft)

**Largeur réelle** : **36px**

**Position** : Commence à **16px** du bord gauche de l'écran (aligné avec le paddingHorizontal du FlatList)

---

### 2.6. Avatar (UserAvatar avec size={32})

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 138-147)

**Props passées** :
- `size={32}` ⚠️ **32×32px** dans un iconContainer de **36×36px**

**Styles internes** (`UserAvatar.tsx`, lignes 105-113) :
```typescript
containerStyle: {
  width: size,        // 32px
  height: size,       // 32px
  borderRadius: size / 2,  // 16px
  backgroundColor,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}
```

**Taille réelle rendue** : **32×32px**

**Position dans iconContainer** :
- iconContainer : **36×36px**
- Avatar : **32×32px**
- **Marge autour de l'avatar** : **2px** de chaque côté (36 - 32) / 2

**Offset total depuis le bord gauche de l'écran** :
- FlatList paddingHorizontal : **16px**
- iconContainer commence à : **16px**
- Avatar commence à : **16px + 2px = 18px** (centré dans iconContainer)

**Largeur réelle visible** : **32px**

---

### 2.7. Icône Système (iconCircle avec MaterialIcons)

**Fichier** : `src/components/ui/NotificationItem.tsx` (lignes 154-162)

**Styles** (`styles.iconCircle`, lignes 319-325) :
```typescript
iconCircle: {
  width: 36,                              // ✅ 36×36px
  height: 36,                             // ✅ 36×36px
  borderRadius: 18,                       // ✅ Cercle parfait
  alignItems: 'center',                   // Centre l'icône
  justifyContent: 'center',               // Centre l'icône
  backgroundColor: `${iconColor}20`,     // 12% d'opacité
}
```

**MaterialIcons** (ligne 158) :
- `size={24}` ⚠️ **24×24px** dans un iconCircle de **36×36px**

**Taille réelle rendue** :
- iconCircle : **36×36px** (remplit complètement iconContainer)
- MaterialIcons : **24×24px** (centré dans iconCircle)
- **Marge autour de l'icône** : **6px** de chaque côté (36 - 24) / 2

**Position dans iconContainer** :
- iconContainer : **36×36px**
- iconCircle : **36×36px** (remplit complètement iconContainer)
- MaterialIcons : **24×24px** (centré dans iconCircle)

**Offset total depuis le bord gauche de l'écran** :
- FlatList paddingHorizontal : **16px**
- iconContainer commence à : **16px**
- iconCircle commence à : **16px** (remplit iconContainer)
- MaterialIcons commence à : **16px + 6px = 22px** (centré dans iconCircle)

**Largeur réelle visible** :
- iconCircle : **36px** (visible avec background color)
- MaterialIcons : **24px** (centré dans le cercle)

---

## 3. 📊 TABLEAU COMPUTED LAYOUT

| Élément | width | height | marginLeft | paddingLeft | offset total depuis bord écran | Observations |
|---------|-------|--------|------------|-------------|--------------------------------|--------------|
| **FlatList** | 100% | auto | 0 | **16px** (paddingHorizontal) | **16px** | Padding appliqué via contentContainerStyle |
| **Pressable (card)** | 100% - 32px | auto | 0 | 0 | **16px** | Hérite du paddingHorizontal du FlatList |
| **Liseret** (si !read) | 4px | 100% | 0 | 0 | **16px** | position: absolute, left: 0, ne prend pas d'espace dans le flux |
| **contentRow** | 100% - 32px | auto | 0 | 0 | **16px** | Hérite du paddingHorizontal du FlatList |
| **iconContainer** | **36px** | **36px** | 0 | 0 | **16px** | Commence exactement au bord gauche du contentRow |
| **Avatar (UserAvatar)** | **32px** | **32px** | 0 | 0 | **18px** | Centré dans iconContainer 36×36, donc +2px de marge |
| **iconCircle** | **36px** | **36px** | 0 | 0 | **16px** | Remplit complètement iconContainer |
| **MaterialIcons** | **24px** | **24px** | 0 | 0 | **22px** | Centré dans iconCircle 36×36, donc +6px de marge |

---

## 4. 🔍 COMPARAISON AVATAR vs ICÔNE SYSTÈME

### 4.1. Taille visuelle

**Avatar** :
- Taille réelle : **32×32px**
- Conteneur : **36×36px** (iconContainer)
- **Remplissage** : **88.9%** (32/36)
- **Marge autour** : **2px** de chaque côté

**Icône Système** :
- Taille réelle : **24×24px** (MaterialIcons)
- Conteneur externe : **36×36px** (iconContainer)
- Conteneur interne : **36×36px** (iconCircle)
- **Remplissage** : **66.7%** (24/36)
- **Marge autour** : **6px** de chaque côté

**Différence visuelle** :
- ⚠️ L'avatar **semble plus grand** car il remplit 88.9% du conteneur
- ⚠️ L'icône **semble plus petite** car elle ne remplit que 66.7% du conteneur
- ⚠️ **Différence de densité visuelle** : Avatar = 88.9%, Icône = 66.7%

---

### 4.2. Position horizontale

**Avatar** :
- Offset depuis bord écran : **18px** (16px FlatList + 2px marge centrage)
- Largeur visible : **32px**
- Position dans iconContainer : **Centré** (2px de marge de chaque côté)

**Icône Système** :
- Offset depuis bord écran : **22px** (16px FlatList + 6px marge centrage)
- Largeur visible : **24px** (MaterialIcons) + **36px** (iconCircle avec background)
- Position dans iconContainer : **Centré** (iconCircle remplit iconContainer, icône centrée dans iconCircle)

**Différence de position** :
- ⚠️ **Avatar commence à 18px**, **Icône commence à 22px**
- ⚠️ **Décalage de 4px** entre le début de l'avatar et le début de l'icône MaterialIcons
- ⚠️ Mais le **iconCircle (36×36) commence à 16px**, donc visuellement le cercle est aligné avec le conteneur, mais l'icône à l'intérieur est décalée de 6px

---

### 4.3. Impact visuel du liseret

**Si notification non lue** :
- Liseret : **4px de largeur**, position `absolute`, `left: 0`
- Le liseret est **collé au bord gauche de la carte** (16px du bord écran)
- Le liseret **ne prend pas d'espace** dans le flux (position absolute)
- **MAIS** : Le liseret peut créer une **illusion visuelle** de décalage car il occupe 4px visuellement à gauche

**Impact sur l'alignement** :
- Le liseret ne décale **pas** le contenu (contentRow commence toujours à 16px)
- **MAIS** : Visuellement, le liseret peut faire paraître le contenu plus à droite car il y a 4px de couleur à gauche

---

## 5. 🧐 DÉTECTER LA CAUSE EXACTE DU DÉCALAGE HORIZONTAL

### 5.1. Est-ce que iconContainer est réellement à 36px ou écrasé plus petit ?

**Réponse** : ✅ **iconContainer est réellement à 36px**
- `width: 36` (ligne 313)
- `height: 36` (ligne 314)
- Pas de contrainte qui pourrait l'écraser

---

### 5.2. Est-ce que le cercle 36px est tronqué par overflow: hidden du Pressable ?

**Réponse** : ❌ **Non, le cercle n'est pas tronqué**
- `overflow: 'hidden'` sur la carte (ligne 297) masque le liseret qui dépasse
- Mais `iconCircle` (36×36) est dans `iconContainer` (36×36), qui est dans `contentRow`, qui est dans `Pressable`
- Le cercle ne dépasse pas, donc pas de troncature

---

### 5.3. Est-ce que le paddingHorizontal du FlatList crée un décalage apparent ?

**Réponse** : ⚠️ **Oui, mais c'est normal et attendu**
- `paddingHorizontal: tokens.spacing.lg` (16px) sur le FlatList
- Tous les éléments (avatar, icône, texte) commencent à **16px** du bord écran
- C'est **cohérent** avec la Home et MyTasks
- **MAIS** : Si le liseret est visible (notification non lue), il peut créer une **illusion visuelle** de décalage car il y a 4px de couleur à gauche

---

### 5.4. Est-ce qu'un nested container rajoute une marge interne non visible ?

**Réponse** : ❌ **Non, pas de marge interne**
- `iconContainer` : pas de `marginLeft`, pas de `paddingLeft`
- `iconCircle` : pas de `marginLeft`, pas de `paddingLeft`
- `UserAvatar` : pas de `marginLeft`, pas de `paddingLeft` dans les styles internes

---

### 5.5. Est-ce que UserAvatar a un margin/padding implicite dans ses styles internes ?

**Réponse** : ❌ **Non, pas de margin/padding implicite**
- `containerStyle` dans UserAvatar : `width: size`, `height: size`, pas de margin/padding
- `imageStyle` : `width: size`, `height: size`, pas de margin/padding
- Le seul style externe possible est `style={theme.dark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' } : undefined}`, qui ajoute une bordure mais ne change pas la taille

---

### 5.6. Est-ce que iconCircle est centré, mais le cercle commence trop à gauche ?

**Réponse** : ❌ **Non, iconCircle est correctement positionné**
- `iconCircle` (36×36) remplit complètement `iconContainer` (36×36)
- `iconCircle` commence à **16px** du bord écran (même position que iconContainer)
- L'icône MaterialIcons (24×24) est centrée dans iconCircle, donc commence à **22px** (16px + 6px)

---

### 5.7. Est-ce que le liseret (position absolute left:0 width:4) décale visuellement l'icône à gauche ?

**Réponse** : ⚠️ **OUI, C'EST PROBABLEMENT LA CAUSE PRINCIPALE**
- Le liseret est en `position: absolute`, `left: 0`, `width: 4`
- Il est **collé au bord gauche de la carte** (16px du bord écran)
- Le liseret **ne décale pas** le contenu dans le flux (position absolute)
- **MAIS** : Visuellement, le liseret occupe 4px à gauche, ce qui peut créer une **illusion** que le contenu (iconContainer) est décalé vers la droite
- **PROBLÈME** : Si le liseret est visible, il y a **4px de couleur à gauche**, puis le contenu commence à **16px**, ce qui peut faire paraître le contenu **trop à droite** visuellement

---

## 6. 🎯 IDENTIFIER LA SOURCE PRINCIPALE

### 6.1. Cause principale identifiée

**QUEL style crée le décalage** : Le **liseret** (position absolute, left: 0, width: 4)

**OÙ** : `src/components/ui/NotificationItem.tsx` (lignes 299-306)

**COMMENT** :
- Le liseret est en `position: absolute`, `left: 0`, `width: 4`
- Il est collé au bord gauche de la carte (16px du bord écran)
- Il **ne décale pas** le contenu dans le flux (position absolute)
- **MAIS** : Visuellement, il occupe 4px à gauche, créant une **illusion** que le contenu est décalé vers la droite

**POURQUOI ça produit le décalage** :
- Le liseret occupe **4px visuellement** à gauche (16px à 20px du bord écran)
- Le contenu (iconContainer) commence à **16px** du bord écran
- Visuellement, il y a **4px de couleur** (liseret) puis le contenu, ce qui peut faire paraître le contenu **trop à droite** ou créer une **asymétrie visuelle**

---

### 6.2. Causes secondaires

**1. Différence de taille visuelle entre avatar (32×32) et icône (24×24)** :
- Avatar : **32×32px** dans iconContainer 36×36 → **88.9% de remplissage**
- Icône : **24×24px** dans iconCircle 36×36 → **66.7% de remplissage**
- **Impact** : L'avatar semble plus grand et plus dense visuellement

**2. Position différente du contenu visible** :
- Avatar visible commence à : **18px** (16px + 2px marge centrage)
- Icône MaterialIcons visible commence à : **22px** (16px + 6px marge centrage)
- **Impact** : **Décalage de 4px** entre le début visible de l'avatar et le début visible de l'icône

---

## 7. 🛠️ PROPOSITION DE CORRECTION ROBUSTE

### 7.1. Correction principale : Compenser le liseret visuellement

**Problème** : Le liseret (4px) crée une illusion visuelle de décalage.

**Solution** : Ajouter un `paddingLeft` conditionnel sur `contentRow` quand le liseret est visible, pour compenser visuellement.

**MAIS** : Cette solution n'est **pas recommandée** car elle ajoute de la complexité et peut créer des problèmes d'alignement avec les notifications lues.

---

### 7.2. Correction recommandée : Uniformiser les tailles visuelles

**Problème** : Avatar (32×32) et icône (24×24) ont des tailles visuelles différentes.

**Solution** : Uniformiser les tailles pour que avatar et icône aient la **même présence visuelle**.

**Option A : Augmenter l'avatar à 36×36**
- `UserAvatar size={36}` au lieu de `size={32}`
- Avatar : **36×36px** (remplit iconContainer)
- Icône : **24×24px** dans iconCircle 36×36
- **Problème** : L'avatar sera plus grand que l'icône visuellement

**Option B : Réduire iconCircle et augmenter l'icône**
- `iconCircle` : **32×32px** (au lieu de 36×36)
- `MaterialIcons size={24}` → `size={28}` (ou garder 24)
- Avatar : **32×32px** dans iconContainer 36×36
- Icône : **28×28px** (ou 24×24) dans iconCircle 32×32
- **Problème** : Complexité, et l'icône sera toujours plus petite que l'avatar

**Option C : Uniformiser à 36×36 pour les deux** ⭐ **RECOMMANDÉ**
- `UserAvatar size={36}` au lieu de `size={32}`
- `iconCircle` : **36×36px** (déjà le cas)
- `MaterialIcons size={24}` → `size={28}` pour meilleure proportion
- **Résultat** :
  - Avatar : **36×36px** (remplit iconContainer 36×36)
  - Icône : **28×28px** dans iconCircle 36×36 (ou 24×24 si on garde)
  - **Même conteneur** (36×36) pour les deux
  - **Même position** (commencent à 16px du bord écran)
  - **Présence visuelle plus cohérente**

---

### 7.3. Correction alternative : Ajuster iconContainer pour compenser le liseret

**Problème** : Le liseret crée une illusion visuelle de décalage.

**Solution** : Ajouter un `paddingLeft: 4` sur `iconContainer` quand le liseret est visible.

**MAIS** : Cette solution nécessite de passer une prop `hasLiseret` ou de détecter `notification.read`, ce qui ajoute de la complexité.

---

## 8. 📋 RÉSUMÉ DES PROBLÈMES IDENTIFIÉS

### 8.1. Problème principal

**Le liseret crée une illusion visuelle de décalage** :
- Liseret : **4px de largeur**, position absolute, left: 0
- Visuellement, il y a **4px de couleur** à gauche, puis le contenu
- Cela peut faire paraître le contenu **trop à droite** ou créer une **asymétrie visuelle**

**Nombre de pixels de décalage perçu** : **~4px** (largeur du liseret)

---

### 8.2. Problèmes secondaires

**1. Différence de taille visuelle** :
- Avatar : **32×32px** (88.9% de remplissage)
- Icône : **24×24px** (66.7% de remplissage)
- **Impact** : L'avatar semble plus grand et plus dense

**2. Position différente du contenu visible** :
- Avatar visible commence à : **18px**
- Icône visible commence à : **22px**
- **Décalage** : **4px** entre les deux

---

## 9. ✅ CORRECTION ROBUSTE RECOMMANDÉE

### 9.1. Solution proposée

**Uniformiser les tailles à 36×36 pour avatar et iconCircle** :

1. **UserAvatar** : `size={36}` au lieu de `size={32}`
   - Avatar : **36×36px** (remplit iconContainer 36×36)
   - Position : Commence à **16px** du bord écran (même que iconContainer)

2. **iconCircle** : Garder **36×36px** (déjà le cas)
   - Icône : **24×24px** dans iconCircle 36×36 (ou augmenter à 28×28 pour meilleure proportion)
   - Position : Commence à **16px** du bord écran (même que iconContainer)

3. **Résultat** :
   - Avatar et iconCircle : **Même taille** (36×36)
   - Avatar et iconCircle : **Même position** (commencent à 16px)
   - **Présence visuelle cohérente** (avatar remplit 100%, icône dans cercle 36×36)

---

### 9.2. Impact sur le liseret

**Le liseret reste un problème visuel** :
- Même avec l'uniformisation, le liseret (4px) peut créer une illusion de décalage
- **Solution optionnelle** : Ajouter un `paddingLeft: 4` sur `contentRow` quand `!notification.read`, mais cela peut créer des problèmes d'alignement avec les notifications lues

---

## 10. 📌 CONCLUSION

### 10.1. Cause principale

**Le liseret (4px, position absolute, left: 0) crée une illusion visuelle de décalage** :
- Il occupe 4px visuellement à gauche
- Le contenu commence à 16px du bord écran
- Visuellement, il y a 4px de couleur puis le contenu, ce qui peut faire paraître le contenu trop à droite

### 10.2. Causes secondaires

1. **Différence de taille visuelle** : Avatar 32×32 (88.9%) vs Icône 24×24 (66.7%)
2. **Position différente** : Avatar visible à 18px vs Icône visible à 22px (décalage de 4px)

### 10.3. Correction recommandée

**Uniformiser à 36×36** :
- `UserAvatar size={36}` au lieu de `size={32}`
- Garder `iconCircle` à 36×36
- Optionnel : Augmenter `MaterialIcons size={28}` pour meilleure proportion

**Résultat** :
- Avatar et iconCircle : Même taille (36×36)
- Avatar et iconCircle : Même position (16px du bord écran)
- Présence visuelle cohérente

---

**Fin du rapport d'audit**

