import { createRoot } from 'react-dom/client';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { WorldMonitorCopilotProvider } from './WorldMonitorCopilotProvider';

/**
 * Mount the CopilotKit React island into the #copilot-root div.
 *
 * This creates an isolated React tree that doesn't interfere with
 * the vanilla TypeScript app. Communication flows through the AppBridge
 * singleton and CustomEvent dispatches.
 */
export function mountCopilotIsland(): void {
  const container = document.getElementById('copilot-root');
  if (!container) {
    console.warn('[CopilotKit] #copilot-root element not found');
    return;
  }

  const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL || '/api/copilot';

  const root = createRoot(container);
  root.render(
    <CopilotKit runtimeUrl={runtimeUrl}>
      <WorldMonitorCopilotProvider>
        <CopilotSidebar
          defaultOpen={false}
          clickOutsideToClose={true}
          labels={{
            title: 'World Monitor AI',
            initial:
              'Ask me about global events, conflicts, markets, or any data on your dashboard. I can navigate the map, add panels, search events, and toggle map layers.',
          }}
        />
      </WorldMonitorCopilotProvider>
    </CopilotKit>,
  );
}
