export type PlanType = 'FREE' | 'ESSENTIALS' | 'PREMIUM';

export interface PlanFeatures {
  invoiceLimit: number; // -1 means unlimited
  
  basicTemplates: boolean;
  advancedTemplates: boolean;
  premiumTemplates: boolean;
  
  customLogo: boolean;
  multipleLogos: boolean;
  removeWatermark: boolean;
  
  emailSharing: boolean;
  whatsappSharing: boolean;
  paymentTracking: boolean;
  taxCompliance: boolean;
  advancedAnalytics: boolean;
  clientSignatures: boolean;
  
  multipleCompanyProfiles: boolean;
  
  prioritySupport: boolean;
  support24_7: boolean;
  basicReports: boolean;
  advancedReports: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  FREE: {
    invoiceLimit: 3,
    basicTemplates: true,
    advancedTemplates: false,
    premiumTemplates: false,
    customLogo: false,
    multipleLogos: false,
    removeWatermark: false,
    emailSharing: true,
    whatsappSharing: true,
    paymentTracking: true,
    taxCompliance: false,
    advancedAnalytics: false,
    clientSignatures: false,
    multipleCompanyProfiles: false,
    prioritySupport: false,
    support24_7: false,
    basicReports: true,
    advancedReports: false,
  },
  ESSENTIALS: {
    invoiceLimit: 10,
    basicTemplates: true,
    advancedTemplates: true,
    premiumTemplates: false,
    customLogo: true,
    multipleLogos: false,
    removeWatermark: true,
    emailSharing: true,
    whatsappSharing: true,
    paymentTracking: true,
    taxCompliance: true,
    advancedAnalytics: false,
    clientSignatures: true,
    multipleCompanyProfiles: false,
    prioritySupport: true,
    support24_7: false,
    basicReports: true,
    advancedReports: false,
  },
  PREMIUM: {
    invoiceLimit: -1,
    basicTemplates: true,
    advancedTemplates: true,
    premiumTemplates: true,
    customLogo: true,
    multipleLogos: true,
    removeWatermark: true,
    emailSharing: true,
    whatsappSharing: true,
    paymentTracking: true,
    taxCompliance: true,
    advancedAnalytics: true,
    clientSignatures: true,
    multipleCompanyProfiles: true,
    prioritySupport: true,
    support24_7: true,
    basicReports: true,
    advancedReports: true,
  },
};


export const getPlanFeatures = (plan: PlanType | string): PlanFeatures => {
  const planType = (plan?.toUpperCase() || 'FREE') as PlanType;
  return PLAN_FEATURES[planType] || PLAN_FEATURES.FREE;
};


export const hasFeatureAccess = (
  plan: PlanType | string,
  feature: keyof PlanFeatures
): boolean => {
  const features = getPlanFeatures(plan);
  return features[feature] as boolean;
};


export const canCreateInvoice = (
  plan: PlanType | string,
  invoicesUsed: number
): boolean => {
  const features = getPlanFeatures(plan);
  if (features.invoiceLimit === -1) return true;
  return invoicesUsed < features.invoiceLimit;
};


export const getRemainingInvoices = (
  plan: PlanType | string,
  invoicesUsed: number
): number => {
  const features = getPlanFeatures(plan);
  if (features.invoiceLimit === -1) return -1;
  return Math.max(0, features.invoiceLimit - invoicesUsed);
};

export const needsWatermark = (plan: PlanType | string): boolean => {
  return !hasFeatureAccess(plan, 'removeWatermark');
};

export const getAvailableTemplates = (plan: PlanType | string): string[] => {
  const features = getPlanFeatures(plan);
  const templates: string[] = [];
  
  if (features.basicTemplates) {
    templates.push('default', 'simple');
  }
  
  if (features.advancedTemplates) {
    templates.push('standard', 'compact');
  }
  
  if (features.premiumTemplates) {
    templates.push('professional', 'modern', 'elegant');
  }
  
  return templates;
};

export const isTemplateAvailable = (
  plan: PlanType | string,
  template: string
): boolean => {
  const availableTemplates = getAvailableTemplates(plan);
  return availableTemplates.includes(template);
};

export const getUpgradeMessage = (
  feature: keyof PlanFeatures,
  currentPlan: PlanType | string
): string => {
  const planType = (currentPlan?.toUpperCase() || 'FREE') as PlanType;
  
  const messages: Record<string, string> = {
    advancedTemplates: 'Upgrade to Essentials to access advanced templates',
    premiumTemplates: 'Upgrade to Premium to access premium templates',
    customLogo: 'Upgrade to Essentials to upload custom logos',
    multipleLogos: 'Upgrade to Premium to use multiple logos',
    taxCompliance: 'Upgrade to Essentials for tax compliance tools',
    advancedAnalytics: 'Upgrade to Premium for advanced analytics',
    clientSignatures: 'Upgrade to Essentials for client signature features',
    multipleCompanyProfiles: 'Upgrade to Premium to manage multiple company profiles',
    prioritySupport: 'Upgrade to Essentials for priority support',
    support24_7: 'Upgrade to Premium for 24/7 support',
    advancedReports: 'Upgrade to Premium for advanced reports',
  };
  
  return messages[feature] || `Upgrade your plan to access this feature`;
};

export const getRequiredPlan = (feature: keyof PlanFeatures): PlanType => {
  if (PLAN_FEATURES.ESSENTIALS[feature]) {
    return 'ESSENTIALS';
  }
  
  if (PLAN_FEATURES.PREMIUM[feature]) {
    return 'PREMIUM';
  }
  
  return 'FREE';
};
