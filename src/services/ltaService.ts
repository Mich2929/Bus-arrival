import { BusArrivalInfo, CrowdLevel, ServiceArrival, BusType } from '../types/transit';

export interface LtaRawBusArrival {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBusArrival;
  NextBus2?: LtaRawBusArrival;
  NextBus3?: LtaRawBusArrival;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaRawService[];
  _meta?: {
    source?: string;
    message?: string;
    warning?: string;
    requestedStop?: string;
    refreshedAt?: string;
  };
}

export interface ApiHealthResponse {
  status: 'healthy' | 'degraded' | 'error';
  service: string;
  timestamp: string;
  uptimeSeconds: number | null;
  environment?: string;
  ltaAccountKeyConfigured: boolean;
  ltaDataMall: {
    status: 'connected' | 'unconfigured' | 'error' | 'unreachable';
    latencyMs?: number;
    message?: string;
  };
}

/**
 * Parses LTA ISO arrival string into minutes remaining and formatted time
 */
export function parseLtaArrival(rawBus?: LtaRawBusArrival): BusArrivalInfo {
  if (!rawBus || !rawBus.EstimatedArrival) {
    return {
      etaMinutes: '--',
      estimatedTimeStr: 'Not in operation',
      load: 'seats',
      type: 'SD',
      wab: false,
    } as unknown as BusArrivalInfo;
  }

  const arrivalTime = new Date(rawBus.EstimatedArrival).getTime();
  const now = Date.now();
  const diffMinutes = Math.round((arrivalTime - now) / 60000);

  let etaMinutes: number | 'Arr' = diffMinutes;
  let estimatedTimeStr = '';

  if (diffMinutes <= 0) {
    etaMinutes = 'Arr';
    estimatedTimeStr = 'Arriving at stop';
  } else {
    etaMinutes = diffMinutes;
    const dateObj = new Date(rawBus.EstimatedArrival);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    estimatedTimeStr = `Est. ${hours}:${minutes} SGT`;
  }

  // Parse Load
  let load: CrowdLevel = 'seats';
  if (rawBus.Load === 'SDA') {
    load = 'standing';
  } else if (rawBus.Load === 'LSD') {
    load = 'limited';
  }

  // Parse Type
  let type: BusType = 'SD';
  if (rawBus.Type === 'DD') {
    type = 'DD';
  } else if (rawBus.Type === 'BD') {
    type = 'BD';
  }

  const wab = rawBus.Feature === 'WAB';

  return {
    etaMinutes,
    estimatedTimeStr,
    load,
    type,
    wab,
  };
}

/**
 * Normalizes LTA Operator string to friendly display name
 */
export function normalizeOperator(op?: string): string {
  switch (op?.toUpperCase()) {
    case 'SBST':
      return 'SBS Transit';
    case 'SMRT':
      return 'SMRT Buses';
    case 'TTS':
      return 'Tower Transit';
    case 'GAS':
      return 'Go-Ahead';
    default:
      return 'SBS Transit';
  }
}

/**
 * Fetches bus arrival from the /apt/bus-arrival endpoint
 */
export async function fetchLtaBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse> {
  const params = new URLSearchParams();
  params.set('BusStopCode', busStopCode);
  if (serviceNo && serviceNo.trim().length > 0) {
    params.set('ServiceNo', serviceNo.trim());
  }

  // Primary endpoint /apt/bus-arrival with fallback to /api/bus-arrival
  try {
    const res = await fetch(`/apt/bus-arrival?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch from /apt/bus-arrival, trying /api/bus-arrival:', e);
  }

  const fallbackRes = await fetch(`/api/bus-arrival?${params.toString()}`);
  if (!fallbackRes.ok) {
    throw new Error(`Failed to fetch bus arrival: HTTP ${fallbackRes.status}`);
  }
  return await fallbackRes.json();
}

/**
 * Checks API health from /apt/health (or /apt/heath.js)
 */
export async function checkApiHealth(): Promise<ApiHealthResponse> {
  try {
    const res = await fetch('/apt/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch from /apt/health, trying /apt/heath.js:', e);
  }

  const res2 = await fetch('/apt/heath.js');
  if (!res2.ok) {
    throw new Error(`Health check returned HTTP ${res2.status}`);
  }
  return await res2.json();
}
