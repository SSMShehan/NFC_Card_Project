// ============================================================
//  NEXUS Mobile — Design Tokens & Theme Constants
//  Central source of truth for all colors, spacing, and typography.
// ============================================================

export const Colors = {
  // ── Brand ──────────────────────────────────────────────────
  primary:        '#6451fa',
  primaryLight:   '#8379ff',
  primaryDark:    '#4924dc',
  accent:         '#22d3ee',
  pink:           '#ec4899',

  // ── Background Layers ──────────────────────────────────────
  bgBase:         '#0a0818',
  bgLayer1:       '#130d32',
  bgLayer2:       'rgba(255, 255, 255, 0.06)',
  bgLayer3:       'rgba(255, 255, 255, 0.03)',

  // ── Glass Effect ───────────────────────────────────────────
  glassBorder:    'rgba(255, 255, 255, 0.10)',
  glassBorderFocus: 'rgba(100, 81, 250, 0.5)',

  // ── Text ───────────────────────────────────────────────────
  textPrimary:    'rgba(255, 255, 255, 0.95)',
  textSecondary:  'rgba(255, 255, 255, 0.60)',
  textMuted:      'rgba(255, 255, 255, 0.35)',
  textDisabled:   'rgba(255, 255, 255, 0.20)',

  // ── Status ─────────────────────────────────────────────────
  success:        '#22c55e',
  successBg:      'rgba(34, 197, 94, 0.15)',
  warning:        '#f59e0b',
  warningBg:      'rgba(245, 158, 11, 0.15)',
  danger:         '#ef4444',
  dangerBg:       'rgba(239, 68, 68, 0.15)',
  info:           '#22d3ee',
  infoBg:         'rgba(34, 211, 238, 0.15)',

  // ── Social Platform Colors ─────────────────────────────────
  platforms: {
    linkedin:  'rgba(10, 102, 194, 0.25)',
    github:    'rgba(255, 255, 255, 0.12)',
    instagram: 'rgba(225, 48, 108, 0.20)',
    whatsapp:  'rgba(37, 211, 102, 0.20)',
    twitter:   'rgba(255, 255, 255, 0.12)',
    telegram:  'rgba(36, 161, 222, 0.20)',
    youtube:   'rgba(255, 0, 0, 0.20)',
    tiktok:    'rgba(255, 0, 80, 0.20)',
    facebook:  'rgba(24, 119, 242, 0.20)',
    website:   'rgba(255, 255, 255, 0.08)',
    phone:     'rgba(34, 211, 238, 0.20)',
    email:     'rgba(100, 81, 250, 0.20)',
    custom:    'rgba(255, 255, 255, 0.08)',
  },
} as const;

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
} as const;

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  full: 9999,
} as const;

export const Typography = {
  // Font sizes
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  28,
  xxxl: 34,

  // Font weights
  light:     '300' as const,
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
  black:     '900' as const,

  // Line heights
  tight:    1.2,
  normal:   1.5,
  relaxed:  1.7,
} as const;

export const Shadow = {
  sm: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius:  4,
    elevation: 3,
  },
  md: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius:  8,
    elevation: 6,
  },
  lg: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius:  16,
    elevation: 12,
  },
  glow: {
    shadowColor:   '#6451fa',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius:  20,
    elevation: 10,
  },
} as const;
