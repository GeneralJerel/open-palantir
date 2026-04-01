import { createRoot } from 'react-dom/client';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import './copilot-theme.css';
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

  // Shrink the main app when the sidebar opens instead of overlapping
  setupSidebarPush(container);
}

/**
 * Watch for CopilotKit's `sidebarExpanded` class and push the main #app
 * content to the left so the sidebar doesn't overlap the dashboard.
 */
function setupSidebarPush(copilotRoot: HTMLElement): void {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  // CopilotKit sidebar width is 28rem (from its CSS)
  const SIDEBAR_WIDTH = '28rem';

  // Apply a smooth transition on the app container
  appEl.style.transition = 'margin-right 0.3s ease';

  const observer = new MutationObserver(() => {
    const wrapper = copilotRoot.querySelector('.copilotKitSidebarContentWrapper');
    const isOpen = wrapper?.classList.contains('sidebarExpanded') ?? false;
    appEl.style.marginRight = isOpen ? SIDEBAR_WIDTH : '0px';
  });

  observer.observe(copilotRoot, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}
