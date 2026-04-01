import { useCopilotAction } from '@copilotkit/react-core';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SeverityBadge } from '../components/SeverityBadge';
import { ConfidenceIndicator } from '../components/ConfidenceIndicator';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { INTEL_THEME, severityColor } from '../components/intel-theme';

export function useThreatBriefingAction() {
  useCopilotAction({
    name: 'threatBriefing',
    description:
      'Generate a classified-style intelligence threat briefing for a country. Use when the user asks for a threat assessment, briefing, or intelligence report on a specific country.',
    parameters: [
      { name: 'countryCode', type: 'string', description: 'ISO alpha-2 country code', required: true },
      { name: 'countryName', type: 'string', description: 'Full country name', required: true },
      { name: 'flagEmoji', type: 'string', description: 'Flag emoji for the country', required: true },
      { name: 'threatLevel', type: 'string', description: 'CRITICAL, HIGH, MODERATE, or LOW', required: true },
      { name: 'summary', type: 'string', description: 'One-paragraph executive summary of the threat landscape', required: true },
      {
        name: 'keyFindings',
        type: 'object[]',
        description: 'Key intelligence findings (3-5 items)',
        attributes: [
          { name: 'finding', type: 'string', description: 'The finding text', required: true },
          { name: 'severity', type: 'string', description: 'HIGH, MODERATE, or LOW', required: true },
        ],
      },
      {
        name: 'recentEvents',
        type: 'object[]',
        description: 'Recent relevant events (3-5 items)',
        attributes: [
          { name: 'date', type: 'string', description: 'Date string (e.g. "2026-03-28")', required: true },
          { name: 'event', type: 'string', description: 'Event description', required: true },
          { name: 'significance', type: 'string', description: 'HIGH, MODERATE, or LOW', required: true },
        ],
      },
      {
        name: 'sources',
        type: 'object[]',
        description: 'Intelligence sources with confidence ratings',
        attributes: [
          { name: 'name', type: 'string', description: 'Source name', required: true },
          { name: 'confidence', type: 'string', description: 'HIGH, MODERATE, or LOW', required: true },
        ],
      },
    ],
    handler: async ({ countryCode, countryName, threatLevel }) => {
      return `Threat briefing generated for ${countryCode} (${countryName}) — Threat Level: ${threatLevel}`;
    },
    render: ({ status, args }) => {
      if (status === 'inProgress' && !args.summary) {
        return (
          <IntelCard>
            <ClassifiedHeader />
            <LoadingIndicator />
          </IntelCard>
        );
      }

      const t = INTEL_THEME;

      return (
        <IntelCard>
          <ClassifiedHeader />

          {/* Country header */}
          <div style={{ padding: t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {args.flagEmoji} {args.countryName}
            </div>
            <div style={{ fontFamily: t.fonts.mono, fontSize: 11, color: t.colors.textDim }}>
              {args.countryCode?.toUpperCase()} // THREAT ASSESSMENT
            </div>
            <div style={{ marginTop: t.spacing.md }}>
              <SeverityBadge level={args.threatLevel as string} label={`THREAT LEVEL: ${args.threatLevel}`} large />
            </div>
          </div>

          {/* Executive summary */}
          <div style={{ padding: t.spacing.lg, color: t.colors.textDim, fontSize: 12, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
            {args.summary}
          </div>

          {/* Key findings */}
          {(args.keyFindings as any[])?.length > 0 && (
            <>
              <SectionHeader title="Key Findings" />
              <div style={{ padding: `${t.spacing.sm}px ${t.spacing.lg}px` }}>
                {(args.keyFindings as any[]).map((f: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: t.spacing.sm,
                      alignItems: 'flex-start',
                      padding: `${t.spacing.sm}px 0`,
                      borderBottom: i < (args.keyFindings as any[]).length - 1 ? `1px solid ${t.colors.borderSubtle}` : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        minHeight: 16,
                        borderRadius: 2,
                        background: severityColor(f.severity),
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 12 }}>{f.finding}</span>
                    <SeverityBadge level={f.severity} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recent events timeline */}
          {(args.recentEvents as any[])?.length > 0 && (
            <>
              <SectionHeader title="Recent Events" />
              <div style={{ padding: `${t.spacing.sm}px ${t.spacing.lg}px` }}>
                {(args.recentEvents as any[]).map((e: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: t.spacing.md,
                      padding: `${t.spacing.sm}px 0`,
                      borderLeft: `2px solid ${severityColor(e.significance)}`,
                      paddingLeft: t.spacing.md,
                      marginBottom: t.spacing.xs,
                    }}
                  >
                    <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textDim, minWidth: 70, flexShrink: 0 }}>
                      {e.date}
                    </div>
                    <div style={{ fontSize: 12 }}>{e.event}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Sources */}
          {(args.sources as any[])?.length > 0 && (
            <>
              <SectionHeader title="Sources" />
              <div style={{ padding: `${t.spacing.sm}px ${t.spacing.lg}px` }}>
                {(args.sources as any[]).map((s: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: `${t.spacing.xs}px 0`,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{s.name}</span>
                    <ConfidenceIndicator confidence={s.confidence} />
                  </div>
                ))}
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
            Report generated {new Date().toISOString().slice(0, 16)} // CopilotKit SIGINT
          </div>
        </IntelCard>
      );
    },
  });
}
