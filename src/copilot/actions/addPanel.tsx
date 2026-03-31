import { useCopilotAction } from '@copilotkit/react-core';

const AVAILABLE_PANELS = [
  'market',
  'conflict',
  'cyber-threats',
  'satellite-fires',
  'aviation',
  'maritime',
  'weather',
  'forecast',
  'military-correlation',
  'escalation-correlation',
  'economic-correlation',
  'disaster-correlation',
  'country-brief',
  'cii',
  'strategic-posture',
  'strategic-risk',
  'sanctions',
  'displacement',
  'earthquakes',
  'stablecoin',
  'etf-flows',
  'macro-signals',
  'fear-greed',
  'yield-curve',
  'earnings-calendar',
  'economic-calendar',
  'chat-analyst',
];

export function useAddPanelAction() {
  useCopilotAction({
    name: 'addDashboardPanel',
    description: `Add a new panel to the user's dashboard. Available panel types: ${AVAILABLE_PANELS.join(', ')}. Use this when the user asks to see specific data or add a widget.`,
    parameters: [
      {
        name: 'panelType',
        type: 'string',
        description: `The type of panel to add. Must be one of: ${AVAILABLE_PANELS.join(', ')}`,
        required: true,
      },
    ],
    handler: async ({ panelType }) => {
      const type = panelType as string;
      if (!AVAILABLE_PANELS.includes(type)) {
        return `Unknown panel type "${type}". Available panels: ${AVAILABLE_PANELS.join(', ')}`;
      }
      window.dispatchEvent(
        new CustomEvent('copilot:add-panel', {
          detail: { panelType: type },
        }),
      );
      return `Added ${type} panel to the dashboard`;
    },
  });
}
