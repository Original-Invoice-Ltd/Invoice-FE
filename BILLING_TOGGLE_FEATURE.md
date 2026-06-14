# Billing Toggle Feature

## Overview
The pricing page now supports dynamic billing cycle switching between monthly and annual pricing.

## Implementation Details

### 1. Updated Data Structure

**File:** `src/data/pricingPlans.ts`

The pricing data structure was updated to support both monthly and yearly pricing:

```typescript
export interface PricingPlanData {
    pricing: {
        monthly?: {
            price: string;
            period: string;
        };
        yearly: {
            price: string;
            period: string;
            savings?: string;
        };
    };
}
```

**Current Pricing:**

| Plan | Monthly | Yearly | Annual Savings |
|------|---------|--------|----------------|
| Free Trial | N/A | ₦0 | N/A |
| Essentials | ₦2,000/month | ₦24,000/year | ₦9,600 (40% off) |
| Premium | ₦10,000/month | ₦60,000/year | ₦60,000 (50% off) |

**Calculation Breakdown:**
- Essentials Monthly: ₦2,000 × 12 = ₦24,000 → Annual: ₦24,000 (Saves: ₦9,600 from ₦33,600 monthly total)
- Premium Monthly: ₦10,000 × 12 = ₦120,000 → Annual: ₦60,000 (Saves: ₦60,000 or 50%)

### 2. State Management

**File:** `src/app/pricing/page.tsx`

Added `billingCycle` state to track the selected billing period:

```typescript
const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
```

- Default: `"yearly"` (most common selection)
- Type: `"monthly" | "yearly"`

### 3. Functional Toggle

The toggle now:
- ✅ Updates `billingCycle` state when clicked
- ✅ Changes text color to indicate active selection
- ✅ Shows "Save up to 17%" badge only on yearly
- ✅ Updates all pricing cards dynamically

```typescript
<input 
    type="checkbox" 
    checked={billingCycle === "yearly"}
    onChange={(e) => setBillingCycle(e.target.checked ? "yearly" : "monthly")}
/>
```

### 4. Dynamic Price Display

The `getPricingPlans()` function now:
1. Checks the current `billingCycle` state
2. Selects appropriate pricing (monthly or yearly)
3. Returns formatted plan data with correct price, period, and savings

```typescript
const pricing = billingCycle === "monthly" && planData.pricing.monthly 
    ? planData.pricing.monthly 
    : planData.pricing.yearly;
```

### 5. Subscription Integration

The `handleSubscribe` function now passes the selected billing cycle to the payment gateway:

```typescript
await initializeTransactionWithPlan(
    plan,
    billingCycle, // ← Dynamic billing cycle
    ["card", "bank_transfer"],
    callbackUrl
);
```

## User Experience

### Visual Feedback
- **Active selection** appears in black (#000000)
- **Inactive selection** appears in gray (#7D7F81)
- **Savings badge** only shows when "Annually" is selected
- **Smooth transition** between price changes

### Behavior
1. User lands on page → Toggle is set to "Annually" by default
2. User clicks toggle → Billing cycle changes
3. All three pricing cards update simultaneously
4. Toggle state persists through user session
5. When user clicks "Get Started" or "Start Premium", the selected billing cycle is sent to the payment gateway

## Benefits

### For Users
- **Clear pricing** for both monthly and annual options
- **Instant comparison** between billing cycles
- **Visual savings indicator** encourages annual subscriptions
- **No page reload** needed

### For Business
- **Encourages annual subscriptions** (shown by default)
- **Transparent pricing** builds trust
- **Flexible payment options** increase conversions
- **Higher customer lifetime value** from annual plans

## Testing Checklist

- [ ] Toggle switches between monthly and yearly
- [ ] Prices update correctly on all cards
- [ ] Essentials monthly shows ₦2,000/month
- [ ] Essentials yearly shows ₦24,000/year with "Save ₦9,600"
- [ ] Premium monthly shows ₦10,000/month
- [ ] Premium yearly shows ₦60,000/year with "Save ₦60,000"
- [ ] Free trial price remains ₦0
- [ ] Active selection is highlighted in black
- [ ] Inactive selection is grayed out
- [ ] Savings badge only shows on yearly
- [ ] Works on mobile carousel
- [ ] Works on desktop grid
- [ ] Selected billing cycle is passed to payment gateway
- [ ] Toggle state is maintained during session

## Future Enhancements

1. **Persist selection** in localStorage across sessions
2. **URL parameter** support (e.g., `?billing=monthly`)
3. **A/B testing** different default selections
4. **Regional pricing** based on user location
5. **Promotional pricing** for limited time offers
6. **Compare mode** showing monthly vs yearly side-by-side
7. **Custom billing cycles** (quarterly, bi-annually)
8. **Team/volume discounts** for larger plans
