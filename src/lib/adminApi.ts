import { ApiClient, ApiResponse } from "./api";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    status: string;
    role: string;
    roles?: string[];
    plan: string;
    currentPlan?: string;
    invoiceCount: number;
    registeredDate?: string;
    createdAt?: string;
    lastLogin?: string;
    phone?: string;
}

export interface AdminUserListResponse {
    content: AdminUser[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface AdminSubscription {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    plan: "FREE" | "ESSENTIALS" | "PREMIUM";
    status: "active" | "expired" | "cancelled";
    startDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
}

export interface AdminSubscriptionListResponse {
    content: AdminSubscription[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface TaxType {
  id: string;
  name: string;
  type: string;
  taxType?: string;
  description?: string;
  individualRate: number;
  businessRate: number;
  baseTaxRate: number;
  active?: boolean;
  isActive?: boolean;
}

export interface TaxRules {
    defaultIndividualTaxId: string;
    defaultBusinessTaxId: string;
    calculationMethod: "inclusive" | "exclusive";
}

export interface AdminOverviewStats {
    totalRevenue: number;
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    freeSubscriptions: number;
    essentialsSubscriptions: number;
    premiumSubscriptions: number;
    totalInvoices: number;
    revenueChange?: number;
    subscriptionChange?: number;
    userChange?: number;
    invoiceChange?: number;
}

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    audience: string;
    sentAt: string | null;
    scheduledTime?: string | null;
    status: "sent" | "scheduled" | "draft";
    type: string;
    createdAt?: string;
}

export interface AdminManagementUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
    roles?: string[];
    status: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    lastLogin?: string;
    createdDate?: string;
}

export interface ContactMessage {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    agreeToComms: boolean;
    status: "NEW" | "READ" | "RESPONDED";
    createdAt: string;
}

export interface AuditLog {
    id: number;
    adminId: string;
    adminEmail: string;
    action: string;
    targetUserId: string;
    targetResourceType: string;
    targetResourceId: number;
    beforeValue: string | null;
    afterValue: string | null;
    timestamp: string;
    ipAddress: string | null;
    userAgent: string | null;
}

export interface ContactMessage {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    agreeToComms: boolean;
    status: "NEW" | "READ" | "RESPONDED";
    createdAt: string;
}

export interface SystemConfig {
    freeMaxInvoices: number;
    freeMaxLogos: number;
    essentialsMaxInvoices: number;
    essentialsMaxLogos: number;
    premiumMaxInvoices: number;
    premiumMaxLogos: number;
    essentialsMonthlyPrice: number;
    essentialsAnnualPrice: number;
    premiumMonthlyPrice: number;
    premiumAnnualPrice: number;
    invoicePrefix?: string;
    invoiceNumberFormat?: string;
    invoiceAutoIncrement?: boolean;
    paystackApiKey?: string;
    paystackSecretKey?: string;
    paystackMode?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    inAppNotifications?: boolean;
}

// â”€â”€â”€ Admin API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export class AdminApi {

    // â”€â”€ Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getOverviewStats(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/overview/stats", { startDate, endDate });
    }

    static async getPaymentTrends(period: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/overview/payment-trends", { period });
    }

    static async getInvoiceStatusBreakdown(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/overview/invoice-status");
    }

    static async getSubscriptionDistribution(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/overview/subscription-distribution");
    }

