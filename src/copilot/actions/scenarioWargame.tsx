import { useState, useEffect, useRef } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SeverityBadge } from '../components/SeverityBadge';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ExpandedModal } from '../components/ExpandedModal';
import { INTEL_THEME, severityColor, recommendationColor } from '../components/intel-theme';
import { CHINA_TAIWAN_IRAN_OVERLAY, CHINA_TAIWAN_IRAN_SCENARIO } from '../data/china-taiwan-iran-scenario';

const t = INTEL_THEME;

const FACTION_LABELS: Record<string, { label: string; color: string }> = {
  CN: { label: 'PRC', color: '#dc2828' },
  TW: { label: 'ROC (Taiwan)', color: '#28b450' },
  US: { label: 'United States', color: '#2864f0' },
  IR: { label: 'Iran', color: '#f09620' },
  allied: { label: 'Allied', color: '#3cc8dc' },
};

const REVEAL_DELAY_MS = 400;
const SECTION_COUNT = 4; // header, theater, initial move, response options

function useProgressiveReveal(skip: boolean) {
  const [revealed, setRevealed] = useState(skip ? SECTION_COUNT : 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (skip) return;
    timerRef.current = setInterval(() => {
      setRevealed((prev) => {
        if (prev >= SECTION_COUNT) {
          if (timerRef.current) clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, REVEAL_DELAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [skip]);

  return revealed;
}

const revealStyle = (visible: boolean): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(8px)',
  transition: 'opacity 0.4s ease, transform 0.4s ease',
});

function ScenarioWargameCard({ status, args, compact, onExpand }: { status: string; args: any; compact?: boolean; onExpand?: () => void }) {
  const scenarioEventDispatched = useRef(false);
  const [scenarioActivated, setScenarioActivated] = useState(false);
  const revealed = useProgressiveReveal(!!compact);

  const scenario = args.scenario as any;
  const move = args.initialMove as any;
  const responses = (args.responseOptions as any[]) || [];

  const visibleResponses = compact ? responses.slice(0, 2) : responses;

  // Activate map overlay when the scenario renders
  // NOTE: Overlay data is a static fixture (China/Taiwan/Iran). Pending dynamic generation from LLM params.
  useEffect(() => {
    if (scenarioEventDispatched.current) return;
    if (!scenario?.region) return;
    scenarioEventDispatched.current = true;
    setScenarioActivated(true);
    window.dispatchEvent(
      new CustomEvent('copilot:activate-scenario', {
        detail: {
          overlay: CHINA_TAIWAN_IRAN_OVERLAY,
          center: { lat: 24.0, lng: 120.0 },
          zoom: 4,
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.region]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scenarioEventDispatched.current) {
        window.dispatchEvent(
          new CustomEvent('copilot:activate-scenario', {
            detail: { overlay: null },
          }),
        );
      }
    };
  }, []);

  if (status === 'inProgress' && !scenario?.title) {
    return (
      <>
        <ClassifiedHeader classification="TOP SECRET // SCI" />
        <LoadingIndicator />
      </>
    );
  }

  // Count forces by faction
  const forceCounts = CHINA_TAIWAN_IRAN_OVERLAY.forces.reduce<Record<string, number>>((acc, f) => {
    acc[f.faction] = (acc[f.faction] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <ClassifiedHeader classification={scenario?.classification || CHINA_TAIWAN_IRAN_SCENARIO.classification} />

      {/* Scenario header */}
      <div style={{ ...revealStyle(revealed >= 1), padding: compact ? t.spacing.md : t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            Scenario Wargame
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
        <div style={{ fontSize: compact ? 16 : 18, fontWeight: 700, marginBottom: 4 }}>{scenario?.title}</div>
        <span
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 9,
            background: t.colors.border,
            color: t.colors.text,
            padding: '2px 8px',
            borderRadius: 2,
            textTransform: 'uppercase',
          }}
        >
          {scenario?.region}
        </span>
        {!compact && <div style={{ fontSize: 12, color: t.colors.textDim, marginTop: t.spacing.sm }}>{scenario?.description}</div>}
      </div>

      {/* Theater overview */}
      {scenarioActivated && (
        <div style={revealStyle(revealed >= 2)}>
          <SectionHeader title="Theater Force Disposition" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {/* Map active indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: t.spacing.sm,
                padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
                background: `${t.colors.accent}15`,
                border: `1px solid ${t.colors.accent}40`,
                borderRadius: 4,
                fontFamily: t.fonts.mono,
                fontSize: 9,
                color: t.colors.accent,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.colors.accent, display: 'inline-block' }} />
              Theater overlay active on map
            </div>

            {/* Force counts by faction */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.spacing.xs }}>
              {Object.entries(forceCounts).map(([faction, count]) => {
                const info = FACTION_LABELS[faction] || { label: faction, color: t.colors.textDim };
                return (
                  <div
                    key={faction}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
                      background: t.colors.surface,
                      border: `1px solid ${t.colors.border}`,
                      borderRadius: 4,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.text }}>{info.label}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: t.fonts.mono, fontSize: 11, fontWeight: 700, color: info.color }}>{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Overlay summary */}
            {!compact && (
              <div style={{ marginTop: t.spacing.sm, fontFamily: t.fonts.mono, fontSize: 9, color: t.colors.textMuted }}>
                {CHINA_TAIWAN_IRAN_OVERLAY.zones.length} zones · {CHINA_TAIWAN_IRAN_OVERLAY.arcs.length} arcs · {CHINA_TAIWAN_IRAN_OVERLAY.missileRanges.length} missile envelopes
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial move */}
      {move && (
        <div style={revealStyle(revealed >= 3)}>
          <SectionHeader title="Initial Move" />
          <div style={{ padding: compact ? t.spacing.md : t.spacing.lg }}>
            <div
              style={{
                border: `1px solid ${severityColor(move.severity)}`,
                borderRadius: 6,
                padding: compact ? t.spacing.sm : t.spacing.md,
                background: `${severityColor(move.severity)}11`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.spacing.sm }}>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 11, color: t.colors.accent }}>{move.actor}</span>
                <SeverityBadge level={move.severity} />
              </div>
              <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, marginBottom: t.spacing.sm }}>{move.action}</div>

              {/* Probability bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing.sm }}>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: t.colors.borderSubtle,
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${move.probability || 0}%`,
                      height: '100%',
                      background: severityColor(move.severity),
                      borderRadius: 3,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
                <span style={{ fontFamily: t.fonts.mono, fontSize: 11, color: severityColor(move.severity) }}>
                  {move.probability}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response options */}
      {visibleResponses.length > 0 && (
        <div style={revealStyle(revealed >= 4)}>
          <SectionHeader title="Response Options" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleResponses.map((r: any, i: number) => {
              const recColor = recommendationColor(r.recommendation);
              return (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${t.colors.border}`,
                    borderRadius: 6,
                    padding: compact ? t.spacing.sm : t.spacing.md,
                    marginBottom: t.spacing.sm,
                    background: t.colors.surface,
                  }}
                >
                  {/* Title + recommendation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: compact ? 12 : 13 }}>{r.title}</span>
                    {r.recommendation && (
                      <span
                        style={{
                          fontFamily: t.fonts.mono,
                          fontSize: 9,
                          color: recColor,
                          background: `${recColor}22`,
                          border: `1px solid ${recColor}55`,
                          padding: '1px 6px',
                          borderRadius: 2,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {r.recommendation?.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {!compact && <div style={{ fontSize: 11, color: t.colors.textDim, marginBottom: t.spacing.sm }}>{r.description}</div>}

                  {/* Probability bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: t.spacing.sm, marginBottom: t.spacing.sm }}>
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 9, color: t.colors.textMuted, minWidth: 55 }}>SUCCESS</span>
                    <div style={{ flex: 1, height: 4, background: t.colors.borderSubtle, borderRadius: 2, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${r.probability || 0}%`,
                          height: '100%',
                          background: t.colors.accent,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.accent }}>{r.probability}%</span>
                  </div>

                  {/* Consequences */}
                  {!compact && (
                    <div
                      style={{
                        fontSize: 10,
                        color: t.colors.textDim,
                        fontStyle: 'italic',
                        padding: `${t.spacing.xs}px ${t.spacing.sm}px`,
                        borderLeft: `2px solid ${severityColor(r.severity)}`,
                        background: `${t.colors.bg}`,
                      }}
                    >
                      {r.consequences}
                    </div>
                  )}
                </div>
              );
            })}
            {compact && responses.length > 2 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{responses.length - 2} MORE OPTIONS
              </div>
            )}
          </div>
        </div>
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
        Wargame generated {new Date().toISOString().slice(0, 16)} // STRATCOM
      </div>
    </>
  );
}

function ScenarioWargameRender({ status, args }: { status: string; args: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <IntelCard>
        <ScenarioWargameCard status={status} args={args} compact onExpand={() => setExpanded(true)} />
      </IntelCard>

      {expanded && (
        <ExpandedModal onClose={() => setExpanded(false)}>
          <ScenarioWargameCard status={status} args={args} />
        </ExpandedModal>
      )}
    </>
  );
}

export function useScenarioWargameAction() {
  useCopilotAction({
    name: 'scenarioWargame',
    description:
      'Run a red-team scenario wargame analysis. Renders a decision tree showing an adversary\'s initial move, response options with probability assessments, and consequences. Use when the user asks to war-game, red-team, or analyze "what if" scenarios.',
    parameters: [
      {
        name: 'scenario',
        type: 'object',
        description: 'The wargame scenario',
        attributes: [
          { name: 'title', type: 'string', description: 'Scenario title', required: true },
          { name: 'description', type: 'string', description: 'Scenario description', required: true },
          { name: 'region', type: 'string', description: 'Geographic region', required: true },
          { name: 'classification', type: 'string', description: 'Classification level', required: false },
        ],
      },
      {
        name: 'initialMove',
        type: 'object',
        description: 'The initial adversary action',
        attributes: [
          { name: 'actor', type: 'string', description: 'The adversary actor', required: true },
          { name: 'action', type: 'string', description: 'The action taken', required: true },
          { name: 'probability', type: 'number', description: 'Probability 0-100', required: true },
          { name: 'severity', type: 'string', description: 'CRITICAL, HIGH, MODERATE, or LOW', required: true },
        ],
      },
      {
        name: 'responseOptions',
        type: 'object[]',
        description: 'Possible response options (3-4)',
        attributes: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'string', required: true },
          { name: 'probability', type: 'number', description: 'Success probability 0-100', required: true },
          { name: 'consequences', type: 'string', description: 'Key consequences', required: true },
          { name: 'severity', type: 'string', description: 'Outcome severity', required: true },
          { name: 'recommendation', type: 'string', description: 'RECOMMENDED, VIABLE, RISKY, or NOT_RECOMMENDED', required: false },
        ],
      },
    ],
    handler: async ({ scenario }) => {
      return `Wargame analysis complete for scenario: ${(scenario as any)?.title}`;
    },
    render: ({ status, args }) => <ScenarioWargameRender status={status} args={args} />,
  });
}
