export const INTEL_THEME = {
  colors: {
    bg: '#0a0e14',
    surface: '#111922',
    surfaceHover: '#1a2533',
    border: '#1e3a5f',
    borderSubtle: '#152238',
    text: '#c8d6e5',
    textDim: '#5c7a99',
    textMuted: '#3d5570',
    accent: '#00d4ff',
    classified: '#ff4444',
    actionRequired: '#ff9800',
    critical: '#ff2b2b',
    high: '#ff6b35',
    moderate: '#ffc107',
    low: '#4caf50',
    up: '#4caf50',
    down: '#ff2b2b',
    volatile: '#ffc107',
  },
  fonts: {
    mono: "'Courier New', Consolas, monospace",
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
} as const;

export function severityColor(level?: string): string {
  switch (level?.toUpperCase()) {
    case 'CRITICAL': return INTEL_THEME.colors.critical;
    case 'HIGH': return INTEL_THEME.colors.high;
    case 'MODERATE': return INTEL_THEME.colors.moderate;
    case 'LOW': return INTEL_THEME.colors.low;
    default: return INTEL_THEME.colors.textDim;
  }
}

export function directionColor(dir?: string): string {
  switch (dir?.toUpperCase()) {
    case 'UP': return INTEL_THEME.colors.up;
    case 'DOWN': return INTEL_THEME.colors.down;
    case 'VOLATILE': return INTEL_THEME.colors.volatile;
    default: return INTEL_THEME.colors.textDim;
  }
}

export function directionArrow(dir?: string): string {
  switch (dir?.toUpperCase()) {
    case 'UP': return '▲';
    case 'DOWN': return '▼';
    case 'VOLATILE': return '◆';
    default: return '—';
  }
}

export function recommendationColor(rec?: string): string {
  switch (rec?.toUpperCase()) {
    case 'RECOMMENDED': return INTEL_THEME.colors.low;
    case 'VIABLE': return INTEL_THEME.colors.moderate;
    case 'RISKY': return INTEL_THEME.colors.high;
    case 'NOT_RECOMMENDED': return INTEL_THEME.colors.critical;
    default: return INTEL_THEME.colors.textDim;
  }
}
