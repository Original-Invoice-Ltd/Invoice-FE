import axios, { AxiosResponse, AxiosError } from "axios";
import { InvoiceStatsResponse, DashboardStats, PaymentTrend, RecentInvoice } from "@/types/invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Temporary bypass flag for testing - set to true to skip 401 redirects
const BYPASS_AUTH_REDIRECT = true;

// Configure axios defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: Include cookies
  headers: {
    "Content-Type": "application/json",
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

      // Skip redirect if bypass flag is enabled (for testing)
      if (BYPASS_AUTH_REDIRECT) {
        return Promise.reject(error);
      }

      // Skip redirect for certain API endpoints that may return 401 for empty data
      const skipRedirectEndpoints = [
        "/api/product/",
        "/api/client/",
        "/api/tax/",
        "/api/notifications/",
        "/api/invoices/all-user",
      ];
      const requestUrl = error.config?.url || "";
      const shouldSkipRedirect = skipRedirectEndpoints.some((endpoint) => requestUrl.includes(endpoint));

      if (shouldSkipRedirect) {
        return Promise.reject(error);
      }

      // Only redirect if we're on protected pages (dashboard routes)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const isProtectedRoute =
          currentPath.startsWith("/dashboard") ||
          currentPath.startsWith("/complete-profile");

        // Only redirect if we're on a protected route and not already on auth pages
        if (
          isProtectedRoute &&
          !currentPath.includes("/signIn") &&
          !currentPath.includes("/signUp")
        ) {
          window.location.href = "/signIn";
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
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
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

  static async get(endpoint: string, params?: any) {
    return this.request('GET', endpoint, undefined, params);
  }

  static async post(endpoint: string, data?: any) {
    return this.request('POST', endpoint, data);
  }

  static async put(endpoint: string, data?: any) {
    return this.request('PUT', endpoint, data);
  }

  static async patch(endpoint: string, data?: any) {
    return this.request('PATCH', endpoint, data);
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

    static async getCurrentUser() {
    return await axiosInstance.get("/api/users/me", {
      withCredentials: true,
    });
  }

  static async updateProfile(fullName: string, phoneNumber: string) {
    return this.request('PUT', '/api/users/update-profile', { fullName, phoneNumber });
  }

  static async changePassword(currentPassword: string, newPassword: string) {
    return this.request('PUT', '/api/users/change-password', { currentPassword, newPassword });
  }

  static async deleteAccount() {
    return this.request('DELETE', '/api/users/delete-account');
  }

  static async uploadProfilePhoto(email: string, imageFile: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('image', imageFile);

      const response = await axiosInstance.put('/api/users/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
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
  return this.request("POST", "/api/client/add", clientData);
  }

  static async updateClient(id: string,
    clientData: {
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
  static async getAllNotifications() {
    return this.request("GET", "/api/notifications/all");
  }

  static async getUnreadNotifications() {
    return this.request("GET", "/api/notifications/unread");
  }

  static async getUnreadCount() {
    return this.request("GET", "/api/notifications/unread-count");
  }

  static async markAllNotificationsAsRead() {
    return this.request("PUT", "/api/notifications/mark-all-read");
  }

  static async markNotificationAsRead(notificationId: string) {
    return this.request(
      "PUT",
      `/api/notifications/${notificationId}/mark-read`,
    );
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

  static async markInvoiceAsPaid(invoiceId: string) {
    return this.request('PATCH', `/api/invoices/${invoiceId}/mark-as-paid`);
  }

  static async getAllUserInvoices(userId?: string) {
    return userId
      ? await axiosInstance.get(`/api/invoices/all-user/${userId}`, {
          withCredentials: true,
        })
      : await axiosInstance.get(`/api/invoices/all-user`, {
          withCredentials: true,
        });
  }

  static async getInvoiceById(id: string) {
    return this.request("GET", `/api/invoices/public/${id}`);
  }

  static async getPublicInvoiceByUuid(uuid: string): Promise<ApiResponse<any>> {
    try {
      // Use axios directly for public endpoint - no authentication required
      const response = await axios.get(
        `https://api.originalinvoice.com/api/invoices/public/${uuid}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Dashboard Analytics APIs
  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("GET", "/api/invoices/dashboard/stats");
  }

  static async getPaymentTrends(period: 'month' | 'year' = 'month'): Promise<ApiResponse<PaymentTrend[]>> {
    return this.request<PaymentTrend[]>("GET", "/api/invoices/dashboard/payment-trends", undefined, { period });
  }

  static async getRecentInvoices(limit: number = 5): Promise<ApiResponse<RecentInvoice[]>> {
    if (limit < 1 || limit > 20) {
      throw new Error('Limit must be between 1 and 20');
    }
    return this.request<RecentInvoice[]>("GET", "/api/invoices/dashboard/recent-invoices", undefined, { limit });
  }

  static async getInvoiceStats(
    email: string,
  ): Promise<ApiResponse<InvoiceStatsResponse>> {
    return this.request<InvoiceStatsResponse>(
      "GET",
      "/api/invoices/stats/received",
      undefined,
      { email },
    );
  }

  static async updateInvoice(
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.patch(
        `/api/invoices/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": undefined as any,
          },
          withCredentials: true,
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async deleteInvoice(id: string) {
    return this.request('DELETE', `/api/invoices/delete/${id}`);
  }

  // Subscription Management APIs
  static async getCurrentSubscription() {
    return this.request('GET', '/api/subscriptions/current');
  }

  static async canCreateInvoice() {
    return this.request('GET', '/api/subscriptions/can-create-invoice');
  }

  static async getSubscriptionPlans() {
    return this.request('GET', '/api/subscriptions/plans');
  }

  static async initializeSubscription(data: { plan: string }) {
    return this.request('POST', '/api/subscriptions/initialize', data);
  }

  static async initializeCardSubscription(data: { plan: string }) {
    return this.request('POST', '/api/subscriptions/initialize-card-subscription', data);
  }

  static async initializeTransactionWithPlan(data: { 
    plan: string; 
    channels?: string[]; 
    callbackUrl?: string; 
  }) {
    return this.request('POST', '/api/subscriptions/initialize-transaction', data);
  }

  static async cancelSubscription() {
    return this.request('POST', '/api/subscriptions/cancel');
  }

  static async verifySubscription(reference: string) {
    return this.request('GET', `/api/subscriptions/verify/${reference}`);
  }

  static async enableSubscription() {
    return this.request('POST', '/api/subscriptions/enable');
  }

  static async disableSubscription() {
    return this.request('POST', '/api/subscriptions/disable');
  }

  // Receipt Management APIs
  static async uploadReceipt(invoiceId: string, receiptFile: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('evidence', receiptFile);
      // Use the public endpoint - no authentication required
      const response = await axios.post(
        `https://api.originalinvoice.com/api/invoices/${invoiceId}/upload-evidence`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  static async getReceiptByInvoiceId(invoiceId: string) {
    return this.request("GET", `/api/receipts/invoice/${invoiceId}`);
  }

  static async getAllUserReceipts() {
    return this.request("GET", "/api/receipts/all-user");
  }

  static async getReceiptById(id: string) {
    return this.request("GET", `/api/receipts/${id}`);
  }

  static async getLanguage() {
    return await axiosInstance.get("/api/settings/language", {
      withCredentials: true,
    });
  }

  static async updateLanguage(language: string) {
    return await axiosInstance.patch(
      "/api/settings/language",
      {
        language: language.toUpperCase(),
      },
      {
        withCredentials: true,
      },
    );
  }

  static async getNotificationPreference() {
    return await axiosInstance.get("/api/settings/notifications", {
      withCredentials: true,
    });
  }

  static async updateNotificationPreference(settings: {
    paymentRecorded: boolean;
    invoiceSent: boolean;
    invoiceReminder: boolean;
    clientAdded: boolean;
    systemAlerts: boolean;
  }) {
    return await axiosInstance.patch("/api/settings/notifications", settings, {
      withCredentials: true,
    });
  }

  // Business Profile APIs
  static async getBusinessProfile() {
    return this.request("GET", "/api/settings/businessProfile");
  }

  static async updateBusinessProfile(businessProfileData: {
    businessName?: string;
    businessFullName?: string;
    registeredBusinessAddress?: string;
    emailAddress?: string;
    phoneNumber?: string;
    businessType?: string;
    country?: string;
    businessRegistrationNumber?: string;
    businessLogoUrl?: string;
  }) {
    return this.request(
      "PATCH",
      "/api/settings/businessProfile",
      businessProfileData,
    );
  }

  static async uploadBusinessLogo(logoFile: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append("logoFile", logoFile);

      const response = await axiosInstance.post(
        "/api/settings/uploadLogo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Tax Settings APIs
  static async getTaxSettings() {
    return await axiosInstance.get("/api/settings/taxSettings", {
      withCredentials: true,
    });
  }

  static async updateTaxSettings(taxSettingsData: {
    taxApplied?: string;
    taxId?: string;
    enablingVAT?: boolean;
    enablingWHT?: boolean;
  }) {
    return await axiosInstance.patch(
      "/api/settings/taxSettings",
      taxSettingsData,
      {
        withCredentials: true,
      },
    );
  }

  static async getPersonalProfile() {
    return await axiosInstance.get("/api/settings/personalProfile", {
      withCredentials: true,
    });
  }

  static async updatePersonalProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profilePicture?: File;
  }): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();

      if (profileData.firstName) {
        formData.append("firstName", profileData.firstName);
      }
      if (profileData.lastName) {
        formData.append("lastName", profileData.lastName);
      }
      if (profileData.phoneNumber) {
        formData.append("phoneNumber", profileData.phoneNumber);
      }
      if (profileData.profilePicture) {
        formData.append("profilePicture", profileData.profilePicture);
      }

      const response = await axiosInstance.patch(
        "/api/settings/personalProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  // Utility methods for customer invoice operations
  static getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
// <<<<<<< HEAD

//   static getDropdownOptions(status: string): Array<{ label: string; action: string }> {
//     const baseOptions = [
//       { label: "View Detail", action: "view" }
//     ];

//     const statusLower = status.toLowerCase();
    
//     if (statusLower === 'paid') {
//       return [
//         ...baseOptions,
//         { label: "View Receipt", action: "receipt" }
//       ];
//     } else if (statusLower === 'pending') {
//       // Pending invoices can only be viewed, no upload allowed
//       return baseOptions;
//     } else {
//       // Unpaid/Overdue invoices can upload receipt
//       return [
//         ...baseOptions,
//         { label: "Upload Receipt", action: "upload" }
//       ];
//     }
//   }
// =======
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  static getDropdownOptions(
    status: string,
  ): Array<{ label: string; action: string }> {
    const baseOptions = [{ label: "View Detail", action: "view" }];

    if (status.toLowerCase() === "paid") {
      return [...baseOptions, { label: "View Receipt", action: "receipt" }];
    } else {
      return [...baseOptions, { label: "Upload Receipt", action: "upload" }];
    }
  }
  static isValidPhone = (phone: string) => {
    return /^\+[1-9]\d{7,14}$/.test(phone);
  };

  static isValidEmail(email: string): boolean{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }

  static formatCurrency(amount: number, currency: string = "₦"): string {
    return `${currency}${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}
