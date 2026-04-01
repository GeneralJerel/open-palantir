# Open Palantir — Demo Guide

> "Palantir's $50B product, rebuilt in a weekend with CopilotKit."

This guide walks through the key demo prompts that showcase CopilotKit's generative UI and human-in-the-loop capabilities inside the Open Palantir world monitor dashboard.

---

## Setup

```bash
cd open-palantir
cp .env.example .env.local
# Add your OpenAI API key to .env.local:
#   OPENAI_API_KEY=sk-...
npm install
npm run dev
```

Open the app in your browser and click the chat icon in the bottom-right to open the CopilotKit sidebar.

---

## Demo Flow

### 1. Threat Briefing (Generative UI)

**Prompt:**
> Give me a threat briefing on Iran

**What happens:** The AI generates a classified-style intelligence briefing card rendered inline in the chat. Includes:
- "TOP SECRET // COPILOTKIT" header stamp
- Country name with flag emoji
- Color-coded threat level gauge (CRITICAL / HIGH / MODERATE / LOW)
- Key findings with severity indicators
- Recent events timeline with colored significance markers
- Intelligence sources with confidence ratings (HIGH / MODERATE / LOW)
- Timestamped footer

**Why it's impressive:** The LLM fills structured parameters, and CopilotKit's `render` prop transforms them into a rich, styled React component — no templates, no pre-built cards. The AI decides the content and structure.

**Variations to try:**
- "Threat briefing on North Korea"
- "What's the security situation in Ukraine?"
- "Intelligence assessment for Taiwan"

---

### 2. Cascade Analysis (Visual Flow Diagram)

**Prompt:**
> Trace the second-order effects of the Red Sea shipping disruption

**What happens:** A vertical cascade flow diagram appears showing:
- **Trigger event** at the top (accent-bordered box)
- **First-order effects** with severity-colored borders and domain badges (economic, military, energy, etc.)
- **Second-order effects** indented under their parent, connected by dashed lines
- **Market implications** at the bottom with directional arrows (▲ UP / ▼ DOWN / ◆ VOLATILE)

**Why it's impressive:** This is a full data visualization generated on the fly — the AI reasons about cascading consequences and the UI renders an interactive flow diagram. Pure CSS, no charting library needed.

**Variations to try:**
- "What are the cascading effects of a Suez Canal blockade?"
- "Trace the ripple effects of a Russian gas cutoff to Europe"
- "What happens if TSMC production halts?"

---

### 3. Scenario Wargame (Interactive Decision Tree + Live Map Overlay)

**Prompt:**
> Red team this scenario: China blockades Taiwan while Iran threatens the Strait of Hormuz

**What happens:** Two things fire simultaneously:

**In the sidebar** — a wargame analysis card renders with:
- Classification stamp ("TOP SECRET // SCI // NOFORN")
- Scenario description with region badge
- **Theater Force Disposition** section showing:
  - Pulsing "Theater overlay active on map" indicator
  - Force counts by faction (PRC, ROC, US, Iran, Allied) with color-coded dots
  - Summary: zones, arcs, and missile envelopes on the map
- **Initial adversary move** with actor, action, probability bar, and severity
- **Response options** (3-4 cards) each showing:
  - Recommendation badge (RECOMMENDED / VIABLE / RISKY / NOT RECOMMENDED)
  - Success probability bar
  - Consequences with severity-colored border
- Timestamped STRATCOM footer

**On the map** — the viewport auto-flies to the Taiwan Strait (24°N, 120°E) and a full theater overlay appears:
- **~32 force markers** colored by faction (red = PRC, green = Taiwan, blue = US, orange = Iran, cyan = Allied) — naval bases, airfields, missile sites, fleet positions from Fujian to Guam to the Persian Gulf
- **8 zone polygons** — 6 PLA exclusion zones encircling Taiwan (modeled on the Aug 2022 exercises), Taiwan's ADIZ, and the Strait of Hormuz blockade zone
- **10 arcs** — US supply lines (blue), PLA amphibious attack axes (red), evacuation corridors (green), IRGCN patrol route (orange)
- **5 missile range rings** — DF-21D (1,500 km), DF-26 (4,000 km reaching Guam), Shahab-3 (1,300 km), Hsiung Feng III (600 km), S-400 (400 km)

