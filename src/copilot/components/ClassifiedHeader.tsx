import { INTEL_THEME } from './intel-theme';

interface Props {
  classification?: string;
  color?: string;
}

export function ClassifiedHeader({ classification = 'TOP SECRET // COPILOTKIT', color }: Props) {
  return (
    <div
      style={{
        background: color || INTEL_THEME.colors.classified,
        color: '#fff',
        fontFamily: INTEL_THEME.fonts.mono,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 3,
        textAlign: 'center',
        padding: '6px 12px',
        textTransform: 'uppercase',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {classification}
    </div>
  );
}
