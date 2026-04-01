import { useEffect } from 'react';
import { INTEL_THEME } from './intel-theme';

const ANIM_ID = 'intel-pulse-keyframes';

export function LoadingIndicator() {
  useEffect(() => {
    if (document.getElementById(ANIM_ID)) return;
    const style = document.createElement('style');
    style.id = ANIM_ID;
    style.textContent = `@keyframes intel-pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }`;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        fontFamily: INTEL_THEME.fonts.mono,
        fontSize: 11,
        color: INTEL_THEME.colors.accent,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: INTEL_THEME.spacing.lg,
        textAlign: 'center',
        animation: 'intel-pulse 1.5s ease-in-out infinite',
      }}
    >
      PROCESSING SIGINT...
    </div>
  );
}
