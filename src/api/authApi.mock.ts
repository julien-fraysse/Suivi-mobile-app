/**
 * Auth Mock API
 * 
 * API mockée pour l'authentification (minimal pour MVP).
 * Remplacez ce fichier par un vrai client API (même signature) pour migrer vers l'API Suivi réelle.
 * 
 * @see ../config/environment.ts pour le flag USE_MOCK_API
 * @see docs/mobile/mock-data.md pour la documentation complète
 */

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connecte un utilisateur (mock)
 * 
 * TODO: Remplacer par un vrai appel API Suivi
 * POST /api/auth/signin
 * Body: { email: string, password: string }
 * Response: { accessToken: string, user: User }
 * 
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Promise<string> Token d'accès mock
 */
export async function signIn(email: string, password: string): Promise<string> {
  await delay();
  
  // Mock: Accepte n'importe quel email/password
  // TODO: Vérifier les credentials avec l'API Suivi réelle
  const mockToken = `mock-token-${Date.now()}-${email}`;
  
  return mockToken;
}

