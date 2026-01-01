const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089/api';

console.log('=== API CLIENT INITIALIZED ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_BASE_URL env:', process.env.NEXT_PUBLIC_API_BASE_URL);

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
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('=== API REQUEST ===');
    console.log('URL:', url);
    console.log('Method:', options.method || 'GET');
    console.log('Body:', options.body);
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // CRITICAL: Include cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      console.log('=== API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data;
      const rawText = await response.text();
      
      console.log('Raw Response Text:', rawText);
      
      // Try to parse as JSON first
      if (rawText) {
        try {
          data = JSON.parse(rawText);
          console.log('Parsed JSON:', data);
        } catch {
          // Not JSON, use raw text
          data = rawText;
          console.log('Not JSON, using raw text');
        }
      }

      if (!response.ok) {
        // Extract error message - handle various formats
        let errorMsg = this.extractErrorMessage(data, rawText);
        console.log('Error Message Extracted:', errorMsg);
        
        return {
          success: false,
          error: errorMsg,
        };
      }

      return {
        success: true,
        data: typeof data === 'object' ? (data?.data || data) : data,
        message: typeof data === 'object' ? data?.message : undefined,
      };
    } catch (error) {
      console.error('=== API REQUEST FAILED ===');
      console.error('Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      };
    }
  }

  private static extractErrorMessage(data: unknown, rawText: string): string {
    console.log('=== ERROR EXTRACTION DEBUG ===');
    console.log('data:', data);
    console.log('rawText:', rawText);
    console.log('typeof data:', typeof data);
    
    // Map of backend messages to user-friendly messages
    const errorMappings: Record<string, string> = {
      'user exists with email': 'Account already exists. Please sign in instead.',
      'user exist': 'Account already exists. Please sign in instead.',
      'User not found': 'No account found with this email address.',
      'Invalid credentials': 'Invalid email or password. Please try again.',
      'Account not verified': 'Please verify your email address before signing in.',
      'Invalid OTP': 'The verification code is incorrect. Please try again.',
      'OTP expired': 'The verification code has expired. Please request a new one.',
    };

    // Check if data is a string and not empty
    if (typeof data === 'string' && data.trim()) {
      // Check for known error patterns
      for (const [pattern, friendlyMessage] of Object.entries(errorMappings)) {
        if (data.toLowerCase().includes(pattern.toLowerCase())) {
          return friendlyMessage;
        }
      }
      return data;
    }

    // Check if data is an object with message/error
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      const message = obj.message || obj.error;
      
      if (typeof message === 'string' && message.trim()) {
        // Check for known error patterns
        for (const [pattern, friendlyMessage] of Object.entries(errorMappings)) {
          if (message.toLowerCase().includes(pattern.toLowerCase())) {
            return friendlyMessage;
          }
        }
        return message;
      }
    }

    // Fallback: check raw text
    if (rawText && rawText.trim()) {
      for (const [pattern, friendlyMessage] of Object.entries(errorMappings)) {
        if (rawText.toLowerCase().includes(pattern.toLowerCase())) {
          return friendlyMessage;
        }
      }
      // Don't return raw text if it looks like JSON with empty message
      if (!rawText.includes('{"message":""}')) {
        return rawText;
      }
    }

    return 'An error occurred. Please try again.';
  }

  static async login(email: string, password: string) {
    return this.request('/auth/login', {
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
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  static async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  static async verifyEmail(token: string) {
    return this.request(`/auth/verify?token=${token}`, {
      method: 'GET',
    });
  }

  static async verifyOTP(email: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  static async resendOTP(email: string) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async sendVerificationOTP(email: string) {
    return this.request('/auth/send-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async verifyPasswordResetOTP(email: string, otp: string) {
    return this.request('/auth/verify-password-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  static async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
    return this.request('/auth/reset-password-with-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  static async getUserProfile(email: string) {
    return this.request(`/users/get-profile?email=${email}`, {
      method: 'GET',
    });
  }
}
