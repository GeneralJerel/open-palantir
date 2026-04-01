# Handoff

## Scope
- Item: open-palantir copilot generative UI actions (scenarioWargame, cascadeAnalysis, threatResponse)
- Goal: Identify why wargame/red-teaming and cascade analysis actions don't work as expected

## What's Broken

### scenarioWargame.tsx — Theater overlay never renders
- **Root cause**: `useRef` used for `scenarioActivated` flag, but the value is read in JSX conditional rendering. Refs don't trigger re-renders, so the "Theater Force Disposition" section never becomes visible.
- **Secondary issue**: Region matching is hardcoded to China/Taiwan/Iran. Any other scenario silently skips map overlay activation.
- **Tertiary issue**: Force count data is always from the static `CHINA_TAIWAN_IRAN_OVERLAY` fixture, not from LLM output.

### Chip buttons don't trigger actions
- CASCADE ANALYSIS, WARGAME SCENARIO, RECOMMEND RESPONSE chips on threat briefing have no `onClick` handlers. Users click them and nothing happens.

### threatResponse HITL never triggers automatically
- The intended flow is: briefing → LLM proposes response → user approves/rejects. But nothing tells the LLM to chain into the `threatResponseRecommendation` action after a briefing.

## Files Reviewed
- `src/copilot/actions/scenarioWargame.tsx` — wargame action with static overlay data
- `src/copilot/actions/cascadeAnalysis.tsx` — cascade analysis action (no expand modal)
- `src/copilot/actions/threatResponse.tsx` — HITL action (renderAndWaitForResponse)
- `src/copilot/actions/threatBriefing.tsx` — threat briefing with non-functional chips
- `src/copilot/data/china-taiwan-iran-scenario.ts` — static scenario fixture
- `src/copilot/WorldMonitorCopilotProvider.tsx` — all 8 actions registered
- `src/App.ts:1037-1070` — main app listener for `copilot:activate-scenario` event

## Risk Areas
- `useRef` vs `useState` bug is a silent failure — no errors, just invisible UI
- Hardcoded scenario data limits the wargame action to exactly one pre-scripted scenario
- No mechanism for LLM action chaining (briefing → response recommendation)

## Suggested Priority
1. Fix `useRef` → `useState` in scenarioWargame.tsx (P0 — feature completely broken)
2. Wire up chip onClick handlers in threatBriefing.tsx (P1 — UX expectations violated)
3. Add LLM chaining hints for threatResponse (P1 — HITL flow never activates)
4. Consider making overlay data dynamic or supporting multiple scenario fixtures (P1)
