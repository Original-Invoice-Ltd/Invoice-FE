import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling and debugging
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      
      // Skip redirect for certain API endpoints that may return 401 for empty data
      const skipRedirectEndpoints = ['/api/product/', '/api/client/', '/api/tax/'];
      const requestUrl = error.config?.url || '';
      const shouldSkipRedirect = skipRedirectEndpoints.some(endpoint => requestUrl.includes(endpoint));
      
      if (shouldSkipRedirect) {
        return Promise.reject(error);
      }
      
      // Only redirect if we're on protected pages (dashboard routes)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isProtectedRoute = currentPath.startsWith('/dashboard') || 
                                currentPath.startsWith('/complete-profile');
        
        // Only redirect if we're on a protected route and not already on auth pages
        if (isProtectedRoute && 
            !currentPath.includes('/signIn') && 
            !currentPath.includes('/signUp')) {
          window.location.href = '/signIn';
        } else {
        }
      }
    }
    return Promise.reject(error);
  }
);

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
    console.log('URL:', `${API_BASE_URL}${endpoint}`);
    console.log('Method:', method);
    console.log('Body:', data);
    
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

  // Generic HTTP methods
  static async get(endpoint: string, params?: any) {
    return this.request('GET', endpoint, undefined, params);
  }

  static async post(endpoint: string, data?: any) {
    return this.request('POST', endpoint, data);
  }

  static async put(endpoint: string, data?: any) {
    return this.request('PUT', endpoint, data);
  }

  static async delete(endpoint: string, params?: any) {
    return this.request('DELETE', endpoint, undefined, params);
  }

  // Authentication APIs
  static async login(email: string, password: string) {
    
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password }); 
      
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async register(data: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
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

  static async verifyPasswordResetOTP(email: string, otp: string) {
    return this.request('POST', '/api/auth/verify-password-reset-otp', { email, otp });
  }

  static async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
    return this.request('POST', '/api/auth/reset-password-with-otp', { email, otp, newPassword });
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

  // Notification APIs
  static async getNotifications(page = 0, size = 4) {
    return this.request('GET', '/api/notifications', undefined, { page, size });
  }

  static async getNotificationsByType(type: string, page = 0, size = 4) {
    return this.request('GET', `/api/notifications/type/${type}`, undefined, { page, size });
  }

  static async getUnreadNotifications() {
    return this.request('GET', '/api/notifications/unread');
  }

  static async getUnreadCount() {
    return this.request('GET', '/api/notifications/unread/count');
  }

  static async markAllAsRead() {
    return this.request('PUT', '/api/notifications/mark-all-read');
  }

  static async markAllAsNotNew() {
    return this.request('PUT', '/api/notifications/mark-all-not-new');
  }

  static async markAsRead(id: number) {
    return this.request('PUT', `/api/notifications/${id}/read`);
  }

  // Invoice Management APIs
  static async createInvoice(formData: FormData): Promise<ApiResponse<any>> {
    try {
      // For FormData, do NOT set Content-Type manually - browser will set it with boundary
      const response = await axiosInstance.post('/api/invoices/add', formData, {
        headers: {
          // Remove Content-Type to let browser set it automatically with boundary
          'Content-Type': undefined as any,
        },
        withCredentials: true, // Ensure cookies are sent
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async getAllUserInvoices() {
    return this.request('GET', '/api/invoices/all-user');
  }

  static async getInvoiceById(id: string) {
    return this.request('GET', `/api/invoices/${id}`);
  }

  static async updateInvoice(id: string, formData: FormData): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.patch(`/api/invoices/update/${id}`, formData, {
        headers: {
          'Content-Type': undefined as any,
        },
        withCredentials: true,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async deleteInvoice(id: string) {
    return this.request('DELETE', `/api/invoices/delete/${id}`);
  }
}
