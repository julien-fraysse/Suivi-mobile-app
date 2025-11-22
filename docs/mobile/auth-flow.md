# Flux d'Authentification Mobile Suivi

## Introduction

L'application mobile Suivi utilise un système d'authentification basé sur **Bearer Token (JWT)** stocké de manière sécurisée dans `SecureStore` (expo-secure-store). L'état d'authentification est géré via un **React Context** (`AuthContext`) accessible via le hook `useAuth()`.

## Architecture de l'authentification

```
┌─────────────────────────────────────────────────────────┐
│              App.tsx (Root Entry)                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │         AuthProvider (Context Provider)            │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │         State Management                     │ │ │
│  │  │  • accessToken: string | null               │ │ │
│  │  │  • isLoading: boolean                       │ │ │
│  │  │  ┌────────────────────────────────────────┐ │ │ │
│  │  │  │    SecureStore (Token Storage)         │ │ │ │
│  │  │  │    Key: 'access_token'                 │ │ │ │
│  │  │  └────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │         Methods                              │ │ │
│  │  │  • signIn(email, password)                   │ │ │
│  │  │  • signOut()                                 │ │ │
│  │  │  • loadAccessToken() (auto au mount)        │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Composants du flux d'authentification

### 1. AuthProvider

**Fichier** : `/src/auth/AuthProvider.tsx`

**Rôle** : Provider React qui gère l'état d'authentification et expose les méthodes `signIn()` et `signOut()`.

**État géré** :
- `accessToken: string | null` : Token JWT de l'utilisateur (null si non connecté)
- `isLoading: boolean` : Indique si le token est en cours de chargement depuis SecureStore

**Méthodes** :
- `signIn(email: string, password: string): Promise<void>` : Connecte l'utilisateur
- `signOut(): Promise<void>` : Déconnecte l'utilisateur
- `loadAccessToken(): Promise<void>` : Charge le token depuis SecureStore (appelé automatiquement au mount)

**Stockage** :
- **SecureStore** (expo-secure-store) : Stockage sécurisé du token
- **Clé** : `'access_token'`

### 2. AuthContext

**Fichier** : `/src/auth/AuthContext.tsx`

**Rôle** : Définit le type `AuthContextValue` et le hook `useAuth()`.

**Type** :
```typescript
export type AuthContextValue = {
  accessToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
```

**Hook** :
```typescript
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. LoginScreen

**Fichier** : `/src/screens/LoginScreen.tsx`

**Rôle** : Écran de connexion où l'utilisateur saisit son email et son mot de passe.

**Comportement** :
1. Affiche deux champs : Email et Password
2. Bouton "Sign In" qui appelle `signIn(email, password)`
3. Gère les erreurs d'authentification
4. Affiche un état de chargement pendant la connexion

**Navigation** :
- **Succès** : `signIn()` met à jour `accessToken` → `RootNavigator` détecte le changement → Affiche automatiquement `AppNavigator`
- **Erreur** : Affiche un message d'erreur en rouge

## Flow d'authentification complet

### 1. Démarrage de l'app (App Launch)

```
App.tsx monte
    ↓
AuthProvider monte
    ↓
useEffect déclenche loadAccessToken()
    ↓
loadAccessToken() :
  1. setIsLoading(true)
  2. SecureStore.getItemAsync('access_token')
     ├─ Si token trouvé → setAccessToken(token)
     └─ Si pas de token → accessToken reste null
  3. setIsLoading(false)
    ↓
RootNavigator utilise useAuth()
    ↓
Si isLoading === true → Affiche LoadingIndicator
Si isLoading === false :
  ├─ Si !accessToken → Affiche AuthNavigator (LoginScreen)
  └─ Si accessToken → Affiche AppNavigator (MainTabNavigator)
```

### 2. Connexion (Sign In)

```
User saisit email/password dans LoginScreen
    ↓
User appuie sur "Sign In"
    ↓
handleSignIn() :
  1. Validation (email et password non vides)
  2. setIsLoading(true)
  3. setError(null)
    ↓
Appelle signIn(email, password) de AuthProvider
    ↓
AuthProvider.signIn() :
  1. ⚠️ ACTUELLEMENT MOCKÉ :
     const mockToken = `mock-token-${Date.now()}-${email}`;
  2. SecureStore.setItemAsync('access_token', mockToken)
  3. setAccessToken(mockToken)
    ↓
Context mis à jour (accessToken !== null)
    ↓
RootNavigator détecte le changement via useAuth()
    ↓
Affiche AppNavigator (MainTabNavigator)
    ↓
User est maintenant authentifié
```

### 3. Déconnexion (Sign Out)

```
User appuie sur "Sign Out" dans MoreScreen
    ↓
handleSignOut() appelle signOut() de AuthProvider
    ↓
AuthProvider.signOut() :
  1. SecureStore.deleteItemAsync('access_token')
  2. setAccessToken(null)
    ↓
Context mis à jour (accessToken === null)
    ↓
RootNavigator détecte le changement via useAuth()
    ↓
Affiche AuthNavigator (LoginScreen)
    ↓
User est maintenant déconnecté
```

### 4. Vérification du token (Token Check)

**Actuellement** : Pas de vérification automatique du token (pas de refresh token, pas d'expiration vérifiée).

**Futur** : 
- Vérifier l'expiration du token
- Appeler `/api/auth/refresh` si le token est expiré
- Déconnecter automatiquement si le refresh échoue

## Points de branchement pour l'API Suivi

### 1. Sign In (`/src/auth/AuthProvider.tsx`)

**Actuel (Mock)** :
```typescript
async function signIn(email: string, password: string): Promise<void> {
  // TODO: Replace with real API call
  const mockToken = `mock-token-${Date.now()}-${email}`;
  
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, mockToken);
    setAccessToken(mockToken);
  } catch (error) {
    console.error('Error saving access token:', error);
    throw error;
  }
}
```

**Futur (API réelle)** :
```typescript
async function signIn(email: string, password: string): Promise<void> {
  try {
    // Appel à l'API Suivi
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to sign in');
    }

    const data = await response.json();
    const { accessToken, refreshToken } = data; // À confirmer côté backend Suivi

    // Sauvegarder les tokens
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }

    setAccessToken(accessToken);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}
```

**Endpoint attendu** :
- **Méthode** : `POST`
- **URL** : `/api/auth/login` ou `/auth/login` (à confirmer)
- **Body** : 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Réponse attendue** :
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..." // Optionnel
  }
  ```

### 2. Sign Out (`/src/auth/AuthProvider.tsx`)

**Actuel** :
```typescript
async function signOut(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    setAccessToken(null);
  } catch (error) {
    console.error('Error deleting access token:', error);
    throw error;
  }
}
```

**Futur (si l'API nécessite une invalidations côté serveur)** :
```typescript
async function signOut(): Promise<void> {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    
    // Optionnel : Appeler l'API pour invalider le token côté serveur
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        // Log l'erreur mais continue la déconnexion locale
        console.warn('Error calling logout API:', error);
      }
    }

    // Supprimer les tokens localement
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setAccessToken(null);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
```

**Endpoint optionnel** :
- **Méthode** : `POST`
- **URL** : `/api/auth/logout` (à confirmer si nécessaire)
- **Headers** : `Authorization: Bearer <token>`

### 3. Refresh Token (À implémenter)

**Fichier** : `/src/auth/AuthProvider.tsx` (nouvelle méthode)

**Rôle** : Rafraîchir le token d'accès si celui-ci est expiré.

```typescript
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh token invalide → déconnecter
      await signOut();
      return null;
    }

    const data = await response.json();
    const { accessToken, refreshToken: newRefreshToken } = data;

    // Mettre à jour les tokens
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (newRefreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
    }

    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await signOut();
    return null;
  }
}
```

**Endpoint attendu** :
- **Méthode** : `POST`
- **URL** : `/api/auth/refresh` (à confirmer)
- **Body** :
  ```json
  {
    "refreshToken": "..."
  }
  ```
- **Réponse attendue** :
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..." // Optionnel (rotation de refresh token)
  }
  ```

