import React from 'react';

interface FleetCorridorMapProps {
  currentStopCode: string;
  currentStopName: string;
  selectedServiceNo: string;
}

export const FleetCorridorMap: React.FC<FleetCorridorMapProps> = ({
  currentStopCode,
  currentStopName,
  selectedServiceNo,
}) => {
  const [selectedBusPlate, setSelectedBusPlate] = React.useState<string>('SBS3829P');
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  // Simulated approaching buses in the corridor
  const corridorVehicles = [
    {
      plate: 'SBS3829P',
      serviceNo: '147',
      model: 'Volvo B9TL (Double Decker)',
      speed: '34 km/h',
      dwell: 'Approaching Stamford Rd junction',
      etaText: '~45 seconds away (120m)',
      topPercent: 54,
      leftPercent: 48,
      status: 'active',
      passengers: 'Seats Available (42%)',
    },
    {
      plate: 'SBS6819R',
      serviceNo: '124',
      model: 'Mercedes Citaro',
      speed: '28 km/h',
      dwell: 'Turning from Bras Basah Rd',
      etaText: '~1.5 mins away (340m)',
      topPercent: 38,
      leftPercent: 62,
      status: 'nominal',
      passengers: 'Standing Room Only (78%)',
    },
    {
      plate: 'SMB5890C',
      serviceNo: '190',
      model: 'Alexander Dennis E500',
      speed: '0 km/h (At Berth)',
      dwell: 'At Stop 04168 Berth 2',
      etaText: 'Boarding in progress',
      topPercent: 52,
      leftPercent: 46,
      status: 'arrived',
      passengers: 'Limited Standing (92%)',
    },
  ];

  const currentActiveVehicle =
    corridorVehicles.find((v) => v.serviceNo === selectedServiceNo) ||
    corridorVehicles.find((v) => v.plate === selectedBusPlate) ||
    corridorVehicles[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 border border-[#E2E8F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-[20px] font-extrabold text-[#111c2d] tracking-tight">
            Corridor Fleet Map & Stoppage Layout
          </h3>
          <p className="text-[13px] text-[#50434d]">
            Live visual localization of nearby approaching SBS Transit coaches.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#89f5e7] text-[#00201d] text-[12px] font-bold shadow-xs">
            <span className="material-symbols-outlined text-[16px]">satellite_alt</span>
            <span>City Hall Corridor</span>
          </span>
          <div className="flex items-center bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.3))}
              className="p-1 text-[#50434d] hover:text-[#111c2d] rounded"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.9))}
              className="p-1 text-[#50434d] hover:text-[#111c2d] rounded"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas with Hotlinked Singapore Imagery */}
      <div
        className="w-full h-80 rounded-xl relative overflow-hidden flex items-end p-4 shadow-inner border border-[#E2E8F0] select-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGf5tw8f4BX578Rtots4nUUBvO3H7IR_UQp0OAZhxDpWzWNQMnwzV58s7jb2BeZBiCyACH-GOwegkbVbgyOhciMQ-9QWAUzcMdJaorVW-ZIaD29dSvpuuWPUwjuLZWivqRuPvs_4NcwFStvK4mA0ftzMHqh_FQAX1fIVIefl9tcOfwB1xmSye3h_TB5Fmi-4H7H00m1AanmUD9teBsM2W9zXUGDWBzkpXJSY6lRbu8m7vS5f9PyT6G')`,
          backgroundSize: `${zoomLevel * 100}%`,
          backgroundPosition: 'center',
          backgroundColor: '#e7eeff',
        }}
      >
        {/* Subtle grid lines for high-tech civic transport radar feel */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #500054 1px, transparent 1px), radial-gradient(circle, #ac3500 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        ></div>

        {/* Current Stop Marker */}
        <div
          className="absolute z-10 flex flex-col items-center cursor-pointer group"
          style={{ top: '48%', left: '46%' }}
        >
          <div className="w-8 h-8 rounded-full bg-[#500054] text-white flex items-center justify-center shadow-lg ring-4 ring-[#ffd6f8]/80 animate-pulse">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
          </div>
          <div className="bg-[#111c2d]/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
            {currentStopCode}
          </div>
        </div>

        {/* Dynamic Vehicle Markers on Corridor */}
        {corridorVehicles.map((vehicle) => {
          const isActive = vehicle.plate === currentActiveVehicle.plate;

          return (
            <button
              key={vehicle.plate}
              type="button"
              onClick={() => setSelectedBusPlate(vehicle.plate)}
              className="absolute z-20 flex flex-col items-center cursor-pointer transition-transform hover:scale-110 focus:outline-none"
              style={{ top: `${vehicle.topPercent}%`, left: `${vehicle.leftPercent}%` }}
              title={`Bus ${vehicle.serviceNo} (${vehicle.plate}) - ${vehicle.dwell}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md font-bold text-[11px] font-mono transition-all ${
                  isActive
                    ? 'bg-[#ac3500] text-white ring-4 ring-[#ffdbd0] scale-110'
                    : 'bg-white text-[#500054] border-2 border-[#500054]'
                }`}
              >
                {vehicle.serviceNo}
              </div>
              <span
                className={`text-[9px] px-1 rounded font-bold mt-0.5 shadow-xs whitespace-nowrap ${
                  isActive ? 'bg-[#ac3500] text-white' : 'bg-white/95 text-[#111c2d]'
                }`}
              >
                {vehicle.speed}
              </span>
            </button>
          );
        })}

        {/* Overlay Telematics Card for Selected Vehicle */}
        <div className="relative z-30 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg max-w-md border border-[#E2E8F0]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ac3500] animate-ping"></span>
              <span className="text-[13px] font-extrabold text-[#111c2d]">
                Bus {currentActiveVehicle.serviceNo} ({currentActiveVehicle.plate})
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#500054] bg-[#ffd6f8] px-2 py-0.5 rounded">
              Telematics Online
            </span>
          </div>

          <p className="text-[12px] text-[#50434d] mt-1.5 leading-snug">
            {currentActiveVehicle.dwell}. Currently {currentActiveVehicle.etaText} to Stop {currentStopCode} (
            {currentStopName}).
          </p>

          <div className="flex items-center justify-between text-[11px] text-[#50434d] mt-2 pt-2 border-t border-[#E2E8F0]/70 font-medium">
            <span>Model: {currentActiveVehicle.model}</span>
            <span className="text-[#16A34A] font-bold">{currentActiveVehicle.passengers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
