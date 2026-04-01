import type { ScenarioOverlay } from '@/types';

/**
 * Hardcoded mock data for the China–Taiwan–Iran red-team scenario.
 * Coordinates are [lon, lat] unless otherwise noted.
 */
export const CHINA_TAIWAN_IRAN_OVERLAY: ScenarioOverlay = {
  // ── Force positions ───────────────────────────────────────────────
  forces: [
    // PLA Navy bases
    { id: 'cn-zhanjiang',  name: 'Zhanjiang Naval Base',      type: 'base',       faction: 'CN', lat: 21.27,  lon: 110.40,  strength: 'Southern Theater HQ', status: 'active' },
    { id: 'cn-yulin',      name: 'Yulin Naval Base',          type: 'base',       faction: 'CN', lat: 18.22,  lon: 109.52,  strength: 'SSBN Bastion',        status: 'alert' },
    { id: 'cn-ningbo',     name: 'Ningbo Naval Base',         type: 'base',       faction: 'CN', lat: 29.87,  lon: 121.55,  strength: 'Eastern Theater HQ',  status: 'active' },
    // PLA fleet positions
    { id: 'cn-fleet-strait', name: 'PLAN Strait Patrol Group', type: 'fleet',     faction: 'CN', lat: 24.80,  lon: 119.50,  strength: '052D DDG x3, 054A FFG x4', status: 'deployed' },
    { id: 'cn-fleet-scs',   name: 'PLAN Carrier Group',       type: 'fleet',     faction: 'CN', lat: 16.50,  lon: 113.50,  strength: 'CV-18 Fujian + escorts',    status: 'deployed' },
    // PLA Rocket Force (missile sites along Fujian coast)
    { id: 'cn-df15-a',     name: 'DF-15B Brigade (Yongan)',    type: 'missile_site', faction: 'CN', lat: 25.97, lon: 117.36, strength: '12 TELs',   status: 'deployed' },
    { id: 'cn-df21d',      name: 'DF-21D Brigade (Nanping)',   type: 'missile_site', faction: 'CN', lat: 26.64, lon: 118.18, strength: '16 TELs',   status: 'alert' },
    { id: 'cn-df26',       name: 'DF-26 Brigade (Shangrao)',   type: 'missile_site', faction: 'CN', lat: 28.45, lon: 117.97, strength: '12 TELs',   status: 'deployed' },
    { id: 'cn-df17',       name: 'DF-17 HGV Battery (Ganzhou)', type: 'missile_site', faction: 'CN', lat: 25.85, lon: 114.95, strength: '8 TELs', status: 'alert' },
    // PLA airfields
    { id: 'cn-longtian',   name: 'Longtian Air Base',          type: 'airfield',  faction: 'CN', lat: 25.67,  lon: 119.39,  strength: 'J-16 x24, J-20 x12', status: 'active' },
    { id: 'cn-huian',      name: 'Huian Air Base',             type: 'airfield',  faction: 'CN', lat: 25.03,  lon: 118.62,  strength: 'H-6K x18',            status: 'active' },
    { id: 'cn-zhangzhou',  name: 'Zhangzhou Air Base',         type: 'airfield',  faction: 'CN', lat: 24.52,  lon: 117.65,  strength: 'Su-35 x24',           status: 'active' },
    // S-400 coverage
    { id: 'cn-s400-hainan', name: 'S-400 Battery (Hainan)',    type: 'radar',     faction: 'CN', lat: 18.75,  lon: 109.70,  strength: '2 battalions',        status: 'active' },

    // Taiwan forces
    { id: 'tw-hsinchu',    name: 'Hsinchu AFB',               type: 'airfield',  faction: 'TW', lat: 24.82,  lon: 120.94,  strength: 'Mirage 2000 x48',     status: 'alert' },
    { id: 'tw-zuoying',    name: 'Zuoying Naval Base',        type: 'base',      faction: 'TW', lat: 22.59,  lon: 120.26,  strength: 'Keelung-class DDG x4', status: 'active' },
    { id: 'tw-taipei-ad',  name: 'Taipei Air Defense Cmd',    type: 'radar',     faction: 'TW', lat: 25.08,  lon: 121.51,  strength: 'Patriot PAC-3 x6 btry', status: 'alert' },
    { id: 'tw-hualien',    name: 'Hualien AFB (Jiashan)',     type: 'airfield',  faction: 'TW', lat: 24.02,  lon: 121.60,  strength: 'F-16V x72 (mountain)', status: 'alert' },
    { id: 'tw-fleet',      name: 'ROC Navy Patrol',           type: 'fleet',     faction: 'TW', lat: 23.50,  lon: 121.80,  strength: 'Lafayette FFG x6',     status: 'deployed' },
    { id: 'tw-suao',       name: 'Su\'ao Naval Base',         type: 'base',      faction: 'TW', lat: 24.60,  lon: 121.87,  strength: 'Mine warfare sqn',     status: 'active' },

    // US forces
    { id: 'us-kadena',     name: 'Kadena Air Base',           type: 'airfield',  faction: 'US', lat: 26.35,  lon: 127.77,  strength: 'F-22 x36, KC-135 x15', status: 'active' },
    { id: 'us-yokosuka',   name: 'Yokosuka Naval Base',       type: 'base',      faction: 'US', lat: 35.29,  lon: 139.67,  strength: 'USS Ronald Reagan CSG', status: 'active' },
    { id: 'us-guam',       name: 'Andersen AFB, Guam',        type: 'airfield',  faction: 'US', lat: 13.58,  lon: 144.92,  strength: 'B-2 x6, B-52 x12',    status: 'alert' },
    { id: 'us-reagan-csg', name: 'USS Reagan CSG',            type: 'fleet',     faction: 'US', lat: 24.00,  lon: 130.00,  strength: 'CVN-76 + Aegis DDG x5', status: 'in transit' },

    // Iran forces
    { id: 'ir-bandar',     name: 'Bandar Abbas Naval Base',   type: 'base',      faction: 'IR', lat: 27.18,  lon: 56.27,   strength: 'Mowj FFG x4, FAC x30', status: 'active' },
    { id: 'ir-bushehr',    name: 'Bushehr Nuclear Plant',     type: 'base',      faction: 'IR', lat: 28.97,  lon: 50.83,   strength: 'VVER-1000 reactor',    status: 'active' },
    { id: 'ir-natanz',     name: 'Natanz Enrichment Facility', type: 'base',     faction: 'IR', lat: 33.72,  lon: 51.73,   strength: 'Centrifuge cascade',   status: 'active' },
    { id: 'ir-shahab',     name: 'Shahab-3 Battery (Semnan)', type: 'missile_site', faction: 'IR', lat: 35.58, lon: 53.39, strength: '6 TELs',              status: 'deployed' },
    { id: 'ir-emad',       name: 'Emad Battery (Tabriz)',     type: 'missile_site', faction: 'IR', lat: 38.08, lon: 46.29, strength: '4 TELs',              status: 'alert' },
    { id: 'ir-chabahar',   name: 'Chabahar Naval Fwd Base',   type: 'port',      faction: 'IR', lat: 25.30,  lon: 60.64,   strength: 'Midget sub pen',       status: 'active' },

    // Allied
    { id: 'al-diego',     name: 'Diego Garcia',               type: 'airfield',  faction: 'allied', lat: -7.32, lon: 72.41,  strength: 'B-1B det, P-8 sqn',   status: 'active' },
    { id: 'al-bahrain',   name: 'NSA Bahrain (5th Fleet)',    type: 'base',      faction: 'allied', lat: 26.24, lon: 50.52,  strength: 'NAVCENT HQ',          status: 'active' },
  ],

  // ── Zones ─────────────────────────────────────────────────────────
  zones: [
    // PLA exclusion zones around Taiwan (modeled on Aug 2022 exercise areas)
    {
      id: 'ez-north', name: 'PLA Exercise Zone North', type: 'exclusion',
      polygon: [[121.5, 26.0], [123.0, 26.0], [123.0, 25.2], [121.5, 25.2], [121.5, 26.0]],
      color: [255, 50, 50, 60],
    },
    {
      id: 'ez-northeast', name: 'PLA Exercise Zone NE', type: 'exclusion',
      polygon: [[123.5, 25.5], [124.8, 25.5], [124.8, 24.5], [123.5, 24.5], [123.5, 25.5]],
      color: [255, 50, 50, 60],
    },
    {
      id: 'ez-east', name: 'PLA Exercise Zone East', type: 'exclusion',
      polygon: [[122.8, 24.2], [124.0, 24.2], [124.0, 23.0], [122.8, 23.0], [122.8, 24.2]],
      color: [255, 50, 50, 60],
    },
    {
      id: 'ez-south', name: 'PLA Exercise Zone South', type: 'exclusion',
      polygon: [[120.0, 22.2], [121.0, 22.2], [121.0, 21.5], [120.0, 21.5], [120.0, 22.2]],
      color: [255, 50, 50, 60],
    },
    {
      id: 'ez-southwest', name: 'PLA Exercise Zone SW', type: 'exclusion',
      polygon: [[119.0, 23.2], [120.0, 23.2], [120.0, 22.4], [119.0, 22.4], [119.0, 23.2]],
      color: [255, 50, 50, 60],
    },
    {
      id: 'ez-west', name: 'PLA Exercise Zone West', type: 'exclusion',
      polygon: [[119.5, 25.0], [120.5, 25.0], [120.5, 24.2], [119.5, 24.2], [119.5, 25.0]],
      color: [255, 50, 50, 60],
    },
    // Taiwan ADIZ
    {
      id: 'tw-adiz', name: 'Taiwan ADIZ', type: 'adiz',
      polygon: [
        [117.5, 29.0], [123.0, 29.0], [126.0, 24.0],
        [124.0, 21.0], [120.0, 21.0], [117.5, 23.0], [117.5, 29.0],
      ],
      color: [0, 200, 100, 30],
    },
    // Strait of Hormuz blockade zone
    {
      id: 'hormuz-blockade', name: 'Strait of Hormuz Blockade Zone', type: 'blockade',
      polygon: [
        [56.0, 27.2], [56.8, 26.4], [56.5, 26.0], [55.5, 26.0],
        [55.0, 26.5], [55.5, 27.0], [56.0, 27.2],
      ],
      color: [255, 140, 0, 50],
    },
  ],

  // ── Supply / attack / evacuation arcs ─────────────────────────────
  arcs: [
    // US supply lines (blue)
    { id: 'supply-guam-kadena',      name: 'Guam → Kadena Supply',       type: 'supply_line',        source: [144.92, 13.58], target: [127.77, 26.35], color: [0, 120, 255, 180] },
    { id: 'supply-kadena-strait',    name: 'Kadena → Taiwan Strait',     type: 'supply_line',        source: [127.77, 26.35], target: [121.50, 24.50], color: [0, 120, 255, 180] },
    { id: 'supply-yokosuka-patrol',  name: 'Yokosuka → CSG Patrol',      type: 'supply_line',        source: [139.67, 35.29], target: [130.00, 24.00], color: [0, 120, 255, 180] },
    { id: 'supply-diego-bahrain',    name: 'Diego Garcia → 5th Fleet',   type: 'supply_line',        source: [72.41, -7.32],  target: [50.52, 26.24],  color: [0, 120, 255, 180] },
    // PLA attack vectors (red)
    { id: 'attack-fujian-n',         name: 'PLA Amphibious Axis North',  type: 'attack_vector',      source: [119.39, 25.67], target: [120.94, 24.82], color: [255, 50, 50, 200] },
    { id: 'attack-fujian-c',         name: 'PLA Amphibious Axis Central', type: 'attack_vector',     source: [118.62, 25.03], target: [120.50, 24.20], color: [255, 50, 50, 200] },
    { id: 'attack-fujian-s',         name: 'PLA Amphibious Axis South',  type: 'attack_vector',      source: [117.65, 24.52], target: [120.26, 23.00], color: [255, 50, 50, 200] },
    // Evacuation corridors (green)
    { id: 'evac-east-okinawa',       name: 'Taiwan → Okinawa Evacuation', type: 'evacuation_corridor', source: [121.87, 24.60], target: [127.77, 26.35], color: [50, 220, 100, 180] },
    { id: 'evac-south-philippines',  name: 'Taiwan → Philippines Evacuation', type: 'evacuation_corridor', source: [120.26, 22.59], target: [121.00, 18.50], color: [50, 220, 100, 180] },
    // Iran patrol route (orange)
    { id: 'patrol-hormuz',           name: 'IRGCN Hormuz Patrol',        type: 'patrol_route',       source: [56.27, 27.18],  target: [56.40, 26.30],  color: [255, 160, 0, 200] },
  ],

  // ── Missile range rings ───────────────────────────────────────────
  missileRanges: [
    { id: 'mr-df21d',   name: 'DF-21D Range (1,500 km)',   center: [118.50, 26.00], radiusKm: 1500, color: [255, 80, 80, 25] },
    { id: 'mr-df26',    name: 'DF-26 Range (4,000 km)',    center: [117.97, 28.45], radiusKm: 4000, color: [200, 50, 50, 15] },
    { id: 'mr-shahab3', name: 'Shahab-3 Range (1,300 km)', center: [53.39, 35.58],  radiusKm: 1300, color: [255, 140, 0, 25] },
    { id: 'mr-hf3',     name: 'Hsiung Feng III (600 km)',  center: [121.60, 24.02], radiusKm: 600,  color: [0, 200, 120, 25] },
    { id: 'mr-s400',    name: 'S-400 Envelope (400 km)',   center: [109.70, 18.75], radiusKm: 400,  color: [180, 50, 50, 30] },
  ],
};

/** Scenario metadata for the wargame sidebar card. */
export const CHINA_TAIWAN_IRAN_SCENARIO = {
  title: 'Two-Front Pressure: Taiwan Strait & Strait of Hormuz',
  description:
    'Coordinated escalation scenario where PRC initiates military exercises encircling Taiwan while Iran simultaneously threatens closure of the Strait of Hormuz, stretching US force posture across two theaters.',
  region: 'Indo-Pacific & Persian Gulf',
  classification: 'TOP SECRET // SCI // NOFORN',
};
