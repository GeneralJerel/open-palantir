/**
 * Event bridge between the vanilla TypeScript app and the CopilotKit React island.
 *
 * The vanilla app calls `appBridge.update({ ... })` to push state;
 * the React side subscribes via `appBridge.subscribe(fn)`.
 */

export interface BridgeState {
  activePanels: string[];
  selectedCountry: string | null;
  marketWatchlist: string[];
  alertCount: number;
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  ciiScores: Record<string, number>;
  correlationSignals: Array<{ type: string; summary: string; severity: number; timestamp: string }>;
  recentHeadlines: Array<{ title: string; source: string; timestamp: string; category?: string }>;
  activeMapLayers: string[];
}

type Listener = (state: Partial<BridgeState>) => void;

class AppBridge {
  private state: Partial<BridgeState> = {};
  private listeners = new Set<Listener>();

  /** Push a partial state update from the vanilla app. */
  update(patch: Partial<BridgeState>): void {
    this.state = { ...this.state, ...patch };
    for (const fn of this.listeners) {
      fn(this.state);
    }
  }

  /** Subscribe to state changes. Returns an unsubscribe function. */
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state); // Emit current state immediately
    return () => this.listeners.delete(fn);
  }

  /** Read current state snapshot. */
  getState(): Partial<BridgeState> {
    return this.state;
  }
}

export const appBridge = new AppBridge();
