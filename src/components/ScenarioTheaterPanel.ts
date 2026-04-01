import { Panel } from './Panel';
import { CHINA_TAIWAN_IRAN_OVERLAY } from '@/copilot/data/china-taiwan-iran-scenario';

const FACTION_META: Record<string, { label: string; color: string }> = {
  CN: { label: 'PRC (China)', color: '#dc2828' },
  TW: { label: 'ROC (Taiwan)', color: '#28b450' },
  US: { label: 'United States', color: '#2864f0' },
  IR: { label: 'Iran', color: '#f09620' },
  allied: { label: 'Allied Forces', color: '#3cc8dc' },
};

const THREAT_SCENARIOS = [
  { label: 'Naval blockade enforcement', probability: 65, severity: 'CRITICAL' },
  { label: 'Air defense zone activation', probability: 80, severity: 'HIGH' },
  { label: 'Missile force dispersal', probability: 72, severity: 'HIGH' },
  { label: 'Kinetic escalation', probability: 20, severity: 'MODERATE' },
];

function severityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '#dc2828';
    case 'HIGH': return '#f09620';
    case 'MODERATE': return '#eab308';
    default: return '#6b7280';
  }
}

export class ScenarioTheaterPanel extends Panel {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private onLocationClick?: (lat: number, lon: number) => void;
  private activated = false;

  constructor() {
    super({
      id: 'scenario-theater',
      title: 'Theater Situation',
      defaultRowSpan: 2,
    });
  }

  public setLocationClickHandler(handler: (lat: number, lon: number) => void): void {
    this.onLocationClick = handler;
  }

  public activate(): void {
    this.activated = true;
    this.show();
    this.runStage0();
    this.timers.push(setTimeout(() => this.runStage1(), 1500));
    this.timers.push(setTimeout(() => this.runStage2(), 3500));
    this.timers.push(setTimeout(() => this.runStage3(), 5500));
  }

  public deactivate(): void {
    this.activated = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.hide();
  }

