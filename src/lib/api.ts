const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // CRITICAL: Include cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  static async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    businessName?: string;
    businessCategory?: string;
  }) {
    return this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  static async refreshToken() {
    return this.request('/api/auth/refresh', {
      method: 'POST',
    });
  }

  static async verifyEmail(token: string) {
    return this.request(`/api/auth/verify?token=${token}`, {
      method: 'GET',
    });
  }

  static async verifyOTP(email: string, otp: string) {
    return this.request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  static async resendOTP(email: string) {
    return this.request('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async sendVerificationOTP(email: string) {
    return this.request('/api/auth/send-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async getUserProfile(email: string) {
    return this.request(`/api/users/get-profile?email=${email}`, {
      method: 'GET',
    });
  }
}