    // â”€â”€ Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getUsers(params: {
        page?: number;
        size?: number;
        search?: string;
        status?: string;
        role?: string;
        plan?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/users", params);
    }

    static async getUserById(id: string): Promise<ApiResponse<any>> {
        return ApiClient.get(`/api/admin/users/${id}`);
    }

    static async updateUserRole(id: string, role: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/users/${id}/role`, { role });
    }

    static async toggleUserStatus(id: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/users/${id}/toggle-status`);
    }

    static async resetUserPassword(id: string): Promise<ApiResponse<any>> {
        return ApiClient.post(`/api/admin/users/${id}/reset-password`);
    }

    static async deleteUser(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/users/${id}`);
    }

    // â”€â”€ Subscriptions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getSubscriptions(params: {
        page?: number;
        size?: number;
        search?: string;
        plan?: string;
        status?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/subscriptions", params);
    }

    static async upgradeSubscription(id: string, plan: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/subscriptions/${id}/upgrade`, { plan });
    }

    static async activateSubscription(id: string): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody(`/api/admin/subscriptions/${id}/activate`);
    }

    static async downgradeSubscription(id: string, plan: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/subscriptions/${id}/downgrade`, { plan });
    }

    static async extendSubscription(id: string, days: number): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/subscriptions/${id}/extend`, { days });
    }

    static async cancelSubscription(id: string, reason: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/subscriptions/${id}/cancel`, { reason });
    }

    // â”€â”€ Tax Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getTaxTypes(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/tax-config");
    }

    static async createTaxType(data: Omit<TaxType, "id">): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/tax-config", data);
    }

    static async updateTaxType(id: string, data: Partial<TaxType>): Promise<ApiResponse<any>> {
        return ApiClient.put(`/api/admin/tax-config/${id}`, data);
    }

    static async deleteTaxType(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/tax-config/${id}`);
    }

    static async disableTaxType(id: string): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody(`/api/admin/tax-config/${id}/disable`);
    }

    static async enableTaxType(id: string): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody(`/api/admin/tax-config/${id}/enable`);
    }

    static async getTaxRules(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/tax-config/rules");
    }

    static async updateTaxRules(data: TaxRules): Promise<ApiResponse<any>> {
        return ApiClient.put("/api/admin/tax-config/rules", data);
    }

    // â”€â”€ Reports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getRevenueReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/revenue", { startDate, endDate });
    }

    static async getSubscriptionReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/subscriptions", { startDate, endDate });
    }

    static async getUserActivityReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/user-activity", { startDate, endDate });
    }

    static async getInvoiceStatisticsReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/invoice-statistics", { startDate, endDate });
    }

    static async getTaxCollectionReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/tax-collection", { startDate, endDate });
    }

    static async exportUsers(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/export/users");
    }

    static async exportTransactions(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/export/transactions");
    }

    static async exportInvoices(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/export/invoices");
    }

    static async getRecentExports(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/reports/recent");
    }

    // â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async sendNotification(data: {
        type: string;
        title: string;
        message: string;
        targetSegment: string;
        scheduleType: string;
        scheduledTime?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/notifications/send", data);
    }

    static async getNotificationHistory(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/notifications/history");
    }

    static async getMyNotifications(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/notifications/my-notifications");
    }

    static async getUnreadNotifications(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/notifications/my-notifications/unread");
    }

    static async markAllNotificationsRead(): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody("/api/admin/notifications/my-notifications/mark-all-read");
    }

    // â”€â”€ Admin Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getAdmins(params?: {
        search?: string;
        role?: string;
        status?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/management", params);
    }

    static async createAdmin(data: {
        email: string;
        fullName: string;
        role: string;
        status: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/management", data);
    }

    static async updateAdmin(id: string, data: {
        fullName?: string;
        role?: string;
        status?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.put(`/api/admin/management/${id}`, data);
    }

    static async disableAdmin(id: string): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody(`/api/admin/management/${id}/disable`);
    }

    static async enableAdmin(id: string): Promise<ApiResponse<any>> {
        return ApiClient.putNoBody(`/api/admin/management/${id}/enable`);
    }

    static async deleteAdmin(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/management/${id}`);
    }

    static async getAuditLogs(params?: {
        page?: number;
        size?: number;
        action?: string;
        adminId?: string;
        targetUserId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/audit-logs", params);
    }

    static async getAuditLogActions(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/audit-logs/actions");
    }

    static async getAuditLogStats(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/audit-logs/stats");
    }

    // â”€â”€ System Config / Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getPlans(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/system-config/plans");
    }

    static async createPlan(data: any): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/system-config/plans", data);
    }

    static async updatePlan(id: string, data: any): Promise<ApiResponse<any>> {
        return ApiClient.put(`/api/admin/system-config/plans/${id}`, data);
    }

    static async deletePlan(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/system-config/plans/${id}`);
    }

    static async syncPlanToPaystack(id: string): Promise<ApiResponse<any>> {
        return ApiClient.post(`/api/admin/system-config/plans/${id}/sync-paystack`);
    }

    static async deletePaystackCode(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/system-config/plans/${id}/paystack-code`);
    }

    static async getSystemConfig(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/system-config");
    }

    static async updateSystemConfig(data: Partial<SystemConfig>): Promise<ApiResponse<any>> {
        return ApiClient.put("/api/admin/system-config", data);
    }

    // â”€â”€ Contact Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    static async getContactMessages(params?: {
        name?: string;
        email?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        size?: number;
    }): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/contact", params);
    }

    static async getContactMessage(id: number): Promise<ApiResponse<any>> {
        return ApiClient.get(`/api/admin/contact/${id}`);
    }

    static async getUnreadContactMessages(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/contact/unread");
    }

    static async getUnreadContactCount(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/contact/unread-count");
    }

    static async updateContactStatus(id: number, status: "NEW" | "READ" | "RESPONDED"): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/contact/${id}/status?status=${status}`);
    }

    static async updateAdminProfile(data: {
        fullName: string;
        phoneNumber: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.put("/api/admin/profile", data);
    }

    static async changeAdminPassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/profile/change-password", data);
    }
}
