import type { CSSProperties, ReactNode } from 'react';
import { INTEL_THEME } from './intel-theme';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

export function IntelCard({ children, style }: Props) {
  return (
    <div
      style={{
        background: INTEL_THEME.colors.bg,
        border: `1px solid ${INTEL_THEME.colors.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        fontFamily: INTEL_THEME.fonts.sans,
        color: INTEL_THEME.colors.text,
        fontSize: 13,
        lineHeight: 1.5,
        maxWidth: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
