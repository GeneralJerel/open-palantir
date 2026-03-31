import { useCopilotAction } from '@copilotkit/react-core';

const COMMON_LAYERS = [
  'conflicts',
  'military-bases',
  'nuclear',
  'submarine-cables',
  'ais',
  'adsb',
  'fires',
  'earthquakes',
  'weather',
  'gps-jamming',
  'power-outages',
  'protests',
  'refugees',
  'sanctions',
  'pipelines',
  'ports',
  'borders',
];

export function useToggleMapLayerAction() {
  useCopilotAction({
    name: 'toggleMapLayer',
    description: `Toggle a map layer on or off. Common layers: ${COMMON_LAYERS.join(', ')}. Use this when the user asks to show or hide specific data on the map.`,
    parameters: [
      {
        name: 'layer',
        type: 'string',
        description: `The layer identifier to toggle. Common values: ${COMMON_LAYERS.join(', ')}`,
        required: true,
      },
      {
        name: 'enabled',
        type: 'boolean',
        description: 'Whether to enable (true) or disable (false) the layer',
        required: true,
      },
    ],
    handler: async ({ layer, enabled }) => {
      window.dispatchEvent(
        new CustomEvent('copilot:toggle-layer', {
          detail: { layer, enabled },
        }),
      );
      return `${enabled ? 'Enabled' : 'Disabled'} map layer: ${layer}`;
    },
  });
}
