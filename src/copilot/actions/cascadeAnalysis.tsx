import { useState } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ExpandedModal } from '../components/ExpandedModal';
import { INTEL_THEME, severityColor, directionColor, directionArrow } from '../components/intel-theme';

const t = INTEL_THEME;

function CascadeAnalysisCard({ args, compact, onExpand }: { args: Record<string, unknown>; compact?: boolean; onExpand?: () => void }) {
  const trigger = args.triggerEvent as any;
  const first = (args.firstOrderEffects as any[]) || [];
  const second = (args.secondOrderEffects as any[]) || [];
  const market = (args.marketImplications as any[]) || [];

  const visibleFirst = compact ? first.slice(0, 2) : first;
  const visibleMarket = compact ? market.slice(0, 3) : market;

  return (
    <>
      <ClassifiedHeader classification="SECRET // NOFORN" />

      {/* Title */}
      <div style={{ padding: compact ? t.spacing.md : t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            Cascade Analysis
          </div>
          {compact && onExpand && (
            <button
              onClick={onExpand}
              style={{
                background: `${t.colors.accent}18`,
                border: `1px solid ${t.colors.accent}44`,
                color: t.colors.accent,
                fontFamily: t.fonts.mono,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: '4px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              EXPAND ↗
            </button>
          )}
        </div>
      </div>

      {/* Trigger event */}
      <div style={{ padding: `0 ${compact ? t.spacing.md : t.spacing.lg}px`, paddingTop: compact ? t.spacing.md : t.spacing.lg }}>
        <div
          style={{
            border: `2px solid ${t.colors.accent}`,
            borderRadius: 6,
            padding: compact ? t.spacing.sm : t.spacing.md,
            background: `${t.colors.accent}11`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: compact ? 13 : 14, marginBottom: 4 }}>{trigger?.title}</div>
          <div style={{ fontSize: compact ? 10 : 11, color: t.colors.textDim }}>{trigger?.description}</div>
          {trigger?.date && (
            <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, marginTop: 4 }}>{trigger.date}</div>
          )}
        </div>

        {/* Connector */}
        <div style={{ width: 2, height: 20, background: t.colors.border, margin: '0 auto' }} />
      </div>

      {/* First-order effects */}
      {visibleFirst.length > 0 && (
        <>
          <SectionHeader title="First-Order Effects" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleFirst.map((effect: any, i: number) => {
              const children = compact ? [] : second.filter((s: any) => s.parentIndex === i);
              return (
                <div key={i} style={{ marginBottom: t.spacing.md }}>
                  {/* First-order card */}
                  <div
                    style={{
                      borderLeft: `3px solid ${severityColor(effect.severity)}`,
                      padding: `${t.spacing.sm}px ${compact ? t.spacing.sm : t.spacing.md}px`,
                      background: t.colors.surface,
                      borderRadius: '0 4px 4px 0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 12 }}>{effect.title}</span>
                      <span
                        style={{
                          fontFamily: t.fonts.mono,
                          fontSize: 9,
                          color: t.colors.textMuted,
                          textTransform: 'uppercase',
                          background: `${t.colors.border}`,
                          padding: '1px 6px',
                          borderRadius: 2,
                        }}
                      >
                        {effect.domain}
                      </span>
                    </div>
                    {!compact && <div style={{ fontSize: 11, color: t.colors.textDim }}>{effect.description}</div>}
                  </div>

                  {/* Second-order children */}
                  {children.length > 0 && (
                    <div style={{ marginLeft: 20, borderLeft: `1px dashed ${t.colors.border}`, paddingLeft: t.spacing.md }}>
                      {children.map((child: any, j: number) => (
                        <div
                          key={j}
                          style={{
                            borderLeft: `2px solid ${severityColor(child.severity)}`,
                            padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
                            marginTop: t.spacing.sm,
                            background: `${t.colors.surface}88`,
                            borderRadius: '0 3px 3px 0',
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: 11 }}>{child.title}</div>
                          <div style={{ fontSize: 10, color: t.colors.textDim }}>{child.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {compact && first.length > 2 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{first.length - 2} MORE EFFECTS
              </div>
            )}
          </div>
        </>
      )}

      {/* Market implications */}
      {visibleMarket.length > 0 && (
        <>
          <SectionHeader title="Market Implications" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleMarket.map((m: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: t.spacing.sm,
                  padding: `${t.spacing.sm}px 0`,
                  borderBottom: i < visibleMarket.length - 1 ? `1px solid ${t.colors.borderSubtle}` : 'none',
                }}
              >
                <span style={{ fontSize: 16, color: directionColor(m.direction) }}>{directionArrow(m.direction)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{m.title}</div>
                  {!compact && <div style={{ fontSize: 10, color: t.colors.textDim }}>{m.description}</div>}
                </div>
              </div>
            ))}
            {compact && market.length > 3 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{market.length - 3} MORE IMPLICATIONS
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div
        style={{
          padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px`,
          fontFamily: t.fonts.mono,
          fontSize: 9,
          color: t.colors.textMuted,
          textAlign: 'center',
          borderTop: `1px solid ${t.colors.borderSubtle}`,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Analysis generated {new Date().toISOString().slice(0, 16)} // GEOINT
      </div>
    </>
  );
}

function CascadeAnalysisRender({ args }: { args: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <IntelCard>
        <CascadeAnalysisCard args={args} compact onExpand={() => setExpanded(true)} />
      </IntelCard>

      {expanded && (
        <ExpandedModal onClose={() => setExpanded(false)}>
          <CascadeAnalysisCard args={args} />
        </ExpandedModal>
      )}
    </>
  );
}

export function useCascadeAnalysisAction() {
  useCopilotAction({
    name: 'cascadeAnalysis',
    description:
      'Trace cascading second-order effects of a geopolitical or economic event. Renders a visual flow diagram showing trigger → first-order effects → second-order effects → market implications. Use when the user asks about consequences, ripple effects, or impact chains of an event.',
    parameters: [
      {
        name: 'triggerEvent',
        type: 'object',
        description: 'The triggering event',
        attributes: [
          { name: 'title', type: 'string', description: 'Short event title', required: true },
          { name: 'description', type: 'string', description: 'Brief event description', required: true },
          { name: 'date', type: 'string', description: 'Event date', required: false },
        ],
      },
      {
        name: 'firstOrderEffects',
        type: 'object[]',
        description: 'Direct first-order consequences (3-4 items)',
        attributes: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'string', required: true },
          { name: 'severity', type: 'string', description: 'CRITICAL, HIGH, MODERATE, or LOW', required: true },
          { name: 'domain', type: 'string', description: 'Domain: economic, military, diplomatic, humanitarian, energy, trade', required: true },
        ],
      },
      {
        name: 'secondOrderEffects',
        type: 'object[]',
        description: 'Second-order effects that branch from first-order effects',
        attributes: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'string', required: true },
          { name: 'severity', type: 'string', required: true },
          { name: 'parentIndex', type: 'number', description: 'Index of the parent first-order effect (0-based)', required: true },
        ],
      },
      {
        name: 'marketImplications',
        type: 'object[]',
        description: 'Market/economic implications',
        attributes: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'string', required: true },
          { name: 'direction', type: 'string', description: 'UP, DOWN, or VOLATILE', required: true },
        ],
      },
    ],
    handler: async ({ triggerEvent }) => {
      return `Cascade analysis complete for: ${(triggerEvent as any)?.title}`;
    },
    render: ({ status, args }) => {
      if (status === 'inProgress' && !(args.triggerEvent as any)?.title) {
        return (
          <IntelCard>
            <ClassifiedHeader classification="SECRET // NOFORN" />
            <LoadingIndicator />
          </IntelCard>
        );
      }

      return <CascadeAnalysisRender args={args} />;
    },
  });
}
