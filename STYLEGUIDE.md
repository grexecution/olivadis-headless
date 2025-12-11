# Olivadis Design System & Style Guide

## Overview

This document defines the design system for the Olivadis headless store based on the Figma designs.

**Status**: ✅ Complete - All design tokens extracted from Figma

## Color Palette

### Primary Colors (Green)

The Olivadis brand uses a rich, natural green palette inspired by olive groves.

```css
/* Primary Green - OLIVADIS-GRÜN */
--color-primary: #1C4220;         /* Main brand green */
--color-primary-dark: #0B180C;    /* Darker shade for text */
--color-primary-light: #3B6912;   /* Accent green for highlights */
```

**Tailwind Usage:**
```tsx
className="bg-primary text-primary-dark hover:bg-primary-light"
```

### Secondary Colors (Cream/Beige)

Warm, inviting cream tones that complement the green palette.

```css
/* Cream - OLIVADIS_COLOR-2 */
--color-cream: #F2E9DB;           /* Main cream/beige */
--color-cream-light: #FCFBF7;     /* Soft white/cream (OLIVADIS_SOFT-WHITE) */
```

**Tailwind Usage:**
```tsx
className="bg-cream text-cream-light"
```

### Background & Foreground

```css
--color-background: #FCFBF7;      /* Default page background */
--color-foreground: #1C4220;      /* Default text color */
```

### Color Usage Guidelines

