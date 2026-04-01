import { useState } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { IntelCard } from '../components/IntelCard';
import { ClassifiedHeader } from '../components/ClassifiedHeader';
import { SeverityBadge } from '../components/SeverityBadge';
import { SectionHeader } from '../components/SectionHeader';
import { ExpandedModal } from '../components/ExpandedModal';
import { INTEL_THEME } from '../components/intel-theme';

const t = INTEL_THEME;

function ThreatResponseCard({
  args,
  status,
  respond,
  compact,
  onExpand,
}: {
  args: Record<string, unknown>;
  status: string;
  respond?: (response: string) => void;
  compact?: boolean;
  onExpand?: () => void;
}) {
  const impacts = (args.impactAssessment as any[]) || [];
  const actions = (args.dashboardActions as any[]) || [];
  const isExecuting = status === 'executing';

  const visibleImpacts = compact ? impacts.slice(0, 3) : impacts;

  return (
    <>
      <ClassifiedHeader classification="ACTION REQUIRED" color={t.colors.actionRequired} />

      {/* Proposed action */}
      <div style={{ padding: compact ? t.spacing.md : t.spacing.lg, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.actionRequired, letterSpacing: 2, textTransform: 'uppercase' }}>
            Recommended Response
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
        <div style={{ fontSize: compact ? 14 : 15, fontWeight: 700, marginBottom: t.spacing.sm }}>{args.proposedAction as string}</div>
        <SeverityBadge level={args.urgency as string} label={`URGENCY: ${args.urgency}`} />
      </div>

      {/* Rationale */}
      <div style={{ padding: `${t.spacing.md}px ${compact ? t.spacing.md : t.spacing.lg}px`, fontSize: compact ? 11 : 12, color: t.colors.textDim, borderBottom: `1px solid ${t.colors.borderSubtle}` }}>
        {args.rationale as string}
      </div>

      {/* Impact assessment */}
      {visibleImpacts.length > 0 && (
        <>
          <SectionHeader title="Impact Assessment" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {visibleImpacts.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: t.spacing.sm,
                  alignItems: 'flex-start',
                  padding: `${t.spacing.xs}px 0`,
                  borderBottom: i < visibleImpacts.length - 1 ? `1px solid ${t.colors.borderSubtle}` : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: t.fonts.mono,
                    fontSize: 9,
                    color: t.colors.textMuted,
                    textTransform: 'uppercase',
                    minWidth: 65,
                    flexShrink: 0,
                    paddingTop: 2,
                  }}
                >
                  {item.domain}
                </span>
                <span style={{ flex: 1, fontSize: 11 }}>{item.impact}</span>
                <SeverityBadge level={item.severity} />
              </div>
            ))}
            {compact && impacts.length > 3 && (
              <div style={{ fontFamily: t.fonts.mono, fontSize: 10, color: t.colors.textMuted, padding: `${t.spacing.xs}px 0`, letterSpacing: 1 }}>
                +{impacts.length - 3} MORE IMPACTS
              </div>
            )}
          </div>
        </>
      )}

      {/* Dashboard actions preview */}
      {actions.length > 0 && (
        <>
          <SectionHeader title="Dashboard Actions on Approval" />
          <div style={{ padding: `${t.spacing.sm}px ${compact ? t.spacing.md : t.spacing.lg}px` }}>
            {actions.map((a: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: t.spacing.sm,
                  padding: `${t.spacing.xs}px 0`,
                  fontSize: 11,
                }}
              >
                <span style={{ color: t.colors.accent }}>{'>'}</span>
                <span style={{ color: t.colors.textDim }}>{a.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Approve / Reject buttons */}
      {isExecuting ? (
        <div style={{ display: 'flex', gap: t.spacing.sm, padding: compact ? t.spacing.md : t.spacing.lg, borderTop: `1px solid ${t.colors.border}` }}>
          <button
            onClick={() => respond?.('APPROVED')}
            style={{
              flex: 1,
              padding: `${t.spacing.sm}px ${t.spacing.lg}px`,
              background: `${t.colors.low}22`,
              color: t.colors.low,
              border: `1px solid ${t.colors.low}`,
              borderRadius: 4,
              fontFamily: t.fonts.mono,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Approve
          </button>
          <button
            onClick={() => respond?.('REJECTED')}
            style={{
              flex: 1,
              padding: `${t.spacing.sm}px ${t.spacing.lg}px`,
              background: `${t.colors.critical}11`,
              color: t.colors.critical,
              border: `1px solid ${t.colors.critical}44`,
              borderRadius: 4,
              fontFamily: t.fonts.mono,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Reject
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: compact ? t.spacing.md : t.spacing.lg,
            textAlign: 'center',
            fontFamily: t.fonts.mono,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            color: status === 'complete' ? t.colors.low : t.colors.textMuted,
            borderTop: `1px solid ${t.colors.border}`,
            textTransform: 'uppercase',
          }}
        >
          {status === 'complete' ? 'RESPONSE SUBMITTED' : 'AWAITING AUTHORIZATION...'}
        </div>
      )}
    </>
  );
}

export function useThreatResponseAction() {
  useCopilotAction({
    name: 'threatResponseRecommendation',
    description:
      'Propose a recommended response action for user approval. Use AFTER generating a threat briefing or wargame. The user can approve (triggering dashboard actions like navigating to a country, adding panels, toggling map layers) or reject (prompting you to ask for alternative guidance).',
    parameters: [
      { name: 'proposedAction', type: 'string', description: 'The recommended response action', required: true },
      { name: 'rationale', type: 'string', description: 'Why this action is recommended', required: true },
      { name: 'urgency', type: 'string', description: 'IMMEDIATE, HIGH, MODERATE, or LOW', required: true },
      {
        name: 'impactAssessment',
        type: 'object[]',
        description: 'Expected impacts of this action',
        attributes: [
          { name: 'domain', type: 'string', description: 'e.g. diplomatic, economic, military, intelligence', required: true },
          { name: 'impact', type: 'string', description: 'Impact description', required: true },
          { name: 'severity', type: 'string', description: 'CRITICAL, HIGH, MODERATE, or LOW', required: true },
        ],
      },
      {
        name: 'dashboardActions',
        type: 'object[]',
        description: 'Dashboard actions to execute if approved (navigateToCountry, addDashboardPanel, toggleMapLayer)',
        attributes: [
          { name: 'type', type: 'string', description: 'Action type: navigateToCountry, addDashboardPanel, or toggleMapLayer', required: true },
          { name: 'params', type: 'string', description: 'JSON parameters for the action', required: true },
          { name: 'label', type: 'string', description: 'Human-readable description', required: true },
        ],
      },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => {
      const [expanded, setExpanded] = useState(false);
      return (
        <>
          <IntelCard>
            <ThreatResponseCard args={args} status={status} respond={respond} compact onExpand={() => setExpanded(true)} />
          </IntelCard>

          {expanded && (
            <ExpandedModal onClose={() => setExpanded(false)}>
              <ThreatResponseCard args={args} status={status} respond={respond} />
            </ExpandedModal>
          )}
        </>
      );
    },
  });
}
