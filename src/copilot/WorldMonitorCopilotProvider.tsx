import { useCopilotReadable } from '@copilotkit/react-core';
import { useAppBridge } from './useAppBridge';
import { useNavigateToCountryAction } from './actions/navigateToCountry';
import { useAddPanelAction } from './actions/addPanel';
import { useSearchEventsAction } from './actions/searchEvents';
import { useToggleMapLayerAction } from './actions/toggleMapLayer';

interface Props {
  children: React.ReactNode;
}

/**
 * Bridges WorldMonitor's vanilla app state into CopilotKit via useCopilotReadable,
 * and registers all custom frontend actions via useCopilotAction.
 */
export function WorldMonitorCopilotProvider({ children }: Props) {
  const state = useAppBridge();

  // ── Expose dashboard state to the copilot ──────────────────────────

  useCopilotReadable({
    description: 'Currently active dashboard panels the user is viewing',
    value: state.activePanels ?? [],
  });

  useCopilotReadable({
    description: 'The country the user is currently focused on (ISO alpha-2 code), or null',
    value: state.selectedCountry ?? null,
  });

  useCopilotReadable({
    description: 'Recent breaking headlines from global news feeds (title, source, timestamp, category)',
    value: state.recentHeadlines ?? [],
  });

  useCopilotReadable({
    description:
      'Country Instability Index (CII) scores: object mapping country codes to 0–100 scores (higher = more unstable)',
    value: state.ciiScores ?? {},
  });

  useCopilotReadable({
    description:
      'Active cross-stream correlation signals detected by the correlation engine (type, summary, severity 0–1, timestamp)',
    value: state.correlationSignals ?? [],
  });

  useCopilotReadable({
    description: 'User stock/crypto/commodity watchlist symbols',
    value: state.marketWatchlist ?? [],
  });

  useCopilotReadable({
    description: 'Current map viewport center (lat, lng) and zoom level',
    value: state.mapCenter ? { ...state.mapCenter, zoom: state.mapZoom } : null,
  });

  useCopilotReadable({
    description: 'Currently enabled map layers (e.g. conflicts, military-bases, ais, fires)',
    value: state.activeMapLayers ?? [],
  });

  // ── Register custom frontend actions (tools) ──────────────────────

  useNavigateToCountryAction();
  useAddPanelAction();
  useSearchEventsAction();
  useToggleMapLayerAction();

  return <>{children}</>;
}
