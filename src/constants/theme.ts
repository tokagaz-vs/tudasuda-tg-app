// ================ SPACING SYSTEM ================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

// ================ TYPOGRAPHY ================
export const TYPOGRAPHY = {
  h1: {
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '34px',
    letterSpacing: '-0.5px',
  },
  h2: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '30px',
    letterSpacing: '-0.3px',
  },
  h3: {
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '26px',
    letterSpacing: '-0.2px',
  },
  h4: {
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '24px',
  },
  body: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  sub: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
  },
  button: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    letterSpacing: '0.1px',
  },
  numeric: {
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '24px',
  },
};

// ================ BORDER RADIUS ================
export const BORDER_RADIUS = {
  xs: 8,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
  round: 999,
};

// ================ SHADOWS ================
export const SHADOWS = {
  none: {},
  xs: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  sm: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  small: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  md: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
  },
  medium: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
  },
  lg: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  large: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  xl: {
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.18)',
  },
};

// ================ ANIMATION ================
export const ANIMATION = {
  duration: {
    instant: '0ms',
    fast: '120ms',
    normal: '220ms',
    slow: '320ms',
    verySlow: '480ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    enter: 'cubic-bezier(0.12, 0.9, 0.24, 1)',
    exit: 'cubic-bezier(0.22, 0, 0.36, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ================ DARK THEME COLORS ================
const DARK_COLORS = {
  // Brand
  primary: '#FF6A00',
  primaryDark: '#E55A00',
  primaryLight: '#FF8533',
  secondary: '#7C4DFF',
  secondaryDark: '#6234E5',
  secondaryLight: '#9D7DFF',
  accent: '#FF2D55',

  // Base
  background: '#0F1115',
  surface: '#151821',
  surfaceAlt: '#1C1F2A',
  surfaceElevated: '#232734',

  // Text
  text: '#F5F7FA',
  textSecondary: '#B4BDCC',
  textTertiary: '#7A8394',
  textLight: '#5A6373',

  // Semantic
  success: '#22C55E',
  successLight: '#4ADE80',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',

  // Borders & Overlays
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayHeavy: 'rgba(0, 0, 0, 0.7)',
  scrim: 'rgba(0, 0, 0, 0.6)',

  // Glass effects
  glass: 'rgba(255, 255, 255, 0.06)',
  glassLight: 'rgba(255, 255, 255, 0.03)',
  glassHeavy: 'rgba(255, 255, 255, 0.10)',

  // State layers
  statePressed: 'rgba(255, 255, 255, 0.10)',
  stateHover: 'rgba(255, 255, 255, 0.08)',
  stateFocus: 'rgba(255, 106, 0, 0.24)',
  stateDisabled: 'rgba(255, 255, 255, 0.12)',
};

// ================ LIGHT THEME COLORS ================
const LIGHT_COLORS = {
  // Brand
  primary: '#FF6A00',
  primaryDark: '#E55A00',
  primaryLight: '#FF8533',
  secondary: '#7C4DFF',
  secondaryDark: '#6234E5',
  secondaryLight: '#9D7DFF',
  accent: '#FF2D55',

  // Base
  background: '#FFFFFF',
  surface: '#F6F7FB',
  surfaceAlt: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#0A0C12',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  textLight: '#A0AEC0',

  // Semantic
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',

  // Borders & Overlays
  border: 'rgba(10, 12, 18, 0.08)',
  borderLight: 'rgba(10, 12, 18, 0.04)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayHeavy: 'rgba(0, 0, 0, 0.6)',
  scrim: 'rgba(0, 0, 0, 0.5)',

  // Glass effects
  glass: 'rgba(10, 12, 18, 0.06)',
  glassLight: 'rgba(10, 12, 18, 0.03)',
  glassHeavy: 'rgba(10, 12, 18, 0.10)',

  // State layers
  statePressed: 'rgba(0, 0, 0, 0.06)',
  stateHover: 'rgba(0, 0, 0, 0.04)',
  stateFocus: 'rgba(255, 106, 0, 0.12)',
  stateDisabled: 'rgba(0, 0, 0, 0.12)',
};

// ================ GRADIENTS ================
export const GRADIENTS = {
  brand: {
    colors: ['#FF6A00', '#FF2D55'],
    angle: 135,
  },
  accent: {
    colors: ['#7C4DFF', '#18A0FB'],
    angle: 135,
  },
  dark: {
    colors: ['#1C1F2A', '#0F1115'],
    angle: 180,
  },
  success: {
    colors: ['#22C55E', '#10B981'],
    angle: 135,
  },
  warning: {
    colors: ['#F59E0B', '#DC2626'],
    angle: 135,
  },
};

// ================ Z-INDEX LAYERS ================
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
};

// ================ THEME TYPE ================
export type Theme = {
  colors: typeof DARK_COLORS;
  spacing: typeof SPACING;
  typography: typeof TYPOGRAPHY;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  animation: typeof ANIMATION;
  gradients: typeof GRADIENTS;
  zIndex: typeof Z_INDEX;
};

// ================ EXPORT THEMES ================
export const themes = {
  dark: {
    colors: DARK_COLORS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    animation: ANIMATION,
    gradients: GRADIENTS,
    zIndex: Z_INDEX,
  } as Theme,
  light: {
    colors: LIGHT_COLORS,
    spacing: SPACING,
    typography: TYPOGRAPHY,
    borderRadius: BORDER_RADIUS,
    shadows: SHADOWS,
    animation: ANIMATION,
    gradients: GRADIENTS,
    zIndex: Z_INDEX,
  } as Theme,
};

export const COLORS = DARK_COLORS;