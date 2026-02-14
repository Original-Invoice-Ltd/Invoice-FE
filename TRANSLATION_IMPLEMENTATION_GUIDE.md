# Translation & Currency Formatting Implementation Guide

## Overview
This guide provides a comprehensive approach to implementing translations and proper currency formatting across the Original Invoice application.

## Current State Analysis

### Translation System
- **i18n Library**: `react-i18next` is configured in `src/lib/i18ns.ts`
- **Supported Languages**: English (EN), Yoruba (YO), Igbo (IG), Hausa (HA)
- **Context Provider**: `LanguageContext` in `src/contexts/LanguageContext.tsx`
- **Translation Keys**: Extensive translation keys already defined for all languages

### Currency Formatting
- **Current Implementation**: Mix of inline formatting and `ApiClient.formatCurrency()`
- **New Utility**: Created `src/lib/currencyFormatter.ts` with comprehensive formatting functions
- **Default Currency**: Nigerian Naira (₦)

## Implementation Steps

### Step 1: Import Translation Hook
In every component that displays text, import and use the translation hook:

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <div>{t('translation_key')}</div>;
};
```

### Step 2: Replace Hardcoded Text
Replace all hardcoded English text with translation keys:

**Before:**
```typescript
<button>Create Invoice</button>
```

**After:**
```typescript
<button>{t('create_invoice')}</button>
```

### Step 3: Use Currency Formatter
Replace all inline currency formatting with the new utility:

**Before:**
```typescript
<span>₦{amount.toLocaleString()}</span>
```

**After:**
```typescript
import { formatCurrency } from '@/lib/currencyFormatter';

