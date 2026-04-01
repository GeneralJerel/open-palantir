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

### 3. Scenario Wargame (Interactive Decision Tree)

**Prompt:**
> Red team this scenario: China blockades Taiwan

**What happens:** A wargame analysis card renders with:
- Classification stamp ("TOP SECRET // SCI")
- Scenario description with region badge
- **Initial adversary move** with actor, action, probability bar, and severity
- **Response options** (3-4 cards) each showing:
  - Recommendation badge (RECOMMENDED / VIABLE / RISKY / NOT RECOMMENDED)
  - Success probability bar
  - Consequences with severity-colored border
- Timestamped STRATCOM footer

**Why it's impressive:** The AI acts as a strategic analyst, generating multiple response branches with probability assessments — all rendered as a polished decision tree inside the chat sidebar.

**Variations to try:**
- "War-game a North Korean missile test escalation"
- "Red team: Iran closes the Strait of Hormuz"
- "What if Russia escalates in the Baltics?"

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
- **Human-in-the-Loop** — Critical actions require human approval. The AI proposes, the human disposes. `renderAndWaitForResponse` pauses the agent until the user clicks.
- **Action Chaining** — After approval, the AI chains multiple dashboard actions (navigate map, add panels, toggle layers) without additional prompts.
- **Zero Templates** — None of these cards are pre-filled. The AI reasons about geopolitics and fills every field. Different countries, events, and scenarios produce completely different briefings.
- **Inline in Chat** — All of this renders inside the chat sidebar alongside normal conversation. No separate dashboards or modal windows.

---

## Full Demo Script (2-3 minutes)

1. Open the sidebar. Say: **"Give me a threat briefing on Iran"**
   - Point out the classified styling, severity badges, timeline, source confidence
2. Follow up: **"Trace the second-order effects of Iran closing the Strait of Hormuz"**
   - Show the cascade from trigger → first-order → second-order → market implications
3. Then: **"Red team this scenario: Iran mines the Strait of Hormuz"**
   - Walk through the wargame response options, probability bars, recommendations
4. Finally: **"Recommend a response"**
   - Show the APPROVE/REJECT buttons. Click APPROVE.
   - Watch the dashboard navigate to Iran, add panels, toggle conflict layers
5. Wrap: "This is CopilotKit. Generative UI. Human-in-the-loop. Open source. Built in a weekend."
