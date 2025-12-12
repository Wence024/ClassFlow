# HMIS UI/UX Design System

Based on the Marketim dashboard analysis, this document outlines the comprehensive design system for the Hospital Management Information System.

## 1. Color System

### Primary Color Palette

```css
/* Primary Colors - Updated with subtle, refined palette */
--primary: #4F46E5;        /* Softer indigo, less bold */
--primary-foreground: #FFFFFF;
--secondary: #F1F5F9;      /* Very subtle blue-gray */
--secondary-foreground: #334155;
--muted: #F1F5F9;          /* Subtle blue-gray muted */
--muted-foreground: #64748B; /* Softer muted text */
--accent: #E0E7FF;         /* Light blue accent with subtle gradient */
--accent-foreground: #3730A3;
--destructive: #FEE2E2;    /* Soft red background */
--destructive-foreground: #DC2626;
--border: #E2E8F0;         /* Softer border */
--input: #E2E8F0;
--ring: #818CF8;           /* Softer ring color */
--chart-1: #818CF8;        /* Softer purple-blue */
--chart-2: #A5B4FC;        /* Lighter blue */
--chart-3: #C7D2FE;        /* Light purple */
--chart-4: #DDD6FE;        /* Light purple */
--chart-5: #E9D5FF;        /* Light purple */
```

### HMIS Light Mode

```css
/* Light Mode with subtle blue tint and refined colors */
--background: #F8FAFC;     /* Softer light background with subtle blue tint */
--foreground: #1E293B;     /* Softer dark text */
--card: #FFFFFF;           /* Pure white cards */
--card-foreground: #1E293B;
--popover: #FFFFFF;
--popover-foreground: #1E293B;
--primary: #4F46E5;        /* Softer indigo, less bold */
--primary-foreground: #FFFFFF;
--secondary: #F1F5F9;      /* Very subtle blue-gray */
--secondary-foreground: #334155;
--muted: #F1F5F9;          /* Subtle blue-gray muted */
--muted-foreground: #64748B; /* Softer muted text */
--accent: #E0E7FF;         /* Light blue accent with subtle gradient */
--accent-foreground: #3730A3;
--destructive: #FEE2E2;    /* Soft red background */
--destructive-foreground: #DC2626;
--border: #E2E8F0;         /* Softer border */
--input: #E2E8F0;
--ring: #818CF8;           /* Softer ring color */
--sidebar: #F8FAFC;
--sidebar-foreground: #1E293B;
--sidebar-primary: #4F46E5;
--sidebar-primary-foreground: #FFFFFF;
--sidebar-accent: #F1F5F9;
--sidebar-accent-foreground: #1E293B;
--sidebar-border: #E2E8F0;
--sidebar-ring: #818CF8;
```

### HMIS Dark Mode

```css
/* Dark Mode with improved contrast and consistency */
--background: #0F172A;     /* Dark blue-gray background */
--foreground: #F1F5F9;     /* Light gray text for dark mode */
--card: #1E293B;           /* Dark blue-gray card background */
--card-foreground: #F1F5F9;
--popover: #1E293B;
--popover-foreground: #F1F5F9;
--primary: #818CF8;        /* Lighter blue for dark mode */
--primary-foreground: #FFFFFF;
--secondary: #334155;      /* Darker blue-gray secondary */
--secondary-foreground: #E2E8F0;
--muted: #334155;          /* Dark blue-gray muted */
--muted-foreground: #94A3B8; /* Light muted text */
--accent: #334155;         /* Dark blue-gray accent */
--accent-foreground: #E2E8F0;
--destructive: #FECACA;    /* Light red for dark mode */
--destructive-foreground: #F87171;
--border: #334155;         /* Dark blue-gray border */
--input: #334155;
--ring: #818CF8;           /* Primary blue for focus rings */
--sidebar: #0F172A;
--sidebar-foreground: #F1F5F9;
--sidebar-primary: #818CF8;
--sidebar-primary-foreground: #FFFFFF;
--sidebar-accent: #334155;
--sidebar-accent-foreground: #E2E8F0;
--sidebar-border: #334155;
--sidebar-ring: #818CF8;
```