### 4. Get Current User (À implémenter)

**Fichier** : `/src/api/auth.ts` (nouveau fichier)

**Rôle** : Récupérer les informations de l'utilisateur connecté.

```typescript
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  // ... autres champs à confirmer côté backend
};

export async function getCurrentUser(
  accessToken: string,
): Promise<User> {
  const path = '/me';
  return apiFetch<User>(path, {}, accessToken);
}
```

**Endpoint attendu** :
- **Méthode** : `GET`
- **URL** : `/api/me` ou `/me` (à confirmer)
- **Headers** : `Authorization: Bearer <token>`
- **Réponse attendue** :
  ```json
  {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://..."
  }
  ```

## Intégration avec l'API Client

**Fichier** : `/src/api/client.ts`

L'API client ajoute automatiquement le token d'authentification dans les headers :

```typescript
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // ... reste du code
}
```

**Utilisation** :
```typescript
import { useAuth } from '../auth';
import { getMyTasks } from '../api/tasks';

const { accessToken } = useAuth();
const tasks = await getMyTasks(accessToken, { page: 1 });
```

## Gestion des erreurs d'authentification

### 1. Erreur de connexion

**Dans LoginScreen** :
```typescript
try {
  await signIn(email.trim(), password);
} catch (err) {
  setError(String(err) || 'Failed to sign in');
}
```

**À améliorer** :
- Parser les erreurs HTTP (401, 403, etc.)
- Afficher des messages d'erreur spécifiques (email invalide, mot de passe incorrect, etc.)

### 2. Token expiré

**Actuellement** : Pas de gestion automatique.

**Futur** :
- Intercepter les réponses 401 dans `apiFetch()`
- Appeler `refreshAccessToken()` automatiquement
- Si le refresh échoue → Déconnecter l'utilisateur

**Exemple** :
```typescript
// Dans apiFetch()
if (response.status === 401) {
  // Token expiré → essayer de rafraîchir
  const newToken = await refreshAccessToken();
  if (newToken) {
    // Retry la requête avec le nouveau token
    return apiFetch<T>(path, { ...init, headers: { ...headers, Authorization: `Bearer ${newToken}` } }, newToken);
  } else {
    // Refresh échoué → déconnecter
    throw new Error('Session expired');
  }
}
```

## Sécurité

### 1. Stockage sécurisé

- **SecureStore** : Stockage sécurisé du token (chiffré sur iOS/Android)
- **Clé unique** : `'access_token'` pour éviter les collisions

### 2. Transmission sécurisée

- **HTTPS** : Tous les appels API doivent utiliser HTTPS (à confirmer côté backend)
- **Headers** : Token transmis dans `Authorization: Bearer <token>`

### 3. Expiration du token

**À implémenter** :
- Décoder le JWT pour vérifier l'expiration (`exp`)
- Rafraîchir automatiquement si proche de l'expiration
- Déconnecter si le refresh échoue

## Tests

### Tests à effectuer

1. **Connexion réussie** : Email/password valides → Token sauvegardé → Navigation vers l'app
2. **Connexion échouée** : Email/password invalides → Message d'erreur affiché
3. **Déconnexion** : Token supprimé → Navigation vers LoginScreen
4. **Chargement du token au démarrage** : Token existant → Navigation automatique vers l'app
5. **Token expiré** : Token invalide → Rafraîchissement automatique ou déconnexion







