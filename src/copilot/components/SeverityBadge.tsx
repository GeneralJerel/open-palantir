import { INTEL_THEME, severityColor } from './intel-theme';

interface Props {
  level?: string;
  label?: string;
  large?: boolean;
}

export function SeverityBadge({ level, label, large }: Props) {
  const color = severityColor(level);
  const displayText = label || level || 'UNKNOWN';

  return (
    <span
      style={{
        display: 'inline-block',
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
        fontFamily: INTEL_THEME.fonts.mono,
        fontSize: large ? 13 : 10,
        fontWeight: 700,
        letterSpacing: 1.5,
        padding: large ? '6px 16px' : '2px 8px',
        borderRadius: 3,
        textTransform: 'uppercase',
      }}
    >
      {displayText}
    </span>
  );
}
