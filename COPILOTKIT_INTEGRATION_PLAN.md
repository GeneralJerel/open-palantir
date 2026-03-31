# CopilotKit Integration Plan for WorldMonitor

## Architecture Challenge

WorldMonitor is a **vanilla TypeScript + Vite SPA** with zero React dependency (uses raw DOM manipulation via `h()` helper). CopilotKit is a **React-based library**. We'll use a **React micro-island** pattern — mount a small React tree solely for the CopilotKit sidepanel, bridging it to the existing app via a shared event bus.

---

## Phase 1: Foundation — React Island + CopilotKit Provider

### 1.1 Install Dependencies

```bash
npm install react react-dom @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
npm install -D @types/react @types/react-dom
```

### 1.2 Create the React Mount Point

Add a dedicated `<div id="copilot-root">` in `index.html`, sibling to the main app container. This isolates the React tree from the vanilla DOM app.

**File: `index.html`**
```html
<!-- After the main app container -->
<div id="copilot-root"></div>
```

### 1.3 Create the CopilotKit Island Entry

**File: `src/copilot/copilot-island.tsx`**

```tsx
import { createRoot } from 'react-dom/client';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { WorldMonitorCopilotProvider } from './WorldMonitorCopilotProvider';

export function mountCopilotIsland() {
  const container = document.getElementById('copilot-root');
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <CopilotKit runtimeUrl="/api/copilot">
      <WorldMonitorCopilotProvider>
        <CopilotSidebar
          labels={{
            title: 'World Monitor AI',
            initial: 'Ask me about global events, markets, conflicts, or any data on your dashboard.',
          }}
          defaultOpen={false}
          clickOutsideToClose={true}
        />
      </WorldMonitorCopilotProvider>
    </CopilotKit>
  );
}
```

### 1.4 Bootstrap from `main.ts`

```ts
// At the end of main.ts, after app init
import { mountCopilotIsland } from './copilot/copilot-island';
mountCopilotIsland();
```

### 1.5 Vite Config Update

Add React support to `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';

// Add to plugins array:
plugins: [
  react({ include: /\.tsx$/ }), // Only process .tsx files as React
  // ...existing plugins
]
```

This scopes React/JSX transforms to `.tsx` files only, leaving the existing `.ts` codebase untouched.

---

## Phase 2: Bridge Layer — Connecting Vanilla App State to CopilotKit

### 2.1 Event Bridge (`src/copilot/app-bridge.ts`)

A pub/sub bridge that lets the vanilla TypeScript app push state into the React CopilotKit island.

```ts
// Singleton event bridge between vanilla app and React island
type BridgeState = {
  activePanels: string[];
  selectedCountry: string | null;
  marketWatchlist: string[];
  alertCount: number;
  mapCenter: { lat: number; lng: number };
  ciiScores: Record<string, number>;
  correlationSignals: any[];
  recentHeadlines: Array<{ title: string; source: string; timestamp: string }>;
};

class AppBridge {
  private state: Partial<BridgeState> = {};
  private listeners = new Set<(state: Partial<BridgeState>) => void>();

  update(patch: Partial<BridgeState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach(fn => fn(this.state));
  }

  subscribe(fn: (state: Partial<BridgeState>) => void) {
    this.listeners.add(fn);
    fn(this.state); // Emit current state on subscribe
    return () => this.listeners.delete(fn);
  }

  getState() { return this.state; }
}

export const appBridge = new AppBridge();
```

### 2.2 Hook Bridge State into Existing App

Sprinkle `appBridge.update()` calls into key locations in the existing codebase:

| Location | Data Pushed |
|----------|-------------|
| `App.ts` → panel add/remove | `activePanels` |
| `MapContainer.ts` → map move | `mapCenter` |
| `data-loader.ts` → headlines load | `recentHeadlines` |
| `MarketPanel.ts` → watchlist change | `marketWatchlist` |
| `country-instability.ts` → CII update | `ciiScores` |
| `correlation-engine.ts` → signal fire | `correlationSignals` |
| `CountryIntelModal.ts` → country select | `selectedCountry` |

---

## Phase 3: `useCopilotReadable` — Expose Dashboard State to the Copilot

### 3.1 WorldMonitorCopilotProvider Component

**File: `src/copilot/WorldMonitorCopilotProvider.tsx`**

