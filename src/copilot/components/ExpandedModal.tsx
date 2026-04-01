import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { INTEL_THEME } from './intel-theme';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

/**
 * Full-screen modal overlay for expanded intel reports.
 * Mirrors the CountryDeepDivePanel.maximized pattern:
 * fixed inset overlay with backdrop blur, centered content card.
 */
export function ExpandedModal({ children, onClose }: Props) {
  const t = INTEL_THEME;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '32px 16px',
      }}
    >
      <div
        style={{
          width: 720,
          maxWidth: '96vw',
          background: t.colors.bg,
          border: `1px solid ${t.colors.border}`,
          borderRadius: 12,
          boxShadow: `0 16px 48px rgba(0, 0, 0, 0.6)`,
          overflow: 'hidden',
          position: 'relative',
          fontFamily: t.fonts.sans,
          color: t.colors.text,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 4,
            border: `1px solid ${t.colors.border}`,
            borderRadius: 6,
            width: 32,
            height: 32,
            background: t.colors.surface,
            color: t.colors.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
