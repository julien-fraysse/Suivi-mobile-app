import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthContext, AuthContextValue } from './AuthContext';

const ACCESS_TOKEN_KEY = 'access_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from secure storage on mount
    loadAccessToken();
  }, []);

  async function loadAccessToken() {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        setAccessToken(token);
      }
    } catch (error) {
      console.error('Error loading access token:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    // TODO: Replace with real API call
    // For now, create a mock token
    const mockToken = `mock-token-${Date.now()}-${email}`;
    
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, mockToken);
      setAccessToken(mockToken);
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      setAccessToken(null);
    } catch (error) {
      console.error('Error deleting access token:', error);
      throw error;
    }
  }

  const value: AuthContextValue = {
    accessToken,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}




