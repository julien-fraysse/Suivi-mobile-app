# Tableau d'analyse - Migration components/ et assets/

## 1. Dossier `components/ui/` (racine)

| Fichier racine | Fichier src/ | Statut | Action |
|---|---|---|---|
| `components/ui/SuiviLogo.tsx` | `src/components/ui/SuiviLogo.tsx` | **DUPLICATE** | ✅ Déjà migré dans src/. Supprimer version racine. |
| `components/ui/SuiviButton.tsx` | `src/components/ui/SuiviButton.tsx` | **DUPLICATE** | Version src/ utilisée (TouchableOpacity). Supprimer version racine (Button de paper). |
| `components/ui/SuiviCard.tsx` | `src/components/ui/SuiviCard.tsx` | **DUPLICATE** | Version src/ utilisée (View + TouchableOpacity). Supprimer version racine (Card de paper). |
| `components/ui/SuiviText.tsx` | `src/components/ui/SuiviText.tsx` | **DUPLICATE** | Version src/ utilisée. Supprimer version racine. |
| `components/ui/SuiviAppBar.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviAvatar.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviChip.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviDivider.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviListItem.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviSurface.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/SuiviTextInput.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/ui/index.ts` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |

## 2. Dossier `components/media/` (racine)

| Fichier racine | Fichier src/ | Statut | Action |
|---|---|---|---|
| `components/media/SuiviLogoFull.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/media/SuiviLogoHorizontal.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/media/SuiviLogoIcon.tsx` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |
| `components/media/index.ts` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |

## 3. Dossier `components/layout/` (racine)

| Fichier racine | Fichier src/ | Statut | Action |
|---|---|---|---|
| `components/layout/ScreenContainer.tsx` | `src/components/layout/ScreenContainer.tsx` | **DUPLICATE** | ✅ Déjà migré dans src/. Supprimer version racine. |
| `components/layout/index.ts` | ❌ N'existe pas | **USED** | Exporte ScreenContainer vers src/. Garder mais vérifier qu'il pointe vers src/. |

## 4. Dossier `components/` (racine) - index.ts

| Fichier racine | Fichier src/ | Statut | Action |
|---|---|---|---|
| `components/index.ts` | ❌ N'existe pas | **UNUSED** | Aucun import trouvé dans src/. Supprimer. |

## 5. Dossier `assets/` (racine)

### Assets utilisés :

| Asset racine | Référencé dans | Statut | Action |
|---|---|---|---|
| `assets/suivi/logo-full-light.png` | `src/components/ui/SuiviLogo.tsx`, `src/screens/LoginScreen.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/suivi/logo-full-dark.png` | `src/components/ui/SuiviLogo.tsx`, `src/screens/LoginScreen.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/suivi/logo-icon.png` | `src/components/ui/SuiviLogo.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/suivi/logo-icon-white.png` | `src/components/ui/SuiviLogo.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/suivi/logo-horizontal.png` | `src/components/ui/SuiviLogo.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/suivi/logo-horizontal-white.png` | `src/components/ui/SuiviLogo.tsx` | **USED** | Déplacer vers `src/assets/suivi/` |
| `assets/backgrounds/background-auth-light.png` | `src/components/AuthBackground.tsx` | **USED** | Déplacer vers `src/assets/backgrounds/` |
| `assets/backgrounds/background-auth-dark.png` | `src/components/AuthBackground.tsx` | **USED** | Déplacer vers `src/assets/backgrounds/` |
| `assets/icon.png` | `app.json` | **USED** | ⚠️ **GARDER** à la racine (Expo requiert chemin depuis racine) |
| `assets/icon 2.png` | ❌ Non référencé | **UNUSED** | Supprimer |
| `assets/splash 2.png` | ❌ Non référencé | **UNUSED** | Supprimer |
| Autres assets `assets/suivi/*` non listés | ❌ Non référencés | **UNUSED** | Supprimer après vérification |

## Actions à effectuer

1. **Supprimer les composants racine UNUSED/DUPLICATE** (déjà migrés dans src/)
2. **Déplacer les assets utilisés** vers `src/assets/`
3. **Mettre à jour les require()** pour pointer vers `src/assets/`
4. **Mettre à jour app.json** si nécessaire (mais icon.png doit rester à la racine pour Expo)
5. **Supprimer les dossiers racine vides** après migration

