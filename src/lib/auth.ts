/**
 * Authentication utilities
 */
import { ApiClient } from './api';

export class AuthService {
  /**
   * Logout user by calling the logout endpoint and redirecting to sign in
   */
  static async logout(): Promise<void> {
    try {
      // Call the logout endpoint to clear server-side cookies
      await ApiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Always redirect to sign in page regardless of API response
      window.location.href = '/signIn';
    }
  }
}