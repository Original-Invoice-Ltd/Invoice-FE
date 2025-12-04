# Design Document

## Overview

The signup page container is a responsive layout component that provides the structural foundation for the two-step user registration flow. It implements a split-panel design pattern with an illustration panel for branding and a form panel for user input, adapting seamlessly across desktop, tablet, and mobile viewports.

The container follows a composition-based architecture where child components (forms, illustrations, logos) are rendered within a flexible layout structure. The design prioritizes mobile-first responsive behavior, accessibility, and maintainability through clear separation of concerns.

## Architecture

### Component Hierarchy

```
SignUpContainer
├── IllustrationPanel (desktop only)
│   └── LeftIllustrationPanel
└── FormPanel
    ├── Logo
    └── [Child Form Components]
        ├── SignUpForm
        └── SetupAccountForm
```

### Layout Strategy

The container uses CSS Flexbox for responsive layout management:

- **Desktop (≥1024px)**: Horizontal flex layout with two equal-width panels
- **Mobile/Tablet (<1024px)**: Vertical flex layout with only the form panel visible

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1023px (sm to lg)
- **Desktop**: ≥ 1024px (lg)

## Components and Interfaces

### SignUpContainer Component

The main container component that orchestrates the layout structure.

**Props Interface:**
```typescript
interface SignUpContainerProps {
  children: React.ReactNode;
  showIllustration?: boolean; // Default: true
  className?: string; // Additional custom classes
}
```

**Responsibilities:**
- Manage responsive layout switching
- Control illustration panel visibility
- Provide consistent spacing and dimensions
- Ensure proper content centering

### IllustrationPanel Component

A wrapper component for the left-side branding panel.

**Props Interface:**
```typescript
interface IllustrationPanelProps {
  children: React.ReactNode;
  className?: string;
}
```

**Styling Specifications:**
- Width: 50% of container on desktop
- Background: Gradient or image from LeftIllustrationPanel
- Display: Hidden on mobile/tablet
- Dimensions: 705px × 984px (fixed inner content)

### FormPanel Component

A wrapper component for the right-side form area.

**Props Interface:**
```typescript
interface FormPanelProps {
  children: React.ReactNode;
  maxWidth?: string; // Default: '28rem' (448px)
  className?: string;
}
```

**Styling Specifications:**
- Width: 50% on desktop, 100% on mobile/tablet
- Background: #FFFFFF (white)
- Max content width: 448px (28rem)
- Padding: Responsive (1rem mobile, 1.5rem tablet, 3rem desktop)
- Alignment: Center both horizontally and vertically

## Data Models

### Layout Configuration

```typescript
interface LayoutConfig {
  containerMaxWidth: string; // '1440px'
  containerMinHeight: string; // '1024px'
  formPanelMaxWidth: string; // '448px'
  breakpoints: {
    mobile: number; // 640
    tablet: number; // 1024
  };
  padding: {
    mobile: string; // '1rem'
    tablet: string; // '1.5rem'
    desktop: string; // '3rem'
  };
}
```

### Responsive State

```typescript
interface ResponsiveState {
  viewport: 'mobile' | 'tablet' | 'desktop';
  showIllustration: boolean;
  panelLayout: 'single' | 'split';
}
```

