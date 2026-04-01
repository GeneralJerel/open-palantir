import { INTEL_THEME, severityColor } from './intel-theme';

interface Props {
  confidence?: string;
}

export function ConfidenceIndicator({ confidence }: Props) {
  const color = severityColor(
    confidence?.toUpperCase() === 'HIGH' ? 'LOW' : confidence?.toUpperCase() === 'LOW' ? 'HIGH' : 'MODERATE',
  );

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: INTEL_THEME.fonts.mono,
        fontSize: 10,
        color,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {confidence || 'UNKNOWN'}
    </span>
  );
}
