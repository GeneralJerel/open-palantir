import { INTEL_THEME } from './intel-theme';

interface Props {
  title: string;
}

export function SectionHeader({ title }: Props) {
  return (
    <div
      style={{
        fontFamily: INTEL_THEME.fonts.mono,
        fontSize: 10,
        fontWeight: 700,
        color: INTEL_THEME.colors.accent,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: `${INTEL_THEME.spacing.md}px ${INTEL_THEME.spacing.lg}px`,
        borderBottom: `1px solid ${INTEL_THEME.colors.borderSubtle}`,
        background: INTEL_THEME.colors.surface,
      }}
    >
      {title}
    </div>
  );
}
