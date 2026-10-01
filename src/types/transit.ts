export type CrowdLevel = 'seats' | 'standing' | 'limited';
export type BusType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
export type ServiceCategory = 'Popular' | 'Trunk' | 'Feeder' | 'Express';

export interface BusArrivalInfo {
  etaMinutes: number | 'Arr';
  estimatedTimeStr: string;
  load: CrowdLevel;
  type: BusType;
  wab: boolean; // Wheelchair accessible
  vehiclePlate?: string;
}

export interface ServiceArrival {
  serviceNo: string;
  category: ServiceCategory;
  destination: string;
  via: string;
  fleetPlate: string;
  fleetModel?: string;
  nextBus: BusArrivalInfo;
  secondBus: BusArrivalInfo;
  thirdBus: BusArrivalInfo;
  pinned?: boolean;
}

export interface RouteProgressionStop {
  stopCode: string;
  name: string;
  road: string;
  status: 'passed' | 'current' | 'upcoming';
  distanceKm: number;
  hasVehicle?: boolean;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  distanceMeters: number;
  services: string[];
  lat: number;
  lng: number;
}

export interface TransitAlert {
  id: string;
  date: string;
  title: string;
  summary: string;
  fullDetails: string;
  affectedServices: string[];
  category: 'diversion' | 'maintenance' | 'upgrade' | 'advisory';
  active: boolean;
}

export interface ServiceDetail {
  serviceNo: string;
  category: ServiceCategory;
  origin: string;
  destination: string;
  originStop: string;
  destinationStop: string;
  loop?: boolean;
  operator: 'SBS Transit' | 'Tower Transit' | 'Go-Ahead' | 'SMRT';
  firstBusWeekday: string;
  lastBusWeekday: string;
  firstBusSat: string;
  lastBusSat: string;
  firstBusSun: string;
  lastBusSun: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  stopsCount: number;
  distanceKm: number;
  adultCardFareMax: string;
  studentFareMax: string;
  seniorFareMax: string;
  stops: {
    code: string;
    name: string;
    road: string;
    distance: number;
  }[];
}

export interface MRTStation {
  code: string;
  name: string;
  line: 'NEL' | 'DTL' | 'SKLRT' | 'PGLRT' | 'NSL' | 'EWL' | 'CCL' | 'TEL';
  interchangeWith: string[];
  firstTrainNorthOrEast: string;
  firstTrainSouthOrWest: string;
  lastTrainNorthOrEast: string;
  lastTrainSouthOrWest: string;
  busInterchangeNearby?: string;
  status: 'Normal Service' | 'Operating with Delays' | 'Scheduled Maintenance';
}