**When you close the sidebar or navigate away**, the overlay cleans up automatically.

**Why it's impressive:** The AI generates the strategic analysis while CopilotKit simultaneously orchestrates the map — navigating the viewport, enabling a new data layer, and pushing 30+ hardcoded military entities onto the deck.gl canvas. The sidebar and map work in concert through a CustomEvent bridge. No manual map interaction needed.

**Variations to try:**
- "Red team: China blockades Taiwan" (triggers the same overlay)
- "War-game an Indo-Pacific escalation scenario" (triggers the overlay)
- "Red team: Iran closes the Strait of Hormuz" (triggers the overlay)
- "What if Russia escalates in the Baltics?" (no overlay — standard text wargame)

**Note:** The China/Taiwan/Iran theater overlay uses hardcoded mock data. Scenarios referencing other regions (Baltics, Korea, etc.) will render the standard wargame card without map overlay.

---

### 4. Human-in-the-Loop: Threat Response (Approval Flow)

**Prompt (after a threat briefing or wargame):**
> What should we do about this? Recommend a response.

**What happens:** The AI proposes a recommended response action with:
- Amber "ACTION REQUIRED" header
- Proposed action in bold
- Urgency badge
- Rationale explanation
- Impact assessment across domains (diplomatic, economic, military)
- Preview of dashboard actions that will execute on approval
- **APPROVE / REJECT buttons**

**On Approve:** The AI chains into existing dashboard actions — navigates the map to the relevant country, adds intelligence panels, toggles map layers (conflicts, military bases, etc.).

**On Reject:** The AI asks for alternative guidance.

**Why it's impressive:** This is CopilotKit's human-in-the-loop pattern — the AI pauses execution, renders an approval UI, and the user's decision drives what happens next. The AI orchestrates multiple dashboard actions based on a single approval click.

---

## Talking Points

- **Generative UI** — The AI doesn't just return text. It fills structured parameters that render as rich, styled React components. The components are defined once; the AI generates infinite variations.
- **Map Orchestration** — The wargame action doesn't just render a card — it takes control of the map. One prompt flies the viewport to the theater, enables a new deck.gl layer, and pushes 30+ military entities, exclusion zones, supply arcs, and missile range rings onto the canvas. The sidebar and map are synchronized through a lightweight event bridge.
- **Human-in-the-Loop** — Critical actions require human approval. The AI proposes, the human disposes. `renderAndWaitForResponse` pauses the agent until the user clicks.
- **Action Chaining** — After approval, the AI chains multiple dashboard actions (navigate map, add panels, toggle layers) without additional prompts.
- **Zero Templates** — None of these cards are pre-filled. The AI reasons about geopolitics and fills every field. Different countries, events, and scenarios produce completely different briefings.
- **Automatic Cleanup** — The scenario overlay removes itself when the component unmounts (sidebar closed, new conversation, etc.). No stale state left on the map.
- **Inline in Chat** — All of this renders inside the chat sidebar alongside normal conversation. No separate dashboards or modal windows.

---

## Full Demo Script (3-4 minutes)

1. Open the sidebar. Say: **"Give me a threat briefing on Iran"**
   - Point out the classified styling, severity badges, timeline, source confidence
2. Follow up: **"Trace the second-order effects of Iran closing the Strait of Hormuz"**
   - Show the cascade from trigger → first-order → second-order → market implications
3. Then: **"Red team this: China blockades Taiwan while Iran threatens the Strait of Hormuz"**
   - Watch the map fly to the Taiwan Strait and light up with military forces, exclusion zones, supply arcs, and missile range rings
   - In the sidebar, point out the theater force disposition (faction counts, zone/arc/missile envelope summary)
   - Walk through the wargame response options, probability bars, recommendations
   - Hover over map entities to show tooltips (unit names, faction, strength)
   - Point out: "One prompt — the AI generated the analysis AND orchestrated the map"
4. Then: **"Recommend a response"**
   - Show the APPROVE/REJECT buttons. Click APPROVE.
   - Watch the dashboard navigate, add panels, toggle conflict layers
5. Close the sidebar — watch the scenario overlay clean up automatically from the map
6. Wrap: "This is CopilotKit. Generative UI. Map orchestration. Human-in-the-loop. Open source. Built in a weekend."