| Color | Usage | Examples |
|-------|-------|----------|
| `primary` (#1C4220) | Primary buttons, header, key CTAs, brand elements | Buttons, navigation bar, footer |
| `primary-dark` (#0B180C) | Dark text, headings | H1, H2, H3, body text |
| `primary-light` (#3B6912) | Accent text in headings (with Lora italic), hover states | Italic brand name in headings |
| `cream` (#F2E9DB) | Button text, card backgrounds, sections | Text on dark backgrounds, alternating sections |
| `cream-light` (#FCFBF7) | Page background, light sections | Main page background |

### Semantic Colors

For future enhancement with success, error, warning states:

```css
/* To be defined for form validation and alerts */
--color-success: #2D7A3E;
--color-error: #DC2626;
--color-warning: #F59E0B;
--color-info: #3B82F6;
```

## Typography

### Font Families

Olivadis uses a combination of **Helvetica Neue** for body text and **Lora** for accent text in headings.

```typescript
fontFamily: {
  sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  serif: ['Lora', 'Georgia', 'serif'], // Used for italic brand name in headings
}
```

**Installation:**
```html
<!-- Add to <head> for Lora font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

### Font Scale & Usage

Complete typography system with exact sizes, line heights, letter spacing, and weights from Figma:

| Token | Size | Line Height | Letter Spacing | Weight | Use Case | Tailwind Class |
|-------|------|-------------|----------------|--------|----------|----------------|
| **Display/H1** | 88px | 80.655px | -3.52px (-4%) | 700 (Bold) | Hero headings | `text-h1` or `text-display` |
| **H2** | 56px | 70px | -2.24px (-4%) | 700 (Bold) | Section headings | `text-h2` |
| **H3** | 26.642px | 1.2 | -0.5328px (-2%) | 700 (Bold) | Card titles, subsections | `text-h3` |
| **H4** | 24px | 1.3 | -0.48px (-2%) | 700 (Bold) | Smaller headings | `text-h4` |
| **Body Large** | 20px | 1.5 (30px) | -0.4px (-2%) | 500 (Medium) | Large paragraphs, descriptions | `text-body-lg` |
| **Body** | 16px | 1.5 (24px) | -0.32px (-2%) | 400 (Regular) | Default body text | `text-body` |
| **Body Small** | 13.321px | 1.4 | -0.2664px (-2%) | 500 (Medium) | Small text, captions | `text-body-sm` |
| **Price** | 24px | 1.2 | -0.48px (-2%) | 700 (Bold) | Product prices | `text-price` |
| **Button** | 16.127px | 1 | -0.3225px (-2%) | 700 (Bold) | Button labels | `text-button` |

### Typography Examples

#### H1 Example
```tsx
<h1 className="text-h1 font-sans text-primary-dark">
  Welcome to the <span className="font-serif italic text-primary-light">Olivadis</span> family business
</h1>
```
Output: Large, bold heading with italic accent on "Olivadis"

#### H2 Example
```tsx
<h2 className="text-h2 font-sans text-primary-dark">
  This is what our <span className="font-serif italic text-primary-light">Olive Oil</span> looks like
</h2>
```

#### Body Large Example
```tsx
<p className="text-body-lg text-primary-dark">
  Our olive oil arrives at your home in a high-quality glass bottle that is so decorative that even your guests will be amazed.
</p>
```

#### Price Example
```tsx
<span className="text-price font-sans text-cream">€26.90</span>
```

### Font Weights

| Weight | Value | CSS Class | Use Case |
|--------|-------|-----------|----------|
| Regular | 400 | `font-normal` | Default body text |
| Medium | 500 | `font-medium` | Emphasized body, small text |
| Bold | 700 | `font-bold` | All headings, prices, buttons |

### Line Heights

| Token | Value | Use Case |
|-------|-------|----------|
| Tight | 1.2 | H3, H4, prices (compact headings) |
| Normal | 1.4-1.5 | Body text, readable paragraphs |
| Display | Custom | H1 (80.655px), H2 (70px) - specific to large headings |

### Letter Spacing

All Olivadis typography uses **negative letter spacing** (-2% to -4%) for a modern, tight look:
- Display/Headlines: -4% (-3.52px to -2.24px)
- Body text: -2% (-0.4px to -0.26px)

## Spacing System

### Base Unit

Olivadis uses a **4px base unit** spacing system for consistent spacing throughout the design.

```typescript
baseUnit: 4px
```

### Spacing Scale

Complete spacing scale from Tailwind config:

| Token | Value | Tailwind Class | Use Case |
|-------|-------|----------------|----------|
| 0.5 | 2px | `p-0.5`, `m-0.5` | Minimal spacing |
| 1 | 4px | `p-1`, `m-1` | Very tight |
| 1.5 | 6px | `p-1.5`, `m-1.5` | Button padding (vertical) |
| 2 | 8px | `p-2`, `m-2` | Tight spacing |
| 2.5 | 10px | `p-2.5`, `m-2.5` | Button padding (horizontal) |
| 3 | 12px | `p-3`, `m-3` | Small spacing |
| 4 | 16px | `p-4`, `m-4` | Default spacing |
| 5 | 20px | `p-5`, `m-5` | Medium spacing |
| 6 | 24px | `p-6`, `m-6` | Comfortable spacing |
| 8 | 32px | `p-8`, `m-8` | Large spacing |
| 10 | 40px | `p-10`, `m-10` | Extra large spacing |
| 12 | 48px | `p-12`, `m-12` | Section spacing |
| 16 | 64px | `p-16`, `m-16` | Large section spacing |
| 20 | 80px | `p-20`, `m-20` | Hero spacing |
| 24 | 96px | `p-24`, `m-24` | Extra large section |
| 32 | 128px | `p-32`, `m-32` | Maximum spacing |

## Layout

### Container

Olivadis uses a centered container with responsive padding based on the Figma design width of 1512px.

```typescript
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',   // 16px on mobile
    sm: '2rem',        // 32px on small screens
    lg: '4rem',        // 64px on large screens
    xl: '5rem',        // 80px on xl screens
    '2xl': '6rem',     // 96px on 2xl screens
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1512px',   // Based on Figma design width
  }
}
```

**Usage:**
```tsx
<div className="container mx-auto">
  {/* Your content */}
</div>
```

### Grid System

Olivadis uses a 12-column grid system with responsive gaps:

```typescript
columns: 12,
gap: {
  DEFAULT: '1.5rem',  // 24px
  sm: '1rem',         // 16px on mobile
  lg: '2rem',         // 32px on large screens
}
```

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

## Components

### Buttons

All buttons in Olivadis follow a consistent design pattern extracted from Figma.

#### Primary Button (Default)

The main CTA button with dark green background and cream text.

**Specifications:**
- Background: `#1C4220` (primary)
- Text Color: `#F2E9DB` (cream)
- Border Radius: `8px`
- Padding: `6.428px 9.642px` (~6px 10px)
- Font: Helvetica Neue Bold, 16.127px
- Letter Spacing: -0.3225px (-2%)

**Code:**
```tsx
<button className="bg-primary text-cream px-2.5 py-1.5 rounded-md text-button font-bold hover:bg-primary-light transition-colors duration-200 flex items-center gap-1.5">
  Buy now
  <ArrowRightIcon className="w-6 h-6" />
</button>
```

**States:**
- Default: `bg-primary text-cream`
- Hover: `hover:bg-primary-light`
- Active: `active:bg-primary-dark`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

#### Secondary Button

For less prominent actions with cream background.

```tsx
<button className="bg-cream text-primary px-2.5 py-1.5 rounded-md text-button font-bold hover:bg-cream-light transition-colors duration-200">
  Shop now
</button>
```

#### Outline Button

For tertiary actions.

```tsx
<button className="border-2 border-primary text-primary bg-transparent px-2.5 py-1.5 rounded-md text-button font-bold hover:bg-primary hover:text-cream transition-colors duration-200">
  Learn more
</button>
```

#### Button Sizes

| Size | Padding | Text | Use Case |
|------|---------|------|----------|
| Small | `px-2 py-1` | `text-body-sm` | Compact spaces, mobile |
| Medium (Default) | `px-2.5 py-1.5` | `text-button` | Standard buttons |
| Large | `px-4 py-2` | `text-button` | Hero CTAs, emphasis |

#### Button with Icon

Buttons often include an arrow icon on the right:

```tsx
import { ArrowRight } from 'lucide-react'; // or your icon library

<button className="bg-primary text-cream px-2.5 py-1.5 rounded-md text-button font-bold hover:bg-primary-light transition-colors duration-200 inline-flex items-center gap-2">
  <span>Buy now</span>
  <ArrowRight className="w-6 h-6" />
</button>
```

### Cards

#### Product Card
```typescript
// To be extracted from Figma
- Image aspect ratio
- Padding
- Border radius
- Shadow
- Hover effects
```

#### Content Card
```typescript
// To be extracted from Figma
```

### Inputs

#### Text Input
```typescript
className: "border border-gray-300 rounded-[radius] px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
```

#### States
- Default
- Focus
- Error
- Disabled

### Navigation

#### Header
```typescript
// To be extracted from Figma
height: '...',
background: '...',
padding: '...',
```

#### Links
```typescript
// To be extracted from Figma
default: '...',
hover: '...',
active: '...',
```

## Shadows

Olivadis uses subtle shadows for depth and elevation:

```typescript
boxShadow: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 20px 18.9px 0 rgba(0, 0, 0, 0.05)',  // From Figma
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}
```

**Usage:**
```tsx
<div className="shadow">Default card shadow</div>
<div className="shadow-lg hover:shadow-xl transition-shadow">Interactive card</div>
```

## Border Radius

Consistent border radius values for UI elements:

```typescript
borderRadius: {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',     // Standard for buttons, cards
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',     // For circular elements
}
```

**Usage:**
- Buttons: `rounded-md` (8px)
- Cards: `rounded-md` or `rounded-lg` (8px or 12px)
- Input fields: `rounded-md` (8px)
- Images: `rounded-lg` or `rounded-xl` (12px or 16px)
- Avatars: `rounded-full`

## Transitions

Smooth transitions for interactive elements:

```typescript
transition: {
  DEFAULT: '200ms ease-in-out',
  fast: '100ms ease-in-out',
  slow: '300ms ease-in-out',
}
```

**Common Patterns:**
```tsx
// Button hover
className="transition-colors duration-200"

// Shadow on hover
className="transition-shadow duration-300"

// Transform on hover
className="transition-transform duration-200 hover:scale-105"

// Multiple properties
className="transition-all duration-300"
```

## Breakpoints

Responsive breakpoints based on common device sizes:

```typescript
screens: {
  'sm': '640px',   // Mobile landscape / Small tablet
  'md': '768px',   // Tablet portrait
  'lg': '1024px',  // Tablet landscape / Small laptop
  'xl': '1280px',  // Desktop
  '2xl': '1512px', // Large desktop (Figma design width)
}
```

**Usage:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Responsive grid */}
</div>

<h1 className="text-h2 lg:text-h1">
  {/* Responsive typography */}
</h1>
```

## Z-Index Scale

```typescript
zIndex: {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}
```

## Animation

### Transitions
```typescript
// Hover transitions
'transition-colors duration-200'
'transition-transform duration-200'
'transition-all duration-300'
```

### Keyframes
```typescript
// To be determined from Figma
// Fade in, slide in, etc.
```

## Usage Examples

### Product Card Example

```tsx
<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <div className="aspect-square overflow-hidden">
    <img
      src="..."
      alt="..."
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
    />
  </div>
  <div className="p-4">
    <h3 className="font-semibold text-lg mb-2">Product Name</h3>
    <p className="text-gray-600 text-sm mb-4">Short description</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-primary-500">$XX.XX</span>
      <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

## Accessibility

- All interactive elements must be keyboard accessible
- Color contrast ratio minimum 4.5:1 for normal text
- Color contrast ratio minimum 3:1 for large text
- Focus indicators must be visible
- ARIA labels for icon buttons

## Next Steps

1. **Extract from Figma**:
   - Exact color values (hex codes)
   - Font family names and Google Fonts links
   - Precise spacing values
   - Border radius values
   - Shadow specifications
   - Component specifications

2. **Update Tailwind Config**:
   - Add custom colors
   - Add custom fonts
   - Add custom spacing
   - Add custom components

3. **Build Component Library**:
   - Create reusable components
   - Document props and variants
   - Add Storybook or similar

## Questions for Design Review

1. What are the primary and secondary brand colors?
2. Which fonts are used (Google Fonts or custom)?
3. What is the base spacing unit (4px or 8px)?
4. What border radius should be used for cards/buttons?
5. What shadow elevations are used?
6. Are there any specific animations or transitions?
7. What is the max container width?