```tsx
import { useCopilotReadable } from '@copilotkit/react-core';
import { useAppBridge } from './useAppBridge';

export function WorldMonitorCopilotProvider({ children }: { children: React.ReactNode }) {
  const state = useAppBridge(); // Custom hook consuming appBridge

  useCopilotReadable({
    description: 'Currently active dashboard panels the user is viewing',
    value: state.activePanels,
  });

  useCopilotReadable({
    description: 'The country the user is currently focused on (if any)',
    value: state.selectedCountry,
  });

  useCopilotReadable({
    description: 'Recent breaking headlines from global news feeds',
    value: state.recentHeadlines,
  });

  useCopilotReadable({
    description: 'Country Instability Index scores (0-100, higher = more unstable)',
    value: state.ciiScores,
  });

  useCopilotReadable({
    description: 'Active correlation signals detected across data streams',
    value: state.correlationSignals,
  });

  useCopilotReadable({
    description: 'User stock/crypto/commodity watchlist symbols',
    value: state.marketWatchlist,
  });

  useCopilotReadable({
    description: 'Current map viewport center coordinates',
    value: state.mapCenter,
  });

  return <>{children}</>;
}
```

### 3.2 `useAppBridge` Hook

**File: `src/copilot/useAppBridge.ts`**

```ts
import { useState, useEffect } from 'react';
import { appBridge } from './app-bridge';

export function useAppBridge() {
  const [state, setState] = useState(appBridge.getState());

  useEffect(() => {
    return appBridge.subscribe(setState);
  }, []);

  return state;
}
```

---

## Phase 4: `useCopilotAction` — Custom Frontend Tools

### 4.1 Action: Navigate to Country

**File: `src/copilot/actions/navigateToCountry.tsx`**

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

export function useNavigateToCountryAction() {
  useCopilotAction({
    name: 'navigateToCountry',
    description: 'Pan the map to a specific country and open its intelligence brief',
    parameters: [
      { name: 'countryCode', type: 'string', description: 'ISO 3166-1 alpha-2 country code (e.g. "UA", "TW", "IR")' },
      { name: 'openBrief', type: 'boolean', description: 'Whether to open the country intel modal', required: false },
    ],
    handler: async ({ countryCode, openBrief }) => {
      // Dispatch to vanilla app via CustomEvent
      window.dispatchEvent(new CustomEvent('copilot:navigate-country', {
        detail: { countryCode, openBrief: openBrief ?? true },
      }));
      return `Navigated to ${countryCode}`;
    },
  });
}
```

### 4.2 Action: Add Dashboard Panel

**File: `src/copilot/actions/addPanel.tsx`**

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

export function useAddPanelAction() {
  useCopilotAction({
    name: 'addDashboardPanel',
    description: 'Add a new panel to the user\'s dashboard. Available panels include: market, conflict, cyber-threats, wildfires, aviation, maritime, weather, forecast, correlation, country-brief, cii, strategic-posture, sanctions, displacement',
    parameters: [
      { name: 'panelType', type: 'string', description: 'The type of panel to add' },
      { name: 'config', type: 'object', description: 'Optional panel configuration (e.g. which symbols for market panel)', required: false },
    ],
    handler: async ({ panelType, config }) => {
      window.dispatchEvent(new CustomEvent('copilot:add-panel', {
        detail: { panelType, config },
      }));
      return `Added ${panelType} panel to dashboard`;
    },
  });
}
```

### 4.3 Action: Search Global Events

**File: `src/copilot/actions/searchEvents.tsx`**

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

export function useSearchEventsAction() {
  useCopilotAction({
    name: 'searchGlobalEvents',
    description: 'Search across all data feeds (news, conflicts, markets, disasters) for events matching a query',
    parameters: [
      { name: 'query', type: 'string', description: 'Search query (e.g. "Taiwan strait military", "oil price spike")' },
      { name: 'domain', type: 'string', description: 'Optional domain filter: all, conflict, market, climate, cyber, aviation', required: false },
    ],
    handler: async ({ query, domain }) => {
      // Bridge to the existing SearchManager
      window.dispatchEvent(new CustomEvent('copilot:search', {
        detail: { query, domain: domain ?? 'all' },
      }));

      // Wait for results via promise-based bridge
      return new Promise((resolve) => {
        const handler = (e: CustomEvent) => {
          window.removeEventListener('copilot:search-results', handler as EventListener);
          resolve(JSON.stringify(e.detail.results.slice(0, 10)));
        };
        window.addEventListener('copilot:search-results', handler as EventListener);
        setTimeout(() => resolve('Search timed out'), 5000);
      });
    },
  });
}
```

### 4.4 Action: Generate Country Brief

**File: `src/copilot/actions/generateBrief.tsx`**

```tsx
import { useCopilotAction } from '@copilotkit/react-core';

