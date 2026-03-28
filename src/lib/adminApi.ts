import { ApiClient, ApiResponse } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    status: "active" | "inactive";
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    plan: "FREE" | "ESSENTIALS" | "PREMIUM";
    invoiceCount: number;
    registeredDate: string;
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
    category: "WHT" | "VAT" | "SALES_TAX" | "EXCISE_TAX" | "CUSTOM";
    baseRate: number;
    individualRate: number;
    businessRate: number;
    isActive: boolean;
    description: string;
}

export interface TaxRules {
    defaultIndividualTaxId: string;
    defaultBusinessTaxId: string;
    calculationMethod: "inclusive" | "exclusive";
}

export interface AdminOverviewStats {
    totalRevenue: number;
    currentMonthRevenue: number;
    revenueChange: number;
    activeSubscriptions: number;
    premiumCount: number;
    essentialsCount: number;
    subscriptionChange: number;
    monthlyRecurringRevenue: number;
    mrrChange: number;
    totalInvoices: number;
    invoiceChange: number;
}

export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    audience: string;
    sentAt: string;
    status: "sent" | "scheduled" | "draft";
    type: string;
}

export interface AdminManagementUser {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "SUPER_ADMIN";
    status: "active" | "inactive";
    lastLogin: string;
    createdDate: string;
}

export interface AuditLog {
    id: string;
    admin: string;
    action: string;
    target: string;
    timestamp: string;
    details: string;
}

export interface SystemConfig {
    freeMaxInvoices: number;
    freeMaxLogos: number;
    essentialsMaxInvoices: number;
    essentialsMaxLogos: number;
    premiumMaxInvoices: number;
    premiumMaxLogos: number;
    essentialPrice: number;
    premiumPrice: number;
    invoicePrefix: string;
    invoiceNumberFormat: string;
    invoiceAutoIncrement: boolean;
    paystackApiKey: string;
    paystackSecretKey: string;
    paystackMode: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export class AdminApi {

    // ── Overview ──────────────────────────────────────────────────────────────

    static async getOverviewStats(): Promise<ApiResponse<AdminOverviewStats>> {
        return ApiClient.get("/api/admin/overview/stats");
    }

    static async getPaymentTrends(period: string): Promise<ApiResponse<any[]>> {
        return ApiClient.get("/api/admin/overview/payment-trends", { period });
    }

    static async getInvoiceStatusBreakdown(): Promise<ApiResponse<any[]>> {
        return ApiClient.get("/api/admin/overview/invoice-status");
    }

    static async getSubscriptionDistribution(): Promise<ApiResponse<any[]>> {
        return ApiClient.get("/api/admin/overview/subscription-distribution");
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    static async getUsers(params: {
        page?: number;
        size?: number;
        search?: string;
        status?: string;
        role?: string;
        plan?: string;
    }): Promise<ApiResponse<AdminUserListResponse>> {
        return ApiClient.get("/api/admin/users", params);
    }

    static async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
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

    static async exportUsers(): Promise<ApiResponse<any>> {
        return ApiClient.get("/api/admin/users/export");
    }

    // ── Subscriptions ─────────────────────────────────────────────────────────

    static async getSubscriptions(params: {
        page?: number;
        size?: number;
        search?: string;
        plan?: string;
        status?: string;
    }): Promise<ApiResponse<AdminSubscriptionListResponse>> {
        return ApiClient.get("/api/admin/subscriptions", params);
    }

    static async upgradeSubscription(id: string, plan: string): Promise<ApiResponse<any>> {
        return ApiClient.patch(`/api/admin/subscriptions/${id}/upgrade`, { plan });
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

    // ── Tax Config ────────────────────────────────────────────────────────────

    static async getTaxTypes(): Promise<ApiResponse<TaxType[]>> {
        return ApiClient.get("/api/admin/tax-config");
    }

    static async createTaxType(data: Omit<TaxType, "id">): Promise<ApiResponse<TaxType>> {
        return ApiClient.post("/api/admin/tax-config", data);
    }

    static async updateTaxType(id: string, data: Partial<TaxType>): Promise<ApiResponse<TaxType>> {
        return ApiClient.put(`/api/admin/tax-config/${id}`, data);
    }

    static async deleteTaxType(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/tax-config/${id}`);
    }

    static async getTaxRules(): Promise<ApiResponse<TaxRules>> {
        return ApiClient.get("/api/admin/tax-config/rules");
    }

    static async updateTaxRules(data: TaxRules): Promise<ApiResponse<TaxRules>> {
        return ApiClient.put("/api/admin/tax-config/rules", data);
    }

    // ── Reports ───────────────────────────────────────────────────────────────

    static async generateReport(params: {
        reportId: string;
        startDate: string;
        endDate: string;
        format: string;
    }): Promise<ApiResponse<any>> {
        return ApiClient.post("/api/admin/reports/generate", params);
    }

    static async getRecentExports(): Promise<ApiResponse<any[]>> {
        return ApiClient.get("/api/admin/reports/recent");
    }

    // ── Notifications ─────────────────────────────────────────────────────────

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

    static async getNotificationHistory(): Promise<ApiResponse<AdminNotification[]>> {
        return ApiClient.get("/api/admin/notifications/history");
    }

    // ── Admin Management ──────────────────────────────────────────────────────

    static async getAdmins(params?: {
        search?: string;
        role?: string;
        status?: string;
    }): Promise<ApiResponse<AdminManagementUser[]>> {
        return ApiClient.get("/api/admin/management", params);
    }

    static async createAdmin(data: {
        email: string;
        fullName: string;
        role: string;
        status: string;
    }): Promise<ApiResponse<AdminManagementUser>> {
        return ApiClient.post("/api/admin/management", data);
    }

    static async updateAdmin(id: string, data: {
        fullName?: string;
        role?: string;
        status?: string;
    }): Promise<ApiResponse<AdminManagementUser>> {
        return ApiClient.put(`/api/admin/management/${id}`, data);
    }

    static async deleteAdmin(id: string): Promise<ApiResponse<any>> {
        return ApiClient.delete(`/api/admin/management/${id}`);
    }

    static async getAuditLogs(params?: {
        page?: number;
        size?: number;
    }): Promise<ApiResponse<AuditLog[]>> {
        return ApiClient.get("/api/admin/management/audit-logs", params);
    }

    // ── System Config ─────────────────────────────────────────────────────────

    static async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
        return ApiClient.get("/api/admin/system-config");
    }

    static async updateSystemConfig(data: Partial<SystemConfig>): Promise<ApiResponse<SystemConfig>> {
        return ApiClient.put("/api/admin/system-config", data);
    }

    // ── Profile ───────────────────────────────────────────────────────────────

    static async updateAdminProfile(data: {
        fullName: string;
        phone: string;
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