<span>{formatCurrency(amount)}</span>
```

## Currency Formatting Functions

### `formatCurrency(amount, options?)`
Main currency formatting function with full control:

```typescript
formatCurrency(1234.56) // "₦1,234.56"
formatCurrency(1234.56, { currency: 'USD' }) // "$1,234.56"
formatCurrency(1234.56, { showSymbol: false }) // "1,234.56"
formatCurrency(1234.56, { minimumFractionDigits: 0 }) // "₦1,235"
```

### `formatCurrencyCompact(amount, options?)`
For compact display in charts and dashboards:

```typescript
formatCurrencyCompact(1234) // "₦1.2k"
formatCurrencyCompact(1234567) // "₦1.2M"
```

### `formatInvoicePrice(amount)`
Specifically for invoice amounts (always 2 decimals):

```typescript
formatInvoicePrice(1234.5) // "₦1,234.50"
```

### `formatChartPrice(amount)`
For chart axis labels:

```typescript
formatChartPrice(500000) // "₦500k"
```

## Common Translation Keys

### Navigation & Actions
- `home`, `features`, `about_us`, `pricing`, `contact_us`
- `get_started`, `sign_in`, `sign_up`, `dashboard`
- `create_invoice`, `edit_invoice`, `delete_invoice`, `view_invoice`
- `save_changes`, `cancel`, `continue`, `back`

### Invoice Management
- `invoices`, `all_invoices`, `create_invoice`, `invoice_id`
- `client_name`, `due_date`, `amount`, `status`, `balance_due`
- `paid`, `pending`, `overdue`, `draft`

### Client Management
- `clients`, `add_client`, `all_clients`, `client_name`
- `company_name`, `email`, `phone_number`

### Products
- `products`, `add_product`, `product_name`, `category`
- `quantity`, `rate`, `amount`, `description_label`

### Reports & Analytics
- `total_invoiced`, `payments_received_total`, `outstanding_amount`
- `overdue_amount`, `reports_analytics`, `revenue_over_time`

### Settings
- `business_profile`, `personal_profile`, `tax_settings`
- `notification`, `security`, `language`, `plan_billing`

### Status Messages
- `loading`, `error`, `success`, `saving`, `updating`
- `failed_to_save`, `saved_successfully`

## Files Requiring Translation Updates

### High Priority (User-Facing Components)

1. **Dashboard Components**
   - `src/components/dashboardContent/index.tsx` ✓ (Already using translations)
   - `src/components/dashboardHeader/DashboardHeader.tsx` ✓ (Already using translations)
   - `src/components/dashboardSidebar/index.tsx` ✓ (Already using translations)

2. **Invoice Components**
   - `src/components/invoices/InvoiceList.tsx`
   - `src/components/invoice/InvoicePreview.tsx`
   - `src/components/invoiceCreation/ProductSelector.tsx`
   - `src/components/invoiceCreation/TaxSelector.tsx`
   - `src/app/dashboard/invoices/create/page.tsx`
   - `src/app/dashboard/invoices/edit/[id]/page.tsx`

3. **Client Management**
   - `src/components/clientManagement/ClientTable.tsx`
   - `src/components/clientManagement/AddClientModal.tsx`
   - `src/components/clientManagement/ClientsHeader.tsx`

4. **Product Management**
   - `src/components/productManagement/index.tsx`
   - `src/components/productManagement/AddProductModal.tsx` ✓ (Already using translations)

5. **Payment Components**
   - `src/components/paymentReceived/index.tsx` ✓ (Already using translations)
   - `src/components/paymentReceived/PaymentTable.tsx` ✓ (Already using translations)

6. **Reports**
   - `src/components/reports/index.tsx` ✓ (Already using translations)
   - `src/components/reports/RevenueChart.tsx` ✓ (Already using translations)
   - `src/components/reports/RecentInvoicesTable.tsx` ✓ (Already using translations)

7. **Settings Pages**
   - `src/app/dashboard/settings/business/page.tsx` ✓ (Already using translations)
   - `src/app/dashboard/settings/personal/page.tsx` ✓ (Already using translations)
   - `src/app/dashboard/settings/security/page.tsx` ✓ (Already using translations)
   - `src/app/dashboard/settings/notifications/page.tsx` ✓ (Already using translations)
   - `src/app/dashboard/settings/language/page.tsx` ✓ (Already using translations)
   - `src/app/dashboard/settings/tax/page.tsx` ✓ (Already using translations)

8. **Authentication**
   - `src/components/signIn/SignInForm.tsx`
   - `src/components/signUp/SignUpForm.tsx`
   - `src/components/forgetPassword/ForgotPasswordForm.tsx`

9. **Landing Page Components**
   - `src/app/page.tsx`
   - `src/components/header/index.tsx`
   - `src/components/footer/Footer.tsx`
   - `src/components/FAQ/index.tsx`
   - `src/components/testimonials/index.tsx`

10. **Customer Flow**
    - `src/components/customerFlow/Dashboard.tsx` ✓ (Already using translations)
    - `src/components/customer/CustomerNotificationsPanel.tsx` ✓ (Already using translations)

### Medium Priority (Supporting Components)

11. **Modals**
    - `src/components/modals/PaymentSuccessModal.tsx`
    - `src/components/modals/PaymentFailureModal.tsx`
    - `src/components/modals/SignOutModal.tsx`
    - `src/components/common/DeleteConfirmationModal.tsx` ✓ (Already using translations)

12. **Notifications**
    - `src/components/notifications/NotificationsPanel.tsx` ✓ (Already using translations)
    - `src/components/notifications/InvoiceLimitNotification.tsx`

## Currency Formatting Updates Needed

### Files with Inline Currency Formatting

1. **Reports Components**
   - `src/components/reports/index.tsx` - Update KPI cards
   - `src/components/reports/RevenueChart.tsx` - Update chart axis formatters
   - `src/components/reports/RecentInvoicesTable.tsx` - Update table cells

2. **Invoice Components**
   - All invoice template components in `src/components/invoiceTemplates/`
   - Invoice preview components

3. **Dashboard**
   - `src/components/dashboardContent/index.tsx` - Update stats display

4. **Pricing Pages**
   - `src/app/pricing/page.tsx`
   - `src/app/dashboard/pricing/page.tsx`

## Testing Checklist

After implementing translations and currency formatting:

- [ ] Test language switching between EN, YO, IG, HA
- [ ] Verify all text is translated (no hardcoded English)
- [ ] Check currency formatting consistency
- [ ] Test with different number formats (large numbers, decimals)
- [ ] Verify invoice PDFs show correct formatting
- [ ] Test on mobile devices
- [ ] Check RTL language support (if applicable)
- [ ] Verify form validation messages are translated
- [ ] Test error messages in all languages
- [ ] Check email templates (if applicable)

## Best Practices

1. **Always use translation keys** - Never hardcode user-facing text
2. **Use semantic key names** - `create_invoice` not `button_text_1`
3. **Keep keys organized** - Group related translations together
4. **Use currency formatter** - Never format currency inline
5. **Test all languages** - Don't assume translations are correct
6. **Handle plurals** - Use i18next plural features when needed
7. **Context matters** - Same word might need different translations in different contexts
8. **Keep formatting consistent** - Use the same formatter throughout

## Adding New Translation Keys

When adding new features, add translation keys to `src/lib/i18ns.ts`:

```typescript
const resources = {
  en: {
    translation: {
      // Add your new keys here
      my_new_feature: "My New Feature",
      my_new_button: "Click Me",
    }
  },
  yo: {
    translation: {
      my_new_feature: "Ẹ̀yà Tuntun Mi",
      my_new_button: "Tẹ Mi",
    }
  },
  // ... add for other languages
};
```

## Migration Strategy

### Phase 1: Core Components (Week 1)
- Dashboard and navigation
- Invoice list and creation
- Client management

### Phase 2: Secondary Features (Week 2)
- Reports and analytics
- Settings pages
- Product management

### Phase 3: Authentication & Landing (Week 3)
- Sign in/up flows
- Landing page
- Marketing pages

### Phase 4: Polish & Testing (Week 4)
- Fix any missed translations
- Test all languages thoroughly
- Update documentation

## Support & Resources

- **i18next Documentation**: https://www.i18next.com/
- **React i18next**: https://react.i18next.com/
- **Currency Formatter**: `src/lib/currencyFormatter.ts`
- **Translation Context**: `src/contexts/LanguageContext.tsx`
- **Translation Keys**: `src/lib/i18ns.ts`

## Notes

- The translation system is already set up and working
- Many components already use translations
- Focus on components that still have hardcoded text
- Currency formatting should be consistent across all components
- Test thoroughly with all supported languages