export function useGenerateBriefAction() {
  useCopilotAction({
    name: 'generateCountryBrief',
    description: 'Generate an intelligence brief for a country using all available data streams (CII, conflicts, economic indicators, military posture)',
    parameters: [
      { name: 'countryCode', type: 'string', description: 'ISO 3166-1 alpha-2 country code' },
    ],
    handler: async ({ countryCode }) => {
      window.dispatchEvent(new CustomEvent('copilot:generate-brief', {
        detail: { countryCode },
      }));

      return new Promise((resolve) => {
        const handler = (e: CustomEvent) => {
          window.removeEventListener('copilot:brief-result', handler as EventListener);
          resolve(e.detail.brief);
        };
        window.addEventListener('copilot:brief-result', handler as EventListener);
        setTimeout(() => resolve('Brief generation timed out'), 15000);
      });
    },
  });
}
```

### 4.5 Register All Actions in Provider

Update `WorldMonitorCopilotProvider.tsx` to include all actions:

```tsx
export function WorldMonitorCopilotProvider({ children }) {
  // ... useCopilotReadable hooks from Phase 3 ...

  // Custom actions (useCopilotAction / frontend tools)
  useNavigateToCountryAction();
  useAddPanelAction();
  useSearchEventsAction();
  useGenerateBriefAction();

  return <>{children}</>;
}
```

---

## Phase 5: CopilotKit Runtime (API Route)

### 5.1 Vercel Edge Function

**File: `api/copilot.ts`**

```ts
import { CopilotRuntime, OpenAIAdapter } from '@copilotkit/runtime';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // Reuse worldmonitor's existing LLM provider chain
  const runtime = new CopilotRuntime();
  const adapter = new OpenAIAdapter({
    // Use OpenRouter (already in the project) as the LLM backend
    model: 'google/gemini-2.5-flash',
  });

  return runtime.response(req, adapter);
}
```

Alternatively, use the existing Anthropic SDK already in `package.json` with CopilotKit's `AnthropicAdapter`.

---

## Phase 6: Event Listeners in Vanilla App

Wire up event listeners in `App.ts` or `event-handlers.ts` to handle the copilot's dispatched actions:

```ts
// In App.ts or event-handlers.ts
window.addEventListener('copilot:navigate-country', (e: CustomEvent) => {
  const { countryCode, openBrief } = e.detail;
  this.mapContainer.flyToCountry(countryCode);
  if (openBrief) this.openCountryIntelModal(countryCode);
});

window.addEventListener('copilot:add-panel', (e: CustomEvent) => {
  const { panelType, config } = e.detail;
  this.addPanel(panelType, config);
});

window.addEventListener('copilot:search', (e: CustomEvent) => {
  const { query, domain } = e.detail;
  const results = this.searchManager.search(query, { domain });
  window.dispatchEvent(new CustomEvent('copilot:search-results', {
    detail: { results },
  }));
});

window.addEventListener('copilot:generate-brief', (e: CustomEvent) => {
  const { countryCode } = e.detail;
  this.countryIntel.generateBrief(countryCode).then(brief => {
    window.dispatchEvent(new CustomEvent('copilot:brief-result', {
      detail: { brief },
    }));
  });
});
```

---

## File Structure Summary

```
src/copilot/
├── copilot-island.tsx              # React micro-island entry point
├── WorldMonitorCopilotProvider.tsx  # useCopilotReadable + action registration
├── app-bridge.ts                   # Vanilla ↔ React state bridge
├── useAppBridge.ts                 # React hook for bridge subscription
└── actions/
    ├── navigateToCountry.tsx       # Pan map + open intel modal
    ├── addPanel.tsx                # Add dashboard panels by voice/chat
    ├── searchEvents.tsx            # Cross-domain event search
    └── generateBrief.tsx           # Country intelligence brief generation
```

---

## Integration Points (Minimal Vanilla App Changes)

| Existing File | Change | Purpose |
|---------------|--------|---------|
| `index.html` | Add `<div id="copilot-root">` | React mount point |
| `src/main.ts` | Import + call `mountCopilotIsland()` | Bootstrap React island |
| `src/App.ts` | Add `appBridge.update()` calls | Push panel state |
| `src/app/event-handlers.ts` | Add `copilot:*` event listeners | Handle copilot actions |
| `src/app/data-loader.ts` | Add `appBridge.update()` for headlines | Push data state |
| `src/components/MapContainer.ts` | Add `appBridge.update()` on move | Push map state |
| `vite.config.ts` | Add `@vitejs/plugin-react` for `.tsx` | Enable JSX transform |
| `api/copilot.ts` | New edge function | CopilotKit runtime endpoint |

---

## Key Design Decisions

1. **React Island pattern** — Avoids rewriting any existing vanilla TS code; CopilotKit lives in its own isolated React tree
2. **CustomEvent bridge** — Lightweight, native browser API; no state management library needed
3. **`appBridge` singleton** — Vanilla app pushes state in; React hooks consume it via `useSyncExternalStore`-style pattern
4. **Scoped `.tsx` transform** — Only files in `src/copilot/` use React/JSX; zero impact on existing `.ts` build
5. **Reuse existing LLM infra** — The `/api/copilot.ts` endpoint can leverage the project's existing OpenRouter/Groq/Anthropic provider chain
