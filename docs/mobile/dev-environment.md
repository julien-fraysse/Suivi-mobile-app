# Environnement de développement Mobile Suivi

## Introduction

Ce document explique comment configurer et lancer l'application mobile Suivi en environnement de développement.

## Prérequis

### Outils nécessaires

| Outil | Version minimale | Lien |
|-------|------------------|------|
| **Node.js** | 18.0.0 ou supérieur | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 ou supérieur | Inclus avec Node.js |
| **Expo CLI** | 6.0.0 ou supérieur | Installé via npm |
| **Git** | 2.30.0 ou supérieur | [git-scm.com](https://git-scm.com/) |

### Pour iOS (macOS uniquement)

| Outil | Version minimale | Lien |
|-------|------------------|------|
| **Xcode** | 14.0 ou supérieur | [developer.apple.com](https://developer.apple.com/xcode/) |
| **CocoaPods** | 1.11.0 ou supérieur | [cocoapods.org](https://cocoapods.org/) |
| **Simulateur iOS** | Inclus avec Xcode | |

### Pour Android

| Outil | Version minimale | Lien |
|-------|------------------|------|
| **Android Studio** | Arctic Fox ou supérieur | [developer.android.com](https://developer.android.com/studio) |
| **Java JDK** | 17 ou supérieur | [adoptium.net](https://adoptium.net/) |
| **Emulateur Android** | Inclus avec Android Studio | |

### Pour tester sur appareil physique

| Plateforme | Application |
|-----------|-------------|
| **iOS** | Expo Go (App Store) |
| **Android** | Expo Go (Google Play) |

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/julien-fraysse/Suivi-mobile-app.git
cd Suivi-mobile-app
```

### 2. Installer les dépendances

```bash
npm install
```

**Durée estimée** : 2-5 minutes (selon la connexion)

### 3. Installer Expo CLI globalement (optionnel)

```bash
npm install -g expo-cli
```

**Note** : Expo CLI peut aussi être exécuté via `npx` sans installation globale.

## Commandes principales

### Démarrer l'application en mode développement

```bash
npm start
```

ou

```bash
npx expo start
```

**Comportement** :
- Lance le serveur Metro Bundler sur le port 8081 (par défaut)
- Affiche un QR code dans le terminal
- Ouvre Expo DevTools dans le navigateur (optionnel)

### Lancer avec cache vidé

```bash
npm start -- --clear
```

ou

```bash
npx expo start --clear
```

**Quand l'utiliser** :
- Après avoir modifié `metro.config.js`
- Après avoir installé de nouvelles dépendances natives
- En cas d'erreurs inexpliquées liées au cache

### Lancer sur iOS (macOS uniquement)

```bash
npm run ios
```

ou

```bash
npx expo start --ios
```

**Comportement** :
- Ouvre le simulateur iOS automatiquement
- Installe et lance l'app sur le simulateur

### Lancer sur Android

```bash
npm run android
```

ou

```bash
npx expo start --android
```

**Prérequis** :
- Android Studio installé et configuré
- Un émulateur Android lancé ou un appareil physique connecté via USB avec le mode développeur activé

**Comportement** :
- Ouvre l'émulateur Android automatiquement (si aucun appareil n'est connecté)
- Installe et lance l'app sur l'émulateur/appareil

### Lancer sur Web

```bash
npm run web
```

ou

```bash
npx expo start --web
```

**Comportement** :
- Ouvre l'app dans le navigateur (Chrome, Firefox, Safari, etc.)

### Lancer sur un port spécifique

```bash
npx expo start --port 8082
```

**Quand l'utiliser** :
- Si le port 8081 est déjà utilisé
- Pour lancer plusieurs instances en parallèle

## Utilisation d'Expo Go

### Sur iOS

1. Installer **Expo Go** depuis l'App Store sur votre iPhone/iPad
2. Lancer `npm start` dans le terminal
3. Scanner le QR code affiché dans le terminal avec l'appareil photo iOS
4. L'app s'ouvre automatiquement dans Expo Go

**Note** : L'iPhone et le Mac doivent être sur le même réseau Wi-Fi.

### Sur Android

1. Installer **Expo Go** depuis le Google Play Store sur votre téléphone/tablette
2. Lancer `npm start` dans le terminal
3. Scanner le QR code affiché dans le terminal avec l'app Expo Go
4. L'app s'ouvre automatiquement dans Expo Go

**Note** : L'appareil Android et l'ordinateur doivent être sur le même réseau Wi-Fi.

### Dépannage Expo Go

**Problème** : "Could not connect to server exp://192.168.x.x:8081"

**Solutions** :
1. Vérifier que l'appareil et l'ordinateur sont sur le même réseau Wi-Fi
2. Vérifier que le firewall ne bloque pas le port 8081
3. Utiliser le mode tunnel (plus lent mais fonctionne hors réseau local) :
   ```bash
   npx expo start --tunnel
   ```

## Commandes de nettoyage

### Vider le cache Metro

```bash
npx expo start --clear
```

**Quand l'utiliser** :
- Après avoir modifié `metro.config.js`
- En cas d'erreurs liées au cache

### Nettoyer les node_modules

```bash
rm -rf node_modules
npm install
```

**Quand l'utiliser** :
- Après avoir modifié `package.json`
- En cas d'erreurs liées aux dépendances

### Nettoyer le cache npm

```bash
npm cache clean --force
```

**Quand l'utiliser** :
- En cas de problèmes d'installation de dépendances

### Reset Metro Bundler

```bash
npx expo start --clear --reset-cache
```

**Quand l'utiliser** :
- En cas d'erreurs persistantes après avoir vidé le cache

## Variables d'environnement

### Configuration actuelle

**Actuellement** : Aucun fichier `.env` n'est utilisé.

**Base URL API** : Hardcodée dans `/src/api/client.ts` :
```typescript
export const API_BASE_URL = 'https://api.suivi.local'; // TODO: replace with real backend URL
```

### Configuration future (recommandée)

**Créer un fichier `.env`** :
```bash
# .env
API_BASE_URL=https://api-dev.suivi.com
```

**Installer `expo-constants`** (déjà installé) :
```bash
npm install expo-constants
```

**Modifier `/src/api/client.ts`** :
```typescript
import Constants from 'expo-constants';

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.suivi.local';
```

**Modifier `app.json`** :
```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.API_BASE_URL || "https://api.suivi.local"
    }
  }
}
```

### Fichiers d'environnement recommandés

- `.env` : Variables communes (ne pas commiter)
- `.env.development` : Variables pour le développement local
- `.env.staging` : Variables pour le staging
- `.env.production` : Variables pour la production

**Note** : Ajouter `.env*` à `.gitignore` pour ne pas commiter les variables sensibles.

## Configuration spécifique

### iOS Simulator

**Choisir un simulateur spécifique** :
```bash
npx expo start --ios --simulator="iPhone 14 Pro"
```

**Lister les simulateurs disponibles** :
```bash
xcrun simctl list devices available
```

### Android Emulator

**Choisir un émulateur spécifique** :
```bash
npx expo start --android --device="Pixel_5_API_33"
```

**Lister les appareils/émulateurs disponibles** :
```bash
adb devices
```

### Appareils physiques

**iOS** :
- Connecter l'iPhone/iPad via USB
- Autoriser le développeur sur l'appareil (Settings > General > VPN & Device Management)
- Lancer `npx expo start --ios`

**Android** :
- Activer le mode développeur (Settings > About phone > Tap 7 times sur "Build number")
- Activer le débogage USB (Settings > Developer options > USB debugging)
- Connecter via USB
- Lancer `npx expo start --android`

## Hot Reload et Fast Refresh

**Expo Fast Refresh** : Activé par défaut.

**Fonctionnalités** :
- Modification d'un fichier → Rechargement automatique de l'app
- Préservation de l'état React (state, hooks, etc.)
- Rechargement instantané sans perte de contexte

**Désactiver temporairement** :
- Shake l'appareil (physique) ou `Cmd+D` (iOS Simulator) / `Cmd+M` (Android Emulator)
- Taper `r` dans le terminal Expo pour recharger manuellement

## Débogage

### React Native Debugger

**Installer** :
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger) (standalone app)

**Utiliser** :
1. Lancer `npm start`
2. Ouvrir React Native Debugger
3. Shake l'appareil (physique) ou `Cmd+D` (iOS Simulator) / `Cmd+M` (Android Emulator)
4. Sélectionner "Debug"

### Console logs

**Dans le code** :
```typescript
console.log('Debug message:', value);
console.error('Error:', error);
console.warn('Warning:', message);
```

**Voir les logs** :
- Terminal Expo : Logs Metro Bundler
- Terminal Metro : `npx expo start` → Logs de l'app
- React Native Debugger : Console du navigateur

### Chrome DevTools

**Accéder** :
1. Lancer `npm start`
2. Shake l'appareil (physique) ou `Cmd+D` (iOS Simulator) / `Cmd+M` (Android Emulator)
3. Sélectionner "Debug"
4. Ouvrir Chrome DevTools (inspecteur)

**Fonctionnalités** :
- Console JavaScript
- Network inspector
- React DevTools (si installé)

### React DevTools

**Installer** :
```bash
npm install -g react-devtools
```

**Utiliser** :
```bash
react-devtools
```

**Fonctionnalités** :
- Inspecter le tree React
- Voir les props et state des composants
- Profiler les performances

## Build et distribution

### Build de développement

**iOS** :
```bash
npx expo build:ios
```

**Android** :
```bash
npx expo build:android
```

### Build de production

**iOS** :
```bash
npx expo build:ios --release-channel production
```

**Android** :
```bash
npx expo build:android --release-channel production
```

**Note** : Nécessite un compte Expo et une configuration appropriée.

### Prévisualisation (EAS Build)

**Installer EAS CLI** :
```bash
npm install -g eas-cli
```

**Configurer** :
```bash
eas build:configure
```

**Build** :
```bash
eas build --platform ios
eas build --platform android
```

## Dépannage

### Problème : "Metro Bundler failed to start"

**Solutions** :
1. Vérifier que le port 8081 n'est pas utilisé :
   ```bash
   lsof -i :8081
   kill -9 <PID>
   ```
2. Vider le cache :
   ```bash
   npx expo start --clear
   ```
3. Réinstaller les dépendances :
   ```bash
   rm -rf node_modules
   npm install
   ```

### Problème : "Could not connect to Metro"

**Solutions** :
1. Vérifier la connexion réseau (même Wi-Fi pour Expo Go)
2. Utiliser le mode tunnel :
   ```bash
   npx expo start --tunnel
   ```
3. Redémarrer Metro :
   ```bash
   npx expo start --clear
   ```

### Problème : "Module not found"

**Solutions** :
1. Réinstaller les dépendances :
   ```bash
   npm install
   ```
2. Vider le cache Metro :
   ```bash
   npx expo start --clear
   ```
3. Vérifier les imports dans le code

### Problème : "TypeScript errors"

**Solutions** :
1. Vérifier la configuration TypeScript :
   ```bash
   npx tsc --noEmit
   ```
2. Vérifier les types dans le code
3. Redémarrer TypeScript server (VS Code : `Cmd+Shift+P` → "TypeScript: Restart TS Server")

### Problème : "iOS Simulator ne démarre pas"

**Solutions** :
1. Vérifier que Xcode est installé :
   ```bash
   xcode-select --print-path
   ```
2. Ouvrir Xcode et accepter les licences
3. Ouvrir manuellement le simulateur :
   ```bash
   open -a Simulator
   ```

### Problème : "Android Emulator ne démarre pas"

**Solutions** :
1. Vérifier qu'Android Studio est installé
2. Ouvrir Android Studio → AVD Manager
3. Créer/lancer un émulateur manuellement
4. Vérifier qu'Android SDK est configuré :
   ```bash
   echo $ANDROID_HOME
   ```

## Bonnes pratiques

### 1. Utiliser Git

**Commits fréquents** :
```bash
git add .
git commit -m "feat: add new feature"
git push
```

### 2. Branches Git

**Workflow recommandé** :
- `main` : Branche principale (production-ready)
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `fix/*` : Corrections de bugs

### 3. Tests avant commit

**Vérifier** :
1. L'app démarre sans erreur
2. Pas d'erreurs TypeScript :
   ```bash
   npx tsc --noEmit
   ```
3. Pas d'erreurs ESLint (si configuré) :
   ```bash
   npm run lint
   ```

### 4. Performance

**Optimisations** :
- Utiliser `React.memo` pour les composants coûteux
- Utiliser `useMemo` et `useCallback` pour éviter les re-renders
- Profiler avec React DevTools

### 5. Sécurité

**Bonnes pratiques** :
- Ne jamais commiter les tokens/secrets
- Utiliser `.env` pour les variables d'environnement sensibles
- Ajouter `.env*` à `.gitignore`

## Ressources supplémentaires

### Documentation officielle

- **Expo** : [docs.expo.dev](https://docs.expo.dev/)
- **React Native** : [reactnative.dev](https://reactnative.dev/)
- **React Navigation** : [reactnavigation.org](https://reactnavigation.org/)
- **React Query** : [tanstack.com/query](https://tanstack.com/query/latest)

### Communauté

- **Expo Discord** : [discord.gg/expo](https://discord.gg/expo)
- **React Native Community** : [reactnative.dev/community](https://reactnative.dev/community/overview)

## Checklist de démarrage

- [ ] Node.js installé (v18+)
- [ ] npm installé (v9+)
- [ ] Projet cloné
- [ ] Dépendances installées (`npm install`)
- [ ] App démarre (`npm start`)
- [ ] Expo Go installé sur appareil (si test physique)
- [ ] Simulateur/émulateur configuré (si test virtuel)
- [ ] App s'affiche correctement
- [ ] Hot reload fonctionne