## 2. Typography System

### Font Family

```css
/* Primary Font: Sofia Sans (modern, clean sans-serif) */
--font-family-primary: 'Sofia Sans', 'Inter', system-ui, sans-serif;
--font-family-mono: 'Geist Mono', 'SF Mono', monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Body text */
--text-base: 1rem;     /* 16px - Default */
--text-lg: 1.125rem;   /* 18px - Subheadings */
--text-xl: 1.25rem;    /* 20px - Card titles */
--text-2xl: 1.5rem;    /* 24px - Section titles */
--text-3xl: 2rem;      /* 32px - Large numbers */
--text-4xl: 2.5rem;    /* 40px - Hero text */
```

### Font Weights

```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 3. Component Design Patterns

### Stat Cards (HMIS Specific with backdrop blur effects)

```jsx
// Hospital-specific stat cards with enhanced styling
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Active Patients */}
  <StatCard
    icon={<Users className="w-8 h-8" />}
    label="Active Patients"
    value="2,456"
    change="+12.5%"
    bgColor="bg-linear-to-br from-[#5356EC] to-[#4245D9]"
    iconBgColor="bg-white/20"
    textColor="text-white"
  />

  {/* Today's Appointments */}
  <StatCard
    icon={<Calendar className="w-8 h-8" />}
    label="Today's Appointments"
    value="84"
    change="+8.3%"
    bgColor="bg-linear-to-br from-[#5996ED] to-[#4A86DC]"
    iconBgColor="bg-white/20"
    textColor="text-white"
  />

  {/* Available Beds */}
  <StatCard
    icon={<Bed className="w-8 h-8" />}
    label="Available Beds"
    value="127"
    change="-5 from yesterday"
    bgColor="bg-linear-to-br from-[#5DC9ED] to-[#4AB8DC]"
    iconBgColor="bg-white/20"
    textColor="text-white"
  />

  {/* Emergency Cases */}
  <StatCard
    icon={<AlertCircle className="w-8 h-8" />}
    label="Emergency Cases"
    value="12"
    change="+3 in last hour"
    bgColor="bg-linear-to-br from-[#8453ED] to-[#7145D9]"
    iconBgColor="bg-white/20"
    textColor="text-white"
  />
</div>
```

### Enhanced Card Components (with backdrop blur and semi-transparent backgrounds)

```jsx
// Patient Analytics Chart Card
<Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/60 dark:border-slate-700/60 shadow-sm">
  <CardHeader>
    <CardTitle className="text-gray-900 dark:text-white">Patient Analytics</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-64 bg-linear-to-br from-indigo-500/20 to-blue-500/20 dark:from-indigo-600/30 dark:to-blue-600/30 rounded-lg flex items-center justify-center border border-gray-200/40 dark:border-slate-600/40">
      <div className="text-center text-gray-900 dark:text-white">
        <div className="text-4xl font-bold mb-2">2,456</div>
        <div className="text-lg">Active Patients</div>
        <div className="flex items-center justify-center mt-2 text-green-600 dark:text-green-40">
          <ArrowUp className="w-4 h-4 mr-1" />
          <span>+12.5% from last month</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

