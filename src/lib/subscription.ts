import { ApiClient } from "./api";

export interface SubscriptionPlan {
  name: string;
  displayName: string;
  amount: number;
  invoiceLimit: number;
  sharingEnabled: boolean;
  logoLimit: number;
  unlimitedInvoices: boolean;
  unlimitedLogos: boolean;
}

export interface CurrentSubscription {
  id?: string;
  plan: string;
  planDisplayName: string;
  status: string;
  invoiceLimit: number;
  invoicesUsed: number;
  sharingEnabled: boolean;
  logoLimit: number;
  logosUploaded: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  nextPaymentDate?: string;
}

export interface PaymentMethodSelection {
  plan: "ESSENTIALS" | "PREMIUM";
  paymentMethod: "card" | "transfer";
}

export interface PaystackInitializeResponse {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference?: string;
  message?: string;
}

// Plan codes from backend
export const PLAN_CODES = {
  ESSENTIALS: "PLN_1hgx8jfrfx39u44",
  PREMIUM: "PLN_8y3o8kp1wbe5h1j"
} as const;

export const PLAN_DETAILS = {
  ESSENTIALS: {
    name: "Essentials",
    price: 2000, // ₦2,000
    invoiceLimit: 10,
    features: [
      "10 invoices per month",
      "Basic templates",
      "Email support",
      "Payment tracking"
    ]
  },
  PREMIUM: {
    name: "Premium", 
    price: 5000, // ₦5,000
    invoiceLimit: -1, // Unlimited
    features: [
      "Unlimited invoices",
      "Premium templates",
      "Priority support",
      "Advanced analytics",
      "Custom branding"
    ]
  }
} as const;

/**
 * Get current user's subscription details
 */
export const getCurrentSubscription = async (): Promise<CurrentSubscription | null> => {
  try {
    const response = await ApiClient.getCurrentSubscription();
    if (response.status === 200) {
      console.log("subscription: ", response)
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching current subscription:", error);
    return null;
  }
};

/**
 * Check if user can create an invoice
 */
export const canCreateInvoice = async (): Promise<{ canCreate: boolean; reason?: string; limit?: number; used?: number }> => {
  try {
    const response = await ApiClient.canCreateInvoice();
    if (response.status === 200) {
      return response.data;
    }
    return { canCreate: false, reason: "Failed to check invoice limit" };
  } catch (error) {
    console.error("Error checking invoice creation permission:", error);
    return { canCreate: false, reason: "Error checking invoice limit" };
  }
};

/**
 * Get available subscription plans
 */
export const getAvailablePlans = async (): Promise<Record<string, SubscriptionPlan> | null> => {
  try {
    const response = await ApiClient.getSubscriptionPlans();
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return null;
  }
};

/**
 * Initialize card-based subscription with automatic recurring billing
 */
export const initializeCardSubscription = async (plan: "ESSENTIALS" | "PREMIUM"): Promise<PaystackInitializeResponse> => {
  try {
    const response = await ApiClient.initializeCardSubscription({ plan });
    if (response.status === 200) {
      return response.data;
    }
    return { success: false, message: response.error || "Failed to initialize subscription" };
  } catch (error) {
    console.error("Error initializing card subscription:", error);
    return { success: false, message: "Error initializing subscription" };
  }
};

/**
 * Initialize transaction with plan for one-time payment + subscription
 */
export const initializeTransactionWithPlan = async (
  plan: "ESSENTIALS" | "PREMIUM", 
  channels?: string[], 
  callbackUrl?: string
): Promise<PaystackInitializeResponse> => {
  try {
    const response = await ApiClient.initializeTransactionWithPlan({
      plan,
      channels,
      callbackUrl
    });
    if (response.status === 200) {
      return response.data;
    }
    return { success: false, message: response.error || "Failed to initialize transaction" };
  } catch (error) {
    console.error("Error initializing transaction with plan:", error);
    return { success: false, message: "Error initializing transaction" };
  }
};

/**
 * Cancel current subscription
 */
export const cancelSubscription = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await ApiClient.cancelSubscription();
    if (response.status === 200) {
      return response.data;
    }
    return { success: false, message: response.error || "Failed to cancel subscription" };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false, message: "Error cancelling subscription" };
  }
};

/**
 * Verify subscription payment
 */
export const verifySubscription = async (reference: string): Promise<{ success: boolean; message: string; plan?: string; planDisplayName?: string }> => {
  try {
    const response = await ApiClient.verifySubscription(reference);
    if (response.status === 200) {
      return response.data;
    }
    return { success: false, message: response.error || "Failed to verify subscription" };
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return { success: false, message: "Error verifying subscription" };
  }
};

/**
 * Helper function to format plan price
 */
export const formatPlanPrice = (plan: "ESSENTIALS" | "PREMIUM"): string => {
  const price = PLAN_DETAILS[plan].price;
  return `₦${price.toLocaleString()}`;
};


export const getPlanFeatures = (plan: "ESSENTIALS" | "PREMIUM") => {
  return PLAN_DETAILS[plan].features;
};

/**
 * Helper function to check if plan has unlimited invoices
 */
export const hasUnlimitedInvoices = (plan: "ESSENTIALS" | "PREMIUM"): boolean => {
  return PLAN_DETAILS[plan].invoiceLimit === -1;
};