import { useCopilotAction } from '@copilotkit/react-core';

export function useNavigateToCountryAction() {
  useCopilotAction({
    name: 'navigateToCountry',
    description:
      'Pan the map to a specific country and optionally open its intelligence brief. Use this when the user asks about a particular country or region.',
    parameters: [
      {
        name: 'countryCode',
        type: 'string',
        description: 'ISO 3166-1 alpha-2 country code (e.g. "UA", "TW", "IR", "CN", "US")',
        required: true,
      },
      {
        name: 'openBrief',
        type: 'boolean',
        description: 'Whether to open the country intelligence modal (defaults to true)',
        required: false,
      },
    ],
    handler: async ({ countryCode, openBrief }) => {
      window.dispatchEvent(
        new CustomEvent('copilot:navigate-country', {
          detail: { countryCode: (countryCode as string).toUpperCase(), openBrief: openBrief ?? true },
        }),
      );
      return `Navigated to country ${countryCode}`;
    },
  });
}