// Department Distribution Card
<Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-200/60 dark:border-slate-700/60 shadow-sm">
  <CardHeader>
    <CardTitle className="text-gray-900 dark:text-white">Department Distribution</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Department progress bars with gradient effects */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-[#B4B7C9]">Emergency</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">24/30</span>
        </div>
        <div className="w-full bg-gray-200/50 dark:bg-slate-700/50 rounded-full h-2">
          <div
            className="bg-linear-to-r from-indigo-50 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '80%' }}
          />
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### Form Components (with consistent styling)

```jsx
// Input with backdrop blur effect
<Input
  type="text"
  placeholder="search anything"
  className="w-full bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500/80 dark:placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
/>

// Select with consistent styling
<select className="bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer min-w-[120px] backdrop-blur-sm">
  <option>This Month</option>
  <option>Last Month</option>
</select>
```

## 4. Micro-Interactions & Animations

### Hover Effects

```jsx
// Card hover effect with scale and shadow
className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"

// Button hover effects with transform
className="transition-all duration-200 hover:bg-indigo-600 hover:shadow-lg transform active:scale-95"

// Row hover effects for tables
className="hover:bg-gray-50/80 dark:hover:bg-slate-700/80 transition-colors"
```

### Page Transitions (Framer Motion)

```jsx
// Page variants with smooth transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as any  // Custom easing for better motion
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Container stagger animations
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Theme Provider Context

```jsx
// Theme Provider for consistent dark/light mode
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme classes
    root.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(theme);

    // Set data-theme attribute for Tailwind
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## 5. Layout Structure

### Sidebar Navigation (Updated with backdrop blur effects)

```jsx
<aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-gray-200/60 dark:border-slate-700/60 h-screen sticky top-0">
  {/* Hospital Logo with gradient background */}
  <div className="p-6 border-b border-gray-200/60 dark:border-slate-700/60 bg-linear-to-b from-white/50 to-gray-50/30 dark:from-slate-800/50 dark:to-slate-800/30">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
        <Hospital className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">MediCare</h1>
        <p className="text-xs text-gray-500/80 dark:text-slate-400">Hospital System</p>
      </div>
    </div>
  </div>

  {/* Navigation with gradient background */}
  <nav className="p-4 space-y-1 bg-linear-to-t from-white/30 to-transparent dark:from-slate-800/30 dark:to-transparent">
    <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
    <NavItem icon={<Users />} label="Patients" />
    <NavItem icon={<Calendar />} label="Appointments" />
    <NavItem icon={<Stethoscope />} label="Doctors" />
    <NavItem icon={<Bed />} label="Bed Management" />
    <NavItem icon={<FileText />} label="Medical Records" />
    <NavItem icon={<Package />} label="Pharmacy" />
    <NavItem icon={<DollarSign />} label="Billing" />
  </nav>
</aside>
```

### Main Content Layout (Updated with subtle gradients)

```jsx
<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
  <div className="flex">
    {/* Sidebar positioned with sticky top */}
    <aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-gray-200/60 dark:border-slate-700/60 h-screen sticky top-0">
      {/* ... sidebar content ... */}
    </aside>

    {/* Main content area */}
    <main className="flex-1 p-8">
      {/* Header with motion animations */}
      <motion.header
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hello, Dr. Smith 👋
            </h1>
            <p className="text-gray-600 dark:text-[#B4B7C9] mt-1">
              Welcome to MediCare HMIS
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search with backdrop blur */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#797C91]" />
              <Input
                type="text"
                placeholder="search anything"
                className="w-full bg-gray-50 dark:bg-[#2A2D42] border border-gray-200 dark:border-[#353850] rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-[#797C91] focus:outline-none focus:ring-2 focus:ring-[#5356EC] focus:border-transparent transition-all"
              />
            </div>

            {/* Theme Toggle with proper state management */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-600 dark:text-[#B4B7C9] hover:bg-gray-100 dark:hover:bg-[#2A2D42] rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>
    </main>
  </div>
</div>
```

## 6. Data Visualization Components

### Progress Bars (with gradient effects)

```jsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600 dark:text-[#B4B7C9]">New York</span>
    <span className="text-sm font-medium text-white">35%</span>
  </div>
  <div className="w-full bg-gray-200/50 dark:bg-slate-700/50 rounded-full h-2">
    <div
      className="bg-linear-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-500"
      style={{ width: '35%' }}
    />
  </div>
</div>
```

## 7. Form Elements & Inputs

### Search Bar (with backdrop blur and consistent styling)

```jsx
<div className="relative flex-1 max-w-md">
  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#797C91]" />
  <Input
    type="text"
    placeholder="search anything"
    className="w-full bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500/80 dark:placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
  />
</div>
```

## 8. Icon System

### Department Icon Styling (with consistent opacity levels)

```jsx
const departmentStyles = {
  emergency: "bg-red-500/20 text-red-500",      // 20% opacity background
  surgery: "bg-blue-500/20 text-blue-500",      // 20% opacity background
  pediatrics: "bg-purple-500/20 text-purple-500", // 20% opacity background
  cardiology: "bg-cyan-500/20 text-cyan-500",   // 20% opacity background
  neurology: "bg-indigo-500/20 text-indigo-500"  // 20% opacity background
};
```

## 9. Spacing & Grid System

### Grid Layouts (consistent spacing with gap-4 default)

```jsx
// 4-column stat grid with consistent spacing
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"

// 2-column split with increased spacing
className="grid grid-cols-1 lg:grid-cols-2 gap-6"

// 3-column layout with consistent spacing
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## 10. Styling Strategy: Centralized vs Decoupled

### Centralized Global Styles Approach

The HMIS dashboard uses a centralized approach with global CSS variables and consistent component styling:

**Global CSS Variables** (`src/app/globals.css`):

- Single source of truth for all color variables
- Consistent theme management for light/dark modes
- Easy maintenance and updates across the entire application

**Shared Component Classes** (in all components):

- Consistent use of `backdrop-blur-sm` for modern glass effects
- Standardized opacity levels (50%, 60%, 70%, 80%) for semi-transparent backgrounds
- Consistent border transparency (60% for both light and dark modes)
- Unified hover and transition effects across all interactive elements

### Decoupled Component Styling

Individual components maintain their own specific styling while adhering to the global theme:

**Component-Specific Classes**:

- Each component uses global theme variables but can have unique structural classes
- Card components use consistent backdrop blur and transparency patterns
- Navigation items maintain consistent hover states and active states
- Forms use standardized input styling with consistent focus states

### Benefits of This Hybrid Approach

- **Maintainability**: Global changes affect all components consistently
- **Flexibility**: Individual components can have unique layouts while maintaining visual harmony
- **Performance**: Reduced CSS duplication and consistent class naming
- **Accessibility**: Consistent contrast ratios and focus states across themes

## 11. Complete HMIS Dashboard Structure

```jsx
<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
  {/* Sidebar with backdrop blur and sticky positioning */}
  <aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-gray-200/60 dark:border-slate-700/60 h-screen sticky top-0">
    <div className="p-6 border-b border-gray-200/60 dark:border-slate-700/60 bg-linear-to-b from-white/50 to-gray-50/30 dark:from-slate-800/50 dark:to-slate-800/30">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
          <Hospital className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">MediCare</h1>
          <p className="text-xs text-gray-500/80 dark:text-slate-400">Hospital System</p>
        </div>
      </div>
    </div>

    <nav className="p-4 space-y-1 bg-linear-to-t from-white/30 to-transparent dark:from-slate-800/30 dark:to-transparent">
      <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
      <NavItem icon={<Users />} label="Patients" />
      <NavItem icon={<Calendar />} label="Appointments" />
      <NavItem icon={<Stethoscope />} label="Doctors" />
      <NavItem icon={<Bed />} label="Bed Management" />
      <NavItem icon={<FileText />} label="Medical Records" />
      <NavItem icon={<Package />} label="Pharmacy" />
      <NavItem icon={<DollarSign />} label="Billing" />
    </nav>
  </aside>

  {/* Main Content Area */}
  <main className="flex-1 p-8">
    {/* Header with motion animations and theme toggle */}
    <motion.header
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello, Dr. Smith 👋
          </h1>
          <p className="text-gray-600 dark:text-[#B4B7C9] mt-1">
            Welcome to MediCare HMIS
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#797C91]" />
            <Input
              type="text"
              placeholder="search anything"
              className="w-full bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/60 dark:border-slate-700/60 rounded-xl pl-12 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500/80 dark:placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
            />
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-600 dark:text-[#B4B7C9] hover:bg-gray-100 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.header>

    {/* Stats Grid with consistent card styling */}
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {/* Stat cards with gradient backgrounds */}
    </motion.div>

    {/* Data visualization cards with backdrop blur */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PatientAnalyticsChart />
      <DepartmentDistribution />
    </div>

    {/* Data table with consistent styling */}
    <RecentPatientsTable />
  </main>
</div>
```