  /** Stage 0: Radar sweep scanning animation */
  private runStage0(): void {
    this.setContent(`
      <div class="scenario-theater-panel">
        <div class="scenario-theater-header">
          <span class="scenario-theater-classification">TOP SECRET // SCI // NOFORN</span>
        </div>
        <div class="posture-loading">
          <div class="posture-loading-radar">
            <div class="posture-radar-sweep"></div>
            <div class="posture-radar-dot"></div>
          </div>
          <div class="posture-loading-title">SCANNING INDO-PACIFIC THEATER</div>
          <div class="posture-loading-stages">
            <div class="posture-stage active">
              <span class="posture-stage-dot"></span>
              <span>Satellite reconnaissance</span>
            </div>
            <div class="posture-stage pending">
              <span class="posture-stage-dot"></span>
              <span>SIGINT intercepts</span>
            </div>
            <div class="posture-stage pending">
              <span class="posture-stage-dot"></span>
              <span>Force tracking</span>
            </div>
            <div class="posture-stage pending">
              <span class="posture-stage-dot"></span>
              <span>Threat analysis</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /** Stage 1: Force disposition with staggered faction reveals */
  private runStage1(): void {
    if (!this.activated) return;

    // Update loading stages
    const stages = this.content.querySelectorAll('.posture-stage');
    stages[0]?.classList.replace('active', 'complete');
    stages[1]?.classList.replace('pending', 'complete');
    stages[2]?.classList.replace('pending', 'active');

    // Count forces by faction
    const forceCounts: Record<string, { count: number; types: Set<string> }> = {};
    for (const f of CHINA_TAIWAN_IRAN_OVERLAY.forces) {
      if (!forceCounts[f.faction]) forceCounts[f.faction] = { count: 0, types: new Set() };
      const entry = forceCounts[f.faction]!;
      entry.count++;
      entry.types.add(f.type);
    }

    const factionRows = Object.entries(forceCounts).map(([faction, data], i) => {
      const meta = FACTION_META[faction] || { label: faction, color: '#888' };
      const typeStr = Array.from(data.types).join(', ');
      return `
        <div class="scenario-theater-faction" style="animation-delay: ${i * 300}ms; --faction-color: ${meta.color}">
          <span class="scenario-theater-faction-dot" style="background: ${meta.color}"></span>
          <span class="scenario-theater-faction-label">${meta.label}</span>
          <span class="scenario-theater-faction-count">${data.count}</span>
          <span class="scenario-theater-faction-types">${typeStr}</span>
        </div>
      `;
    }).join('');

    // Insert force disposition section
    const loadingEl = this.content.querySelector('.posture-loading');
    if (loadingEl) {
      const forceSection = document.createElement('div');
      forceSection.className = 'scenario-theater-stage scenario-theater-forces';
      forceSection.innerHTML = `
        <div class="scenario-theater-section-label">FORCE DISPOSITION</div>
        ${factionRows}
      `;
      loadingEl.parentElement?.appendChild(forceSection);
      // Trigger animation
      requestAnimationFrame(() => forceSection.classList.add('visible'));
    }
  }

  /** Stage 2: Threat assessment with animated probability bars */
  private runStage2(): void {
    if (!this.activated) return;

    // Update loading stages
    const stages = this.content.querySelectorAll('.posture-stage');
    stages[2]?.classList.replace('active', 'complete');
    stages[3]?.classList.replace('pending', 'active');

    const threatRows = THREAT_SCENARIOS.map(t => `
      <div class="scenario-theater-threat">
        <div class="scenario-theater-threat-header">
          <span class="scenario-theater-threat-label">${t.label}</span>
          <span class="scenario-theater-severity" style="color: ${severityColor(t.severity)}; border-color: ${severityColor(t.severity)}">
            ${t.severity}
          </span>
        </div>
        <div class="scenario-theater-bar-track">
          <div class="scenario-theater-bar-fill" style="--bar-width: ${t.probability}%; background: ${severityColor(t.severity)}"></div>
        </div>
        <span class="scenario-theater-bar-pct">${t.probability}%</span>
      </div>
    `).join('');

    const panel = this.content.querySelector('.scenario-theater-panel');
    if (panel) {
      const threatSection = document.createElement('div');
      threatSection.className = 'scenario-theater-stage scenario-theater-threats';
      threatSection.innerHTML = `
        <div class="scenario-theater-section-label">THREAT ASSESSMENT</div>
        ${threatRows}
      `;
      panel.appendChild(threatSection);
      // Trigger bar fill animation after paint
      requestAnimationFrame(() => {
        threatSection.classList.add('visible');
        requestAnimationFrame(() => {
          threatSection.querySelectorAll('.scenario-theater-bar-fill').forEach(bar => {
            (bar as HTMLElement).classList.add('animate');
          });
        });
      });
    }
  }

  /** Stage 3: Situation active — full summary */
  private runStage3(): void {
    if (!this.activated) return;

    // Complete all loading stages
    const stages = this.content.querySelectorAll('.posture-stage');
    stages[3]?.classList.replace('active', 'complete');

    // Hide the radar
    const radar = this.content.querySelector('.posture-loading-radar');
    if (radar) (radar as HTMLElement).style.display = 'none';
    const loadingTitle = this.content.querySelector('.posture-loading-title');
    if (loadingTitle) (loadingTitle as HTMLElement).style.display = 'none';

    const overlay = CHINA_TAIWAN_IRAN_OVERLAY;
    const totalForces = overlay.forces.length;
    const totalZones = overlay.zones.length;
    const totalArcs = overlay.arcs.length;
    const totalMissile = overlay.missileRanges.length;

    const panel = this.content.querySelector('.scenario-theater-panel');
    if (panel) {
      const activeSection = document.createElement('div');
      activeSection.className = 'scenario-theater-stage scenario-theater-active';
      activeSection.innerHTML = `
        <div class="scenario-theater-active-badge">
          <span class="scenario-theater-active-dot"></span>
          THEATER ACTIVE
        </div>
        <div class="scenario-theater-summary">
          <div class="scenario-theater-stat">
            <span class="scenario-theater-stat-value">${totalForces}</span>
            <span class="scenario-theater-stat-label">Force Units</span>
          </div>
          <div class="scenario-theater-stat">
            <span class="scenario-theater-stat-value">${totalZones}</span>
            <span class="scenario-theater-stat-label">Exclusion Zones</span>
          </div>
          <div class="scenario-theater-stat">
            <span class="scenario-theater-stat-value">${totalArcs}</span>
            <span class="scenario-theater-stat-label">Supply / Attack Arcs</span>
          </div>
          <div class="scenario-theater-stat">
            <span class="scenario-theater-stat-value">${totalMissile}</span>
            <span class="scenario-theater-stat-label">Missile Envelopes</span>
          </div>
        </div>
        <button class="scenario-theater-zoom-btn" type="button">ZOOM TO THEATER</button>
        <div class="scenario-theater-timestamp">
          Generated ${new Date().toISOString().slice(0, 16)} UTC // STRATCOM
        </div>
      `;
      panel.appendChild(activeSection);
      requestAnimationFrame(() => activeSection.classList.add('visible'));

      // Wire zoom button
      const zoomBtn = activeSection.querySelector('.scenario-theater-zoom-btn');
      zoomBtn?.addEventListener('click', () => {
        this.onLocationClick?.(24.0, 120.0);
      });
    }
  }

  public override destroy(): void {
    this.deactivate();
    super.destroy();
  }
}
