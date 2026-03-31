import { useSyncExternalStore } from 'react';
import { appBridge, type BridgeState } from './app-bridge';

/** React hook that subscribes to the vanilla app's state via the AppBridge. */
export function useAppBridge(): Partial<BridgeState> {
  return useSyncExternalStore(
    (onStoreChange) => appBridge.subscribe(onStoreChange),
    () => appBridge.getState(),
    () => appBridge.getState(),
  );
}
