import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiResponse<T> {
  status: number;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiClient {
  private static handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      status: response.status,
      data: response.data,
      message: typeof response.data === 'string' ? response.data : undefined,
    };
  }

  private static handleError(error: AxiosError): ApiResponse<any> {
    if (error.response) {
      // Server responded with error status
      const errorMessage = typeof error.response.data === 'string' 
        ? error.response.data 
        : (error.response.data as any)?.message || error.message;
      
      return {
        status: error.response.status,
        error: errorMessage,
      };
    } else if (error.request) {
      // Network error
      return {
        status: 0,
        error: 'Network error - please check your connection',
      };
    } else {
      // Other error
      return {
        status: 0,
        error: error.message || 'An unexpected error occurred',
      };
    }
  }

  private static async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.request({
        method,
        url: endpoint,
        data,
        params,
      });
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Authentication APIs
  static async login(email: string, password: string) {
    return this.request('POST', '/api/auth/login', { email, password });
  }

  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    businessName?: string;
    businessCategory?: string;
  }) {
    return this.request('POST', '/api/users/register', data);
  }

  static async logout() {
    return this.request('POST', '/api/auth/logout');
  }

  static async refreshToken() {
    return this.request('POST', '/api/auth/refresh');
  }

  static async verifyEmail(token: string) {
    return this.request('GET', '/api/auth/verify', undefined, { token });
  }

  static async verifyOTP(email: string, otp: string) {
    return this.request('POST', '/api/auth/verify-otp', { email, otp });
  }

  static async resendOTP(email: string) {
    return this.request('POST', '/api/auth/resend-otp', { email });
  }

  static async sendVerificationOTP(email: string) {
    return this.request('POST', '/api/auth/send-verification-otp', { email });
  }

  static async getUserProfile(email: string) {
    return this.request('GET', '/api/users/get-profile', undefined, { email });
  }

  // Client Management APIs
  static async addClient(clientData: {
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    phone: string;
    email: string;
    country?: string;
  }) {
    return this.request('POST', '/api/client/add', clientData);
  }

  static async updateClient(id: string, clientData: {
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    phone: string;
    email: string;
    country?: string;
  }) {
    return this.request('PUT', '/api/client/update', clientData, { id });
  }

  static async deleteClient(id: string) {
    return this.request('DELETE', '/api/client/delete-by-id', undefined, { id });
  }

  static async getAllUserClients() {
    return this.request('GET', '/api/client/all-user');
  }

  static async getClientById(id: string) {
    return this.request('GET', '/api/client/find-by-id', undefined, { id });
  }

  // Product Management APIs
  static async addProduct(productData: {
    itemName: string;
    category: string;
    description?: string;
    quantity?: number;
    rate?: number;
    amount?: number;
    taxIds?: string[];
  }) {
    return this.request('POST', '/api/product/add', productData);
  }

  static async updateProduct(id: string, productData: {
    itemName: string;
    category: string;
    description?: string;
    quantity?: number;
    rate?: number;
    amount?: number;
    taxIds?: string[];
  }) {
    return this.request('PUT', '/api/product/update', productData, { id });
  }

  static async deleteProduct(id: string) {
    return this.request('DELETE', '/api/product/delete-by-id', undefined, { id });
  }

  static async getAllUserProducts() {
    return this.request('GET', '/api/product/all-user');
  }

  static async getProductById(id: string) {
    return this.request('GET', '/api/product/find-by-id', undefined, { id });
  }

  static async getProductsByIds(ids: string[]) {
    return this.request('POST', '/api/product/by-ids', ids);
  }

  // Tax Management APIs
  static async getActiveTaxes() {
    return this.request('GET', '/api/tax/active');
  }

  static async getAllTaxes() {
    return this.request('GET', '/api/tax/all');
  }
}
