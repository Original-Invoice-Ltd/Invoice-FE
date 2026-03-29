/**
 * Authentication utilities
 */
import { ApiClient } from './api';

/**
 * Parses roles from the API which may come as a stringified nested array
 * e.g. ["[USER, SUPER_ADMIN]"] → ["USER", "SUPER_ADMIN"]
 */
export function parseRoles(roles: any[]): string[] {
  return (roles ?? []).flat().join(',').replace(/[\[\]]/g, '').split(',').map(r => r.trim()).filter(Boolean);
}

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