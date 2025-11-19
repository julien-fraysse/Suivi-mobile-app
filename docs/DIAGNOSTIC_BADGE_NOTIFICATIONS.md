# 🔍 Diagnostic : Badge Notifications ne se met pas à jour

**Date** : 2024-11-16  
**Problème** : Le badge de notifications dans la bottom bar ne met pas à jour son compteur lorsque l'utilisateur lit une notification.

---

## 1. Navigation (MainTabNavigator.tsx)

### Fichier concerné
- `src/navigation/MainTabNavigator.tsx` (lignes 32-38, 87-112)

### Extrait de code
```typescript
export function MainTabNavigator() {
  const theme = useTheme();
  const isDark = theme.dark;
  
  // Calculer le nombre de notifications non lues pour le badge
  const { notifications } = useNotificationsStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size = 24 }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="bell" size={size} color={color} />
              {unreadCount > 0 && (
                <View style={[styles.badge, ...]}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

### Problème identifié
**OUI - PROBLÈME CRITIQUE**

1. **État isolé** : `useNotificationsStore()` est appelé dans `MainTabNavigator`, mais chaque appel à ce hook crée un **état local isolé** (voir section 3).

2. **tabBarIcon dans options statique** : Le `tabBarIcon` est défini dans l'objet `options` qui est évalué une seule fois lors du montage. Même si `unreadCount` change, React Navigation peut ne pas re-render automatiquement le `tabBarIcon` car il n'est pas dans une fonction dynamique.

### Cause possible
- Le hook `useNotificationsStore()` utilise `useState` local, donc `MainTabNavigator` et `NotificationsScreen` ont des états séparés.
- Quand `markAsRead` est appelé dans `NotificationsScreen`, il met à jour l'état de `NotificationsScreen`, mais **pas celui de `MainTabNavigator`**.
- Même si l'état était partagé, React Navigation peut ne pas détecter le changement car `options` est statique.

### Recommandation technique
1. **Convertir `useNotificationsStore` en Context Provider** pour partager l'état entre tous les composants.
2. **Utiliser `useMemo` ou `useCallback` pour `tabBarIcon`** avec dépendances sur `unreadCount`.
3. **Alternative** : Utiliser `React.memo` ou forcer le re-render via `key` sur `Tab.Navigator`.

---

## 2. Providers (App.tsx)

### Fichier concerné
- `src/App.tsx` (lignes 103-154)

### Extrait de code
```typescript
export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <SettingsProvider>
              <ThemeProvider initialMode="auto">
                <AuthProvider>
                  <TasksProvider>
                    <AppContent /> {/* Contient NavigationContainer */}
                  </TasksProvider>
                </AuthProvider>
              </ThemeProvider>
            </SettingsProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
