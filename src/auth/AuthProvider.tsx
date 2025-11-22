import React, { useEffect } from 'react';
import { save, load, remove } from '@utils/storage';
import { AuthContext, AuthContextValue } from './AuthContext';
import { useAuthStore, type AuthUser } from '@store/authStore';

const ACCESS_TOKEN_KEY = 'access_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Load token from secure storage on mount
    loadAccessToken();
  }, []);

  async function loadAccessToken() {
    try {
      setLoading(true);
      const token = await load(ACCESS_TOKEN_KEY);
      if (token) {
        // Mock user from token (for now)
        // TODO: Replace with real API call to get user info
        const mockUser: AuthUser = {
          id: '1',
          name: 'Julien Fraysse',
          email: 'julien@suivi.app',
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Error loading access token:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    // TODO: Replace with real API call
    // For now, create a mock token
    const mockToken = `mock-token-${Date.now()}-${email}`;
    
    try {
      await save(ACCESS_TOKEN_KEY, mockToken);
      // Mock user from email (for now)
      // TODO: Replace with real API call to get user info
      const mockUser: AuthUser = {
        id: '1',
        name: email.split('@')[0] || 'User',
        email: email,
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await remove(ACCESS_TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error deleting access token:', error);
      throw error;
    }
  }

  const value: AuthContextValue = {
    accessToken: user ? 'mock-token' : null, // Keep for backward compatibility
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}





