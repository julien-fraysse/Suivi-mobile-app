import { ImageSourcePropType } from 'react-native';

/**
 * useUserProfile
 * 
 * Simple mock user profile hook returning basic user information.
 * 
 * Returns:
 * - fullName: User's full display name
 * - email: User's email address
 * - avatar: Local asset require() or URL string for avatar image
 * 
 * Backend Integration:
 * When ready to connect to real API, replace the mock return with:
 * - GET /me endpoint
 * - Transform response to match { fullName, email, avatar } structure
 */
export const useUserProfile = () => {
  return {
    fullName: 'Julien Fraysse',
    email: 'julien@suivi.app',
    avatar: require('../assets/images/julien.jpg') as ImageSourcePropType,
  };
};
