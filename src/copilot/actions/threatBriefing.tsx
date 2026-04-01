import { useState, useCallback } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, MessageRole } from '@copilotkit/runtime-client-gql';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SeverityBadge } from '../components/SeverityBadge';
import { ConfidenceIndicator } from '../components/ConfidenceIndicator';
import { SectionHeader } from '../components/SectionHeader';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ExpandedModal } from '../components/ExpandedModal';
import { INTEL_THEME, severityColor } from '../components/intel-theme';

function ThreatBriefingCard({ args, compact, onExpand }: { args: Record<string, unknown>; compact?: boolean; onExpand?: () => void }) {
  const t = INTEL_THEME;
  const keyFindings = (args.keyFindings as any[]) || [];
  const recentEvents = (args.recentEvents as any[]) || [];
  const sources = (args.sources as any[]) || [];

  // In compact mode, show fewer items
  const visibleFindings = compact ? keyFindings.slice(0, 3) : keyFindings;
  const visibleEvents = compact ? recentEvents.slice(0, 3) : recentEvents;

  return (
    <>
      <ClassifiedHeader />

      {/* Country header */}
      <div style={{ padding: compact ? t.spacing.md : t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        <div style={{ fontSize: compact ? 18 : 24, fontWeight: 700, marginBottom: 4 }}>
          {args.flagEmoji as string} {args.countryName as string}
        </div>
        <div style={{ fontFamily: t.fonts.mono, fontSize: 11, color: t.colors.textDim }}>
          {(args.countryCode as string)?.toUpperCase()} // THREAT ASSESSMENT
        </div>
        <div style={{ marginTop: t.spacing.md, display: 'flex', alignItems: 'center', gap: t.spacing.sm }}>
          <SeverityBadge level={args.threatLevel as string} label={`THREAT LEVEL: ${args.threatLevel}`} large />
          {compact && onExpand && (
            <button
              onClick={onExpand}
              style={{
                marginLeft: 'auto',
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

      {/* Executive summary */}
      <div style={{ padding: compact ? `${t.spacing.md}px ${t.spacing.md}px` : `${t.spacing.lg}px`, color: t.colors.textDim, fontSize: compact ? 12 : 13, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        {args.summary as string}
      </div>

      {/* Key findings */}
      {visibleFindings.length > 0 && (
        <>
          <SectionHeader title="Key Findings" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleFindings.map((f: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: t.spacing.sm,
                  alignItems: 'flex-start',
                  padding: `${t.spacing.sm}px 0`,
                  borderBottom: i < visibleFindings.length - 1 ? `1px solid ${t.colors.borderSubtle}` : 'none',
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
            {compact && keyFindings.length > 3 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{keyFindings.length - 3} MORE FINDINGS
              </div>
            )}
          </div>
        </>
      )}

      {/* Recent events timeline */}
      {visibleEvents.length > 0 && (
        <>
          <SectionHeader title="Recent Events" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleEvents.map((e: any, i: number) => (
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
            {compact && recentEvents.length > 3 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{recentEvents.length - 3} MORE EVENTS
              </div>
            )}
          </div>
        </>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <>
          <SectionHeader title="Sources" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {sources.map((s: any, i: number) => (
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
        Report generated {new Date().toISOString().slice(0, 16)} // SIGINT
      </div>
    </>
  );
}

function Chip({ label, onClick, style }: { label: string; onClick?: () => void; style?: React.CSSProperties }) {
  const t = INTEL_THEME;
  return (
    <button
      onClick={onClick}
      style={{
        background: t.colors.surface,
        border: `1px solid ${t.colors.border}`,
        color: t.colors.textDim,
        fontFamily: t.fonts.mono,
        fontSize: 10,
        letterSpacing: 0.5,
        padding: '4px 10px',
        borderRadius: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </button>
  );
}

function ThreatBriefingRender({ args }: { args: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const { appendMessage } = useCopilotChat();
  const t = INTEL_THEME;

  const countryName = args.countryName as string;

  const sendChatMessage = useCallback(
    (content: string) => {
      appendMessage(new TextMessage({ role: MessageRole.User, content }));
    },
    [appendMessage],
  );

  return (
    <>
      <IntelCard>
        <ThreatBriefingCard args={args} compact onExpand={() => setExpanded(true)} />

        {/* Action bar: expand + chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            padding: `${t.spacing.sm}px ${t.spacing.md}px`,
            borderTop: `1px solid ${t.colors.borderSubtle}`,
            alignItems: 'center',
          }}
        >
          <Chip
            label="EXPAND REPORT"
            onClick={() => setExpanded(true)}
            style={{ color: t.colors.accent, borderColor: t.colors.accent + '44' }}
          />
          <Chip label="CASCADE ANALYSIS" onClick={() => sendChatMessage(`Run a cascade analysis on ${countryName}`)} />
          <Chip label="WARGAME SCENARIO" onClick={() => sendChatMessage(`Run a wargame scenario for ${countryName}`)} />
          <Chip label="RECOMMEND RESPONSE" onClick={() => sendChatMessage(`Recommend a response for ${countryName}`)} />
        </div>
      </IntelCard>

      {expanded && (
        <ExpandedModal onClose={() => setExpanded(false)}>
          <ThreatBriefingCard args={args} />
        </ExpandedModal>
      )}
    </>
  );
}

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

      return <ThreatBriefingRender args={args} />;
    },
  });
}
