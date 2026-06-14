# Pricing Component Architecture

## Overview
The pricing page has been refactored to follow the DRY (Don't Repeat Yourself) principle by extracting the repeated pricing card markup into a reusable component.

## File Structure

```
src/
├── components/
│   └── pricing/
│       ├── PricingCard.tsx       # Reusable pricing card component
│       └── README.md              # This file
├── data/
│   └── pricingPlans.ts           # Centralized pricing data configuration
└── app/
    └── pricing/
        └── page.tsx              # Main pricing page (now uses the component)
```

## Components

### PricingCard Component
**Location:** `src/components/pricing/PricingCard.tsx`

A reusable component that renders a single pricing plan card.

**Props:**
- `plan`: PricingPlan object containing:
  - `id`: Unique identifier
  - `name`: Plan name (e.g., "Free Trial", "Essentials", "Premium")
  - `price`: Display price (e.g., "₦0", "₦24,000")
  - `period`: Optional billing period (e.g., "/year")
  - `savings`: Optional savings message (e.g., "Save ₦9,600")
  - `description`: Plan description shown below the button
  - `features`: Array of feature objects with `text` property
  - `buttonText`: CTA button text
  - `buttonAction`: Function to execute when button is clicked
  - `isLoading`: Boolean to show loading state
- `isMobile`: Boolean to apply mobile-specific styling

**Usage:**
```tsx
<PricingCard plan={planData} isMobile={false} />
```

## Data Configuration

### Pricing Plans Data
**Location:** `src/data/pricingPlans.ts`

Centralized configuration file containing all pricing plan information.

**Structure:**
```typescript
export interface PricingPlanData {
    id: string;
    name: string;
    price: string;
    period?: string;
    savings?: string;
    description: string;
    features: PricingFeature[];
    buttonText: string;
    planType: "FREE" | "ESSENTIALS" | "PREMIUM";
}

export const pricingPlansData: PricingPlanData[];
```

**Benefits:**
- Single source of truth for all pricing information
- Easy to update pricing, features, or add new plans
- Type-safe configuration
- Can be easily extended to support different billing cycles or regional pricing

## Implementation in Pricing Page

The pricing page (`src/app/pricing/page.tsx`) now:

1. **Imports** the reusable component and data:
   ```tsx
   import PricingCard from "@/components/pricing/PricingCard";
   import { pricingPlansData } from "@/data/pricingPlans";
   ```

2. **Maps data to components** with dynamic actions:
   ```tsx
   const getPricingPlans = (): PricingPlan[] => {
       return pricingPlansData.map(planData => ({
           ...planData,
           buttonAction: planData.planType === "FREE" 
               ? handleFreeTrial 
               : () => handleSubscribe(planData.planType),
           isLoading: isLoading === planData.planType
       }));
   };
   ```

3. **Renders cards** using `.map()`:
   ```tsx
   {/* Mobile Carousel */}
   {pricingPlans.map((plan) => (
       <div key={plan.id} className="...">
           <PricingCard plan={plan} isMobile={true} />
       </div>
   ))}

   {/* Desktop Layout */}
   {pricingPlans.map((plan) => (
       <PricingCard key={plan.id} plan={plan} isMobile={false} />
   ))}
   ```

## Benefits of This Architecture

### 1. **Maintainability**
- Changes to pricing card layout are made in one place
- Updating pricing information is as simple as editing the data array
- No need to hunt through JSX for each occurrence

### 2. **Consistency**
- All pricing cards use the same component, ensuring visual consistency
- Changes automatically apply to both mobile and desktop layouts

### 3. **Scalability**
- Easy to add new pricing plans by adding entries to the data array
- Can support different billing cycles (monthly/yearly) without duplicating code
- Can be extended for A/B testing different pricing structures

### 4. **Testability**
- Component can be tested in isolation
- Data can be mocked easily for testing
- Business logic separated from presentation

### 5. **Type Safety**
- TypeScript interfaces ensure data structure consistency
- Compile-time checks prevent missing required fields

## Adding a New Pricing Plan

To add a new pricing plan:

1. **Add plan data** to `src/data/pricingPlans.ts`:
   ```typescript
   {
       id: "enterprise",
       name: "Enterprise",
       price: "₦250,000",
       period: "/year",
       savings: "Save ₦100,000",
       description: "For large organizations",
       features: [
           { text: "Unlimited everything" },
           { text: "Priority support" },
           // ... more features
       ],
       buttonText: "Contact Sales",
       planType: "ENTERPRISE"
   }
   ```

2. **Update types** if needed (e.g., add "ENTERPRISE" to `planType` union)

3. **Handle button action** in pricing page if it requires special logic

That's it! The component will automatically render the new plan.

## Updating Existing Plans

To update pricing or features:

1. Open `src/data/pricingPlans.ts`
2. Modify the relevant plan object
3. Save the file

Changes will automatically reflect on both mobile and desktop layouts.