```

### Problème identifié
**OUI - PROBLÈME CRITIQUE**

**Aucun NotificationsProvider n'existe** dans la hiérarchie des providers. Le `NavigationContainer` est bien inclus dans `AppContent`, mais il n'y a pas de provider global pour les notifications.

### Cause possible
- `useNotificationsStore()` est un hook local avec `useState`, donc chaque composant qui l'appelle obtient son propre état isolé.
- Il n'y a pas de Context Provider pour partager l'état des notifications entre `MainTabNavigator` et `NotificationsScreen`.

### Recommandation technique
1. **Créer un `NotificationsProvider`** qui wrap l'application et expose un Context avec l'état partagé.
2. **Déplacer la logique `useState` dans le Provider** pour que tous les composants partagent le même état.
3. **Wrapper `MainTabNavigator` et `NotificationsScreen`** avec ce Provider.

---

## 3. Hook useNotificationsStore

### Fichier concerné
- `src/features/notifications/notificationsStore.ts` (lignes 189-230)

### Extrait de code
```typescript
export function useNotificationsStore() {
  // MOCK ONLY: In-memory state for notifications
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
  };
}
```

### Problème identifié
**OUI - PROBLÈME CRITIQUE**

**Chaque appel à `useNotificationsStore()` crée un état local isolé** via `useState`. Cela signifie :
- `MainTabNavigator` appelle `useNotificationsStore()` → obtient un état A
- `NotificationsScreen` appelle `useNotificationsStore()` → obtient un état B (différent)
- Quand `markAsRead` est appelé dans `NotificationsScreen`, il met à jour l'état B, mais l'état A de `MainTabNavigator` reste inchangé.

### Cause possible
- `useState` dans un hook personnalisé crée un état local à chaque instance du composant.
- Il n'y a pas de mécanisme de partage d'état (Context, Redux, Zustand, etc.).

### Recommandation technique
1. **Convertir en Context Provider** :
   ```typescript
   const NotificationsContext = createContext<NotificationsContextValue | null>(null);
   
   export function NotificationsProvider({ children }) {
     const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
     // ... logique markAsRead
     return (
       <NotificationsContext.Provider value={{ notifications, markAsRead, markAllAsRead }}>
         {children}
       </NotificationsContext.Provider>
     );
   }
   
   export function useNotificationsStore() {
     const context = useContext(NotificationsContext);
     if (!context) throw new Error('useNotificationsStore must be used within NotificationsProvider');
     return context;
   }
   ```

2. **Alternative : Utiliser Zustand ou Redux** pour un state management global.

---

## 4. Dataset (notificationsStore.ts)

### Fichier concerné
- `src/features/notifications/notificationsStore.ts` (lignes 203-222)

### Extrait de code
```typescript
const markAsRead = useCallback((id: string) => {
  setNotifications((prev) =>
    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}, []);

const markAllAsRead = useCallback(() => {
  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
}, []);
```

### Problème identifié
**NON - Aucun problème**

La logique `markAsRead` est **correcte** :
- Utilise une fonction updater `(prev) => ...` pour garantir l'immutabilité.
- Crée un nouveau tableau avec `map()`.
- Met à jour correctement la propriété `read: true`.

### Cause possible
Aucune - la logique est correcte.

### Recommandation technique
Aucune modification nécessaire pour cette partie.

---

## 5. Rerendering (tabBarIcon)

### Fichier concerné
- `src/navigation/MainTabNavigator.tsx` (lignes 90-111)

### Extrait de code
```typescript
<Tab.Screen
  name="Notifications"
  component={NotificationsScreen}
  options={{
    tabBarLabel: 'Notifications',
    tabBarIcon: ({ color, size = 24 }) => (
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="bell" size={size} color={color} />
        {unreadCount > 0 && (
          <View style={[styles.badge, ...]}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    ),
  }}
/>
```

### Problème identifié
**OUI - PROBLÈME POTENTIEL**

1. **`unreadCount` est capturé dans la closure** : Même si l'état était partagé, `unreadCount` est calculé une fois lors du render initial et peut être "figé" dans la closure de `tabBarIcon`.

2. **React Navigation peut ne pas re-render `tabBarIcon`** : React Navigation optimise les re-renders et peut ne pas détecter que `unreadCount` a changé si l'objet `options` n'est pas recréé.

### Cause possible
- La fonction `tabBarIcon` capture `unreadCount` dans sa closure au moment de la création de `options`.
- React Navigation peut mettre en cache `options` et ne pas re-render le `tabBarIcon` même si `MainTabNavigator` re-render.

### Recommandation technique
1. **Utiliser une fonction dynamique pour `options`** :
   ```typescript
   <Tab.Screen
     name="Notifications"
     component={NotificationsScreen}
     options={({ route }) => ({
       tabBarLabel: 'Notifications',
       tabBarIcon: ({ color, size = 24 }) => {
         const { notifications } = useNotificationsStore();
         const unreadCount = notifications.filter(n => !n.read).length;
         return (
           <View style={styles.iconContainer}>
             <MaterialCommunityIcons name="bell" size={size} color={color} />
             {unreadCount > 0 && (
               <View style={[styles.badge, ...]}>
                 <Text style={styles.badgeText}>{unreadCount}</Text>
               </View>
             )}
           </View>
         );
       },
     })}
   />
   ```

2. **Alternative : Utiliser `useMemo` pour recréer `options` quand `unreadCount` change** :
   ```typescript
   const notificationsOptions = useMemo(() => ({
     tabBarLabel: 'Notifications',
     tabBarIcon: ({ color, size = 24 }) => (
       <View style={styles.iconContainer}>
         <MaterialCommunityIcons name="bell" size={size} color={color} />
         {unreadCount > 0 && (
           <View style={[styles.badge, ...]}>
             <Text style={styles.badgeText}>{unreadCount}</Text>
           </View>
         )}
       </View>
     ),
   }), [unreadCount]);
   ```

---

## 📊 Résumé du diagnostic

### Cause la plus probable

**PROBLÈME PRINCIPAL : État isolé par composant**

Le hook `useNotificationsStore()` utilise `useState` local, ce qui crée un état isolé pour chaque composant qui l'appelle. Quand `MainTabNavigator` et `NotificationsScreen` appellent tous les deux `useNotificationsStore()`, ils obtiennent des états différents. Quand `markAsRead` est appelé dans `NotificationsScreen`, il met à jour l'état de `NotificationsScreen`, mais l'état de `MainTabNavigator` reste inchangé, donc le badge ne se met pas à jour.

### Solutions envisageables

#### Solution 1 : Context Provider (RECOMMANDÉ)
**Avantages** :
- Partage d'état garanti entre tous les composants
- Pattern React standard et maintenable
- Compatible avec l'architecture actuelle

**Implémentation** :
1. Créer `NotificationsProvider` avec Context API
2. Déplacer `useState` dans le Provider
3. Wrapper l'app avec `NotificationsProvider` dans `App.tsx`
4. Modifier `useNotificationsStore()` pour utiliser `useContext`

**Complexité** : Moyenne  
**Risque** : Faible

#### Solution 2 : Zustand (State Management léger)
**Avantages** :
- State management global simple
- Pas besoin de Provider
- Performance optimale

**Implémentation** :
1. Installer Zustand
2. Créer un store Zustand pour les notifications
3. Remplacer `useNotificationsStore()` par le store Zustand

**Complexité** : Faible  
**Risque** : Faible (mais ajoute une dépendance)

#### Solution 3 : React Query (si API backend disponible)
**Avantages** :
- Cache et synchronisation automatiques
- Gestion des erreurs et loading states
- Optimisé pour les données serveur

**Implémentation** :
1. Utiliser le hook `useNotifications` existant (déjà présent dans `src/hooks/useNotifications.ts`)
2. Remplacer `useNotificationsStore()` par `useNotifications()` dans tous les composants

**Complexité** : Faible (hook déjà existant)  
**Risque** : Faible (mais nécessite un backend)

### Recommandation finale

**Solution 1 (Context Provider)** est la meilleure option car :
- Pas de dépendance externe supplémentaire
- Pattern React standard
- Compatible avec l'architecture actuelle
- Facile à migrer vers une API backend plus tard

### Fichiers à modifier

1. `src/features/notifications/notificationsStore.ts` → Convertir en Context Provider
2. `src/App.tsx` → Ajouter `NotificationsProvider` dans la hiérarchie
3. `src/navigation/MainTabNavigator.tsx` → Optionnel : utiliser `useMemo` pour `options` si nécessaire

---

**Diagnostic terminé - Prêt pour implémentation**

