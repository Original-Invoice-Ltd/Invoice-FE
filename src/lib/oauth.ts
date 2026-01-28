/**
 * OAuth utility functions for handling Google and Apple Sign-In
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';

export class OAuthClient {
  /**
   * Redirects to Google OAuth login
   */
  static redirectToGoogle(): void {
    window.location.href = `${API_BASE_URL}/oauth/google/login`;
  }

  /**
   * Redirects to Apple OAuth login
   */
  static redirectToApple(): void {
    window.location.href = `${API_BASE_URL}/oauth/apple/login`;
  }

  /**
   * Generic OAuth redirect function
   */
  static redirectToProvider(provider: 'google' | 'apple'): void {
    window.location.href = `${API_BASE_URL}/oauth/${provider}/login`;
  }

  /**
   * Check if OAuth error exists in URL params
   */
  static getOAuthError(): string | null {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error === 'oauth_failed') {
      return 'OAuth authentication failed. Please try again.';
    }
    
    return null;
  }

  /**
   * Clear OAuth error from URL
   */
  static clearOAuthError(): void {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());
  }
}