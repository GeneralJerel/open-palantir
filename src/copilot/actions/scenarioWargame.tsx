import { useCopilotAction } from '@copilotkit/react-core';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SeverityBadge } from '../components/SeverityBadge';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { INTEL_THEME, severityColor, recommendationColor } from '../components/intel-theme';

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
    render: ({ status, args }) => {
      if (status === 'inProgress' && !(args.scenario as any)?.title) {
        return (
          <IntelCard>
            <ClassifiedHeader classification="TOP SECRET // SCI" />
            <LoadingIndicator />
          </IntelCard>
        );
      }

      const t = INTEL_THEME;
      const scenario = args.scenario as any;
      const move = args.initialMove as any;
      const responses = (args.responseOptions as any[]) || [];

      return (
        <IntelCard>
          <ClassifiedHeader classification={scenario?.classification || 'TOP SECRET // SCI'} />

          {/* Scenario header */}
          <div style={{ padding: t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Scenario Wargame
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{scenario?.title}</div>
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
            <div style={{ fontSize: 12, color: t.colors.textDim, marginTop: t.spacing.sm }}>{scenario?.description}</div>
          </div>

          {/* Initial move */}
          {move && (
            <>
              <SectionHeader title="Initial Move" />
              <div style={{ padding: t.spacing.lg }}>
                <div
                  style={{
                    border: `1px solid ${severityColor(move.severity)}`,
                    borderRadius: 6,
                    padding: t.spacing.md,
                    background: `${severityColor(move.severity)}11`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.spacing.sm }}>
                    <span style={{ fontFamily: t.fonts.mono, fontSize: 11, color: t.colors.accent }}>{move.actor}</span>
                    <SeverityBadge level={move.severity} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: t.spacing.sm }}>{move.action}</div>

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
            </>
          )}

          {/* Response options */}
          {responses.length > 0 && (
            <>
              <SectionHeader title="Response Options" />
              <div style={{ padding: `${t.spacing.sm}px ${t.spacing.lg}px` }}>
                {responses.map((r: any, i: number) => {
                  const recColor = recommendationColor(r.recommendation);
                  return (
                    <div
                      key={i}
                      style={{
                        border: `1px solid ${t.colors.border}`,
                        borderRadius: 6,
                        padding: t.spacing.md,
                        marginBottom: t.spacing.sm,
                        background: t.colors.surface,
                      }}
                    >
                      {/* Title + recommendation */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{r.title}</span>
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

                      <div style={{ fontSize: 11, color: t.colors.textDim, marginBottom: t.spacing.sm }}>{r.description}</div>

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
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer */}
          <div
            style={{
              padding: `${t.spacing.sm}px ${t.spacing.lg}px`,
              fontFamily: t.fonts.mono,
              fontSize: 9,
              color: t.colors.textMuted,
              textAlign: 'center',
              borderTop: `1px solid ${t.colors.borderSubtle}`,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Wargame generated {new Date().toISOString().slice(0, 16)} // CopilotKit STRATCOM
          </div>
        </IntelCard>
      );
    },
  });
}
