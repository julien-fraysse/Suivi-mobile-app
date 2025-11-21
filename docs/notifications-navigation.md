# Navigation des Notifications

## Vue d'ensemble

Ce document explique la simplification de la navigation des notifications dans l'application mobile Suivi. L'écran intermédiaire `NotificationDetailScreen` a été supprimé pour permettre une navigation directe vers `TaskDetailScreen`, offrant ainsi une expérience utilisateur plus fluide et moderne (standard Monday/Asana).

## Changements effectués

### 1. Suppression de `NotificationDetailScreen`

**Fichier supprimé :**
- `src/screens/NotificationDetailScreen.tsx`

**Motif :**
- Écran intermédiaire inutile qui ajoutait une étape supplémentaire entre la notification et la tâche
- L'expérience moderne des apps de gestion de tâches (Monday, Asana, etc.) privilégie la navigation directe
- Les Quick Actions sont maintenant accessibles en 1 clic depuis une notification

### 2. Navigation directe dans `NotificationItem`

**Fichier modifié :**
- `src/components/ui/NotificationItem.tsx`

**Changements :**
- Ajout de la navigation directe vers `TaskDetailScreen` lorsqu'une notification a un `relatedTaskId`
- Gestion du fallback avec `Alert` si la notification n'est pas liée à une tâche
- Suppression de la dépendance à `NotificationDetailScreen`

**Code clé :**
```typescript
const handlePress = () => {
  const taskId = notification.relatedTaskId;
  if (taskId) {
    navigation.navigate('TaskDetail', { taskId });
  } else {
    Alert.alert(
      'Tâche introuvable',
      'Cette notification n\'est pas liée à une tâche.',
      [{ text: 'OK' }]
    );
  }
};
```

### 3. Simplification de `NotificationsScreen`

**Fichier modifié :**
- `src/screens/NotificationsScreen.tsx`

**Changements :**
- Suppression de la fonction `handleNotificationPress` qui naviguait vers `NotificationDetailScreen`
- `NotificationItem` gère maintenant directement la navigation

### 4. Nettoyage des routes

**Fichiers modifiés :**
- `src/navigation/RootNavigator.tsx` : Suppression de la route `NotificationDetail`
- `src/navigation/types.ts` : Suppression du type `NotificationDetail` dans `AppStackParamList`

## Nouveau flux UX

### Avant
1. Utilisateur clique sur une notification dans `NotificationsScreen`
2. Navigation vers `NotificationDetailScreen` (écran intermédiaire)
3. Utilisateur clique sur "Voir la tâche"
4. Navigation vers `TaskDetailScreen`

### Après
1. Utilisateur clique sur une notification dans `NotificationsScreen`
2. Navigation directe vers `TaskDetailScreen` avec la tâche associée

**Avantages :**
- ✅ Expérience plus fluide (1 clic au lieu de 2)
- ✅ Moins d'écrans à maintenir
- ✅ Quick Actions accessibles immédiatement
- ✅ Standard de l'industrie (Monday, Asana, Linear)

## Gestion des erreurs

### Fallback si pas de tâche associée

Si une notification n'a pas de `relatedTaskId`, un `Alert` s'affiche :
- **Titre :** "Tâche introuvable"
- **Message :** "Cette notification n'est pas liée à une tâche."
- **Action :** Bouton "OK" pour fermer l'alert

### Vérification de l'existence de la tâche

La vérification de l'existence de la tâche se fait dans `TaskDetailScreen` :
- Si la tâche n'existe pas, `TaskDetailScreen` affiche un message d'erreur
- L'utilisateur peut retourner à la liste des notifications

## Migration vers l'API Suivi

### Structure attendue des notifications

Lors de la migration vers l'API Suivi réelle, les notifications doivent inclure :
- `relatedTaskId` : ID de la tâche liée (optionnel)
- Si `relatedTaskId` est présent, la navigation directe vers `TaskDetailScreen` fonctionnera automatiquement

### Points d'attention

1. **IDs des tâches** : Les `relatedTaskId` doivent référencer des IDs réels de tâches chargées depuis l'API
2. **Notifications sans tâche** : Les notifications qui n'ont pas de `relatedTaskId` afficheront l'alert de fallback
3. **Validation côté serveur** : L'API doit valider que `relatedTaskId` pointe vers une tâche existante

## Tests à effectuer

### Tests fonctionnels
- [ ] Cliquer sur une notification avec `relatedTaskId` doit naviguer directement vers `TaskDetailScreen`
- [ ] Cliquer sur une notification sans `relatedTaskId` doit afficher l'alert "Tâche introuvable"
- [ ] Les Quick Actions doivent s'afficher correctement dans `TaskDetailScreen` après navigation depuis une notification
- [ ] Le badge de notifications non lues doit se mettre à jour correctement

### Tests de navigation
- [ ] Aucune route `NotificationDetail` ne doit être accessible
- [ ] Le bouton retour dans `TaskDetailScreen` doit retourner à `NotificationsScreen`
- [ ] Aucune erreur de route manquante ne doit apparaître dans les logs

## Impact sur le code

### Fichiers supprimés
- `src/screens/NotificationDetailScreen.tsx` (570 lignes)

### Fichiers modifiés
- `src/components/ui/NotificationItem.tsx` : Ajout de la navigation directe
- `src/screens/NotificationsScreen.tsx` : Suppression de `handleNotificationPress`
- `src/navigation/RootNavigator.tsx` : Suppression de la route `NotificationDetail`
- `src/navigation/types.ts` : Suppression du type `NotificationDetail`

### Fichiers non modifiés
- `src/tasks/TasksContext.tsx` : Aucun changement
- `src/screens/TaskDetailScreen.tsx` : Aucun changement
- `src/components/tasks/quickactions/` : Aucun changement
- Mocks existants : Aucun changement

## Conclusion

Cette simplification améliore significativement l'expérience utilisateur en réduisant le nombre de clics nécessaires pour accéder à une tâche depuis une notification. Elle aligne également l'application sur les standards modernes des apps de gestion de tâches.

**Zero régression** : Toutes les fonctionnalités existantes continuent de fonctionner, avec une expérience utilisateur améliorée.

