/**
 * GOSU® Official Design Tokens System
 * Extracted directly from Framer Project Export
 * Ensures 100% visual consistency across all components and pages.
 */

export const GOSU_TOKENS = {
  colors: {
    // Background Layer Palette (Dark Obsidian & Slate)
    background: {
      main: '#000000',
      surface: 'rgba(14, 14, 18, 0.95)',
      card: '#09090b',
      elevated: '#141418',
      modal: '#050505',
    },
    // Primary Cyber Neon Accents
    accents: {
      cyan: '#00e8ff',      // Primary Brand Glow & Highlights
      orange: '#ff5c00',    // Reseller / Wholesale & Call-To-Action
      pink: '#ff09bb',      // Cart Badges & Notifications
      green: '#22ef00',     // Live Stock & Success Status
      yellow: '#e4e800',    // Special Features & Star Highlights
      blue: '#0099ff',      // Information & Links
      purple: '#8b5cf6',    // Premium Collector Items
    },
    // Text Hierarchy
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
      muted: '#696969',
      inverse: '#000000',
    },
    // Borders & Dividers
    borders: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.14)',
      activeCyan: '#00e8ff',
      activeOrange: '#ff5c00',
      dark: '#1f1f24',
    },
  },
  typography: {
    families: {
      sigher: '"Sigher Regular", sans-serif',
      openSauce: '"Open Sauce One", sans-serif',
      inter: '"Inter", sans-serif',
    },
    sizes: {
      logo: '180px',
      heroDisplay: '100px',
      h1: '48px',
      h2: '36px',
      h3: '24px',
      body: '16px',
      subtext: '14px',
      badge: '12px',
      micro: '9px',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '16px',
    full: '100px',
  },
  shadows: {
    cyanGlow: '0 0 20px rgba(0, 232, 255, 0.3)',
    orangeGlow: '0 0 25px rgba(255, 92, 0, 0.35)',
    pinkGlow: '0 0 20px rgba(255, 9, 187, 0.4)',
    cardGlowHover: '0 0 20px rgba(0, 232, 255, 0.2)',
  },
  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s ease-in-out',
  },
} as const;

export type GosuTokens = typeof GOSU_TOKENS;
