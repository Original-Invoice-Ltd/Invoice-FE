import { useSubscription } from './useSubscription';
import { 
  getPlanFeatures, 
  hasFeatureAccess, 
  canCreateInvoice as checkCanCreateInvoice,
  getRemainingInvoices,
  needsWatermark,
  getAvailableTemplates,
  isTemplateAvailable,
  getUpgradeMessage,
  getRequiredPlan,
  PlanFeatures
} from '@/lib/planAccess';


export const usePlanAccess = () => {
  const { subscription, loading } = useSubscription();
  
  const currentPlan = subscription?.plan || 'FREE';
  const invoicesUsed = subscription?.invoicesUsed || 0;
  
  const features = getPlanFeatures(currentPlan);
  
  const hasAccess = (feature: keyof PlanFeatures): boolean => {
    return hasFeatureAccess(currentPlan, feature);
  };
  
  const canCreateInvoice = (): boolean => {
    return checkCanCreateInvoice(currentPlan, invoicesUsed);
  };
  
  const remainingInvoices = getRemainingInvoices(currentPlan, invoicesUsed);
  
  const showWatermark = needsWatermark(currentPlan);
  
  const availableTemplates = getAvailableTemplates(currentPlan);
  
  const canUseTemplate = (template: string): boolean => {
    return isTemplateAvailable(currentPlan, template);
  };
  
  const getFeatureUpgradeMessage = (feature: keyof PlanFeatures): string => {
    return getUpgradeMessage(feature, currentPlan);
  };
  
  const getFeatureRequiredPlan = (feature: keyof PlanFeatures) => {
    return getRequiredPlan(feature);
  };
  
  return {
    currentPlan,
    features,
    loading,
    hasAccess,
    canCreateInvoice,
    remainingInvoices,
    showWatermark,
    availableTemplates,
    canUseTemplate,
    getFeatureUpgradeMessage,
    getFeatureRequiredPlan,
    invoicesUsed,
    invoiceLimit: features.invoiceLimit,
  };
};
