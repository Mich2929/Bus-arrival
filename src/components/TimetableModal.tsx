import React from 'react';
import { SERVICE_DETAILS_MAP } from '../data/transitData';

interface TimetableModalProps {
  serviceNo: string | null;
  onClose: () => void;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ serviceNo, onClose }) => {
  const [direction, setDirection] = React.useState<1 | 2>(1);

  if (!serviceNo) return null;

  const detail = SERVICE_DETAILS_MAP[serviceNo] || {
    serviceNo,
    category: 'Trunk',
    origin: 'Central Terminal',
    destination: 'Hougang Hub',
    originStop: 'Berth 1',
    destinationStop: 'Berth 2',
    operator: 'SBS Transit',
    firstBusWeekday: '05:45',
    lastBusWeekday: '23:45',
    firstBusSat: '05:45',
    lastBusSat: '23:45',
    firstBusSun: '06:00',
    lastBusSun: '23:45',
    frequencyPeak: '7 - 10 mins',
    frequencyOffPeak: '10 - 14 mins',
    stopsCount: 36,
    distanceKm: 22.4,
    adultCardFareMax: '$2.16',
    studentFareMax: '$0.64',
    seniorFareMax: '$0.93',
    stops: [
      { code: '04168', name: 'Aft City Hall Stn Exit B', road: 'North Bridge Rd', distance: 0.0 },
      { code: '01013', name: "St. Joseph's Ch", road: 'Victoria St', distance: 0.6 },
      { code: '01029', name: 'Opp Natl Lib', road: 'North Bridge Rd', distance: 1.2 },
      { code: '01119', name: 'Bugis Stn Exit D', road: 'Victoria St', distance: 1.9 },
    ],
  };

  const displayedStops = direction === 1 ? detail.stops : [...detail.stops].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#500054] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-white text-[#500054] flex items-center justify-center font-extrabold text-[22px] font-mono shadow-sm">
              {detail.serviceNo}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#ffd6f8] text-[#37003a] px-2 py-0.5 rounded">
                  {detail.category}
                </span>
                <span className="text-[12px] text-[#ffd6f8]">{detail.operator}</span>
              </div>
              <h2 className="text-[18px] font-extrabold leading-tight mt-0.5">
                {direction === 1
                  ? `${detail.origin} → ${detail.destination}`
                  : `${detail.destination} → ${detail.origin}`}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Direction Switcher & Frequency summary */}
        <div className="p-4 bg-[#f0f3ff] border-b border-[#e7eeff] flex flex-wrap items-center justify-between gap-3">
          <div className="flex bg-white rounded-lg p-1 border border-[#d8e3fb]">
            <button
              onClick={() => setDirection(1)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                direction === 1 ? 'bg-[#500054] text-white shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
              }`}
            >
              Dir 1: To {detail.destination}
            </button>
            <button
              onClick={() => setDirection(2)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer ${
                direction === 2 ? 'bg-[#500054] text-white shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
              }`}
            >
              Dir 2: To {detail.origin}
            </button>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-[#50434d]">
            <span>
              Peak: <strong className="text-[#111c2d]">{detail.frequencyPeak}</strong>
            </span>
            <span>·</span>
            <span>
              Off-Peak: <strong className="text-[#111c2d]">{detail.frequencyOffPeak}</strong>
            </span>
          </div>
        </div>

        {/* Operating Hours & Fare Bands Grid */}
        <div className="p-5 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#50434d] uppercase block">
                Weekdays Operating
              </span>
              <span className="text-[15px] font-mono font-bold text-[#111c2d] mt-1 block">
                {detail.firstBusWeekday} – {detail.lastBusWeekday}
              </span>
            </div>
            <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#50434d] uppercase block">
                Saturdays Operating
              </span>
              <span className="text-[15px] font-mono font-bold text-[#111c2d] mt-1 block">
                {detail.firstBusSat} – {detail.lastBusSat}
              </span>
            </div>
            <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-bold text-[#50434d] uppercase block">
                Sundays &amp; PH
              </span>
              <span className="text-[15px] font-mono font-bold text-[#111c2d] mt-1 block">
                {detail.firstBusSun} – {detail.lastBusSun}
              </span>
            </div>
          </div>

          {/* Fare Structure Card */}
          <div className="bg-[#dee8ff]/40 p-4 rounded-xl border border-[#d8e3fb]">
            <h4 className="text-[13px] font-bold text-[#500054] uppercase tracking-wider mb-2">
              Distance-Based Concession Fares (SimplyGo Card)
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-[#d8e3fb]">
                <span className="text-[11px] text-[#50434d] block">Adult Card</span>
                <span className="text-[16px] font-extrabold text-[#500054] font-mono">
                  $1.09 – {detail.adultCardFareMax}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#d8e3fb]">
                <span className="text-[11px] text-[#50434d] block">Student Card</span>
                <span className="text-[16px] font-extrabold text-[#500054] font-mono">
                  $0.48 – {detail.studentFareMax}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#d8e3fb]">
                <span className="text-[11px] text-[#50434d] block">Senior Citizen</span>
                <span className="text-[16px] font-extrabold text-[#500054] font-mono">
                  $0.65 – {detail.seniorFareMax}
                </span>
              </div>
            </div>
          </div>

          {/* Sequence of Bus Stops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[14px] font-extrabold text-[#111c2d]">
                Route Stops Sequence ({displayedStops.length} stops · {detail.distanceKm} km)
              </h4>
              <span className="text-[11px] text-[#50434d]">All stops Wheelchair Accessible</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {displayedStops.map((stop, idx) => (
                <div
                  key={`${stop.code}-${idx}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] hover:bg-[#f0f3ff] transition-colors border border-[#E2E8F0]/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#500054]/10 text-[#500054] text-[11px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-bold text-[#500054]">
                          {stop.code}
                        </span>
                        <span className="text-[13px] font-bold text-[#111c2d]">
                          {stop.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#50434d]">{stop.road}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#50434d] font-semibold">
                    {stop.distance} km
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#50434d]">
            LTA DataMall Timetable Revision: Oct 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#500054] text-white text-[13px] font-bold rounded-lg hover:bg-[#6c1d6e] transition-colors cursor-pointer"
          >
            Close Timetable
          </button>
        </div>
      </div>
    </div>
  );
};
