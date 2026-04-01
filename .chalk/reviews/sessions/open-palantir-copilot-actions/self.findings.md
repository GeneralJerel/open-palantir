# Open Palantir — Generative UI Actions Review

> **Context**: The scenarioWargame and cascadeAnalysis CopilotKit actions render UI but have issues that prevent them from working correctly in practice. The threatResponse (HITL) action also has integration concerns.

## Verdict

- Block merge: no
- Blocking findings: P0=1, P1=3

## Findings

| ID  | Severity | Category    | File:Line                        | Status | Issue | Failure mode | Suggested fix | Confidence |
| --- | -------- | ----------- | -------------------------------- | ------ | ----- | ------------ | ------------- | ---------- |
| F01 | P0 | Bug | scenarioWargame.tsx:22-23 | Open | `scenarioActivated` is a `useRef` but is read in JSX (`{scenarioActivated.current && (...)}`). Setting `.current = true` inside `useEffect` does NOT trigger a re-render. The "Theater Force Disposition" section will never appear on initial render — it only shows if an unrelated prop/state change forces a re-render. | The theater overview section (force counts, map active indicator, overlay stats) is invisible to the user. They see the wargame card but never the theater disposition data that was supposed to appear when the map overlay activated. | Replace `useRef(false)` with `useState(false)`. The `useEffect` should call `setScenarioActivated(true)` which triggers a re-render and makes the conditional section visible. Keep a separate ref if needed to guard against double-dispatch of the CustomEvent. | High |
| F02 | P1 | Bug | scenarioWargame.tsx:32-33 | Open | The region regex (`/china\|taiwan\|iran\|indo.?pacific\|strait\|two.?front/i`) only matches a hardcoded set of regions. If the LLM generates a wargame for any other region (e.g., "Russia invades Estonia", "North Korea artillery strike"), the map overlay never activates and `scenarioActivated` stays false. The hardcoded `CHINA_TAIWAN_IRAN_OVERLAY` force data is always used regardless of the actual scenario. | For any non-China/Taiwan/Iran scenario, the Theater Force Disposition section never appears. For China/Taiwan/Iran scenarios, the force counts are from a static fixture, not from the LLM's generated scenario. The wargame action effectively only works for one pre-scripted scenario. | Either: (a) remove the region gate entirely and generate overlay data dynamically from LLM parameters, (b) add overlay fixtures for other common scenarios, or (c) make the overlay data a parameter the LLM fills. Option (c) is most flexible. | High |
| F03 | P1 | Bug | threatBriefing.tsx:205-207 | Open | The CASCADE ANALYSIS, WARGAME SCENARIO, and RECOMMEND RESPONSE chip buttons have no `onClick` handlers. They render as styled `<button>` elements with `cursor: pointer` but clicking them does nothing. | Users see actionable-looking buttons after every threat briefing, click them expecting to trigger a follow-up action, and nothing happens. This creates a broken UX impression. | Add `onClick` handlers that inject a user message into the CopilotKit chat via `useCopilotChat().appendMessage()` or `window.dispatchEvent(new CustomEvent('copilot:send-message', { detail: 'Run cascade analysis on ...' }))`. The LLM will then invoke the corresponding action. | High |
| F04 | P1 | Bug | threatResponse.tsx:38 | Open | `renderAndWaitForResponse` relies on the LLM autonomously choosing to call `threatResponseRecommendation` after a briefing or wargame. There is no system prompt guidance or chaining mechanism to ensure this happens. The action description says "Use AFTER generating a threat briefing or wargame" but CopilotKit doesn't enforce action ordering. | The HITL approval flow never triggers unless the user explicitly asks the LLM for a recommendation. The intended flow (briefing → automatic recommendation proposal → approve/reject) doesn't happen automatically. | Add a `followUp` instruction in the threatBriefing and scenarioWargame handler return values (e.g., return a string like "Briefing complete. Now propose a recommended response using the threatResponseRecommendation action.") so the LLM chains into the HITL action. Alternatively, add system prompt instructions via `useCopilotReadable` that describe the expected action flow. | Medium |
| F05 | P2 | Fragility | scenarioWargame.tsx:70-73 | Open | `CHINA_TAIWAN_IRAN_OVERLAY.forces` is iterated to build `forceCounts` on every render, but this data is a static import — it never changes based on the LLM's scenario parameters. The wargame card always shows the same force disposition regardless of what the LLM generated. | Misleading UI: a user asking about a Russia/Ukraine scenario sees PRC, ROC, US, Iran force counts. | Either make force data dynamic (derived from LLM params) or only render the Theater section when the scenario actually matches the fixture region. | Medium |
| F06 | P2 | UX | cascadeAnalysis.tsx:60-68 | Open | The cascade analysis render function is entirely inline in the `useCopilotAction` call (~150 lines). Unlike threatBriefing (which extracted `ThreatBriefingCard` + `ThreatBriefingRender`), this action has no compact/expanded mode and no expand modal. Long cascade chains overflow the narrow sidebar. | For complex cascades with many second-order effects and market implications, the card becomes extremely tall in the 350px-wide sidebar, requiring excessive scrolling. No way to see the full analysis in a comfortable expanded view. | Extract a `CascadeAnalysisCard` component with compact/expanded modes following the threatBriefing pattern. Add an expand modal using the existing `ExpandedModal` component. | Low |

## Testing Gaps

- No automated tests for any generative UI action
- scenarioWargame theater overlay activation cannot be tested without the full map runtime
- threatResponse HITL flow (approve/reject → LLM chaining) untested end-to-end
- No visual regression tests for compact vs expanded card rendering

## Open Questions

- Should the wargame action support multiple pre-scripted scenario overlays, or should overlay data be fully dynamic?
- Should chip buttons on the threat briefing actually send messages to CopilotKit chat, or trigger actions directly via the SDK?
- Is the LLM reliably choosing these actions when prompted? Have the action descriptions been tested against the model?
