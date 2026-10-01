import React from 'react';
import { SERVICE_DETAILS_MAP } from '../data/transitData';
import { ServiceCategory } from '../types/transit';

interface RoutesViewProps {
  onOpenTimetable: (serviceNo: string) => void;
  onSelectServiceForLive: (serviceNo: string) => void;
}

export const RoutesView: React.FC<RoutesViewProps> = ({
  onOpenTimetable,
  onSelectServiceForLive,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<ServiceCategory | 'All'>('All');
  const [activeServiceKey, setActiveServiceKey] = React.useState<string>('147');

  const allServices = Object.values(SERVICE_DETAILS_MAP);

  const filteredServices = allServices.filter((svc) => {
    const matchesSearch =
      svc.serviceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || svc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const selectedService = SERVICE_DETAILS_MAP[activeServiceKey] || allServices[0];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-[#f0f3ff] rounded-2xl p-6 md:p-8 border border-[#d8e3fb]">
        <div className="flex items-center gap-2 text-[#500054] text-[12px] font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">alt_route</span>
          <span>Comprehensive Network Directory</span>
        </div>
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#500054] tracking-tight">
          Bus Routes, Timetables &amp; Fares
        </h1>
        <p className="text-[15px] text-[#50434d] mt-1 max-w-3xl">
          Search all SBS Transit trunk, feeder, and express services. Inspect full stop sequences, first and last bus dispatches, headway frequencies, and distance fare calculations.
        </p>

        {/* Search & Category Filter Controls */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service (e.g. 147, 166) or destination..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white text-[#111c2d] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#500054] border border-[#d8e3fb] shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82737e] hover:text-[#111c2d]"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {(['All', 'Trunk', 'Feeder', 'Express'] as (ServiceCategory | 'All')[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#500054] text-white shadow-xs'
                    : 'bg-white hover:bg-[#e7eeff] text-[#111c2d] border border-[#d8e3fb]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Route Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Service List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-[12px] font-bold text-[#50434d] px-1">
            <span>SHOWING {filteredServices.length} ROUTES</span>
            <span>SORTED NUMERICALLY</span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredServices.map((svc) => {
              const isActive = svc.serviceNo === selectedService.serviceNo;

              return (
                <div
                  key={svc.serviceNo}
                  onClick={() => setActiveServiceKey(svc.serviceNo)}
                  className={`p-4 rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-white border-[#500054] ring-2 ring-[#ffd6f8] shadow-md'
                      : 'bg-white hover:bg-[#F8F9FA] border-[#E2E8F0] shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-[#500054] text-white flex items-center justify-center font-extrabold text-[20px] font-mono shadow-xs shrink-0">
                        {svc.serviceNo}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffd6f8] text-[#37003a] px-2 py-0.5 rounded">
                            {svc.category}
                          </span>
                          <span className="text-[11px] text-[#50434d]">{svc.stopsCount} stops</span>
                        </div>
                        <h3 className="text-[14px] font-bold text-[#111c2d] mt-1 leading-tight">
                          {svc.origin} ↔ {svc.destination}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-[#50434d] font-bold">
                      {svc.distanceKm} km
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E2E8F0]/70 flex items-center justify-between text-[11px] text-[#50434d]">
                    <span>
                      Freq: <strong className="text-[#111c2d]">{svc.frequencyPeak}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectServiceForLive(svc.serviceNo);
                      }}
                      className="text-[#ac3500] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>NextBus Live</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Route Details & Stoppage Stepper */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#500054] text-white flex items-center justify-center font-extrabold text-[28px] font-mono shadow-md">
                  {selectedService.serviceNo}
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#ffd6f8] text-[#37003a] text-[11px] font-bold uppercase tracking-wider">
                    {selectedService.category} · {selectedService.operator}
                  </span>
                  <h2 className="text-[20px] font-extrabold text-[#111c2d] mt-1">
                    {selectedService.origin} to {selectedService.destination}
                  </h2>
                  <p className="text-[12px] text-[#50434d]">
                    Full distance: {selectedService.distanceKm} km across {selectedService.stops.length} major transit nodes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenTimetable(selectedService.serviceNo)}
                  className="px-4 py-2 bg-[#500054] text-white rounded-lg text-[13px] font-bold hover:bg-[#6c1d6e] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>Full Timetable</span>
                </button>
              </div>
            </div>

            {/* Operating Hours Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#50434d] block">
                  Weekdays Dispatch
                </span>
                <span className="text-[14px] font-mono font-bold text-[#111c2d] mt-0.5 block">
                  {selectedService.firstBusWeekday} – {selectedService.lastBusWeekday}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#50434d] block">
                  Saturdays Dispatch
                </span>
                <span className="text-[14px] font-mono font-bold text-[#111c2d] mt-0.5 block">
                  {selectedService.firstBusSat} – {selectedService.lastBusSat}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#50434d] block">
                  Sundays &amp; Holidays
                </span>
                <span className="text-[14px] font-mono font-bold text-[#111c2d] mt-0.5 block">
                  {selectedService.firstBusSun} – {selectedService.lastBusSun}
                </span>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="bg-[#f0f3ff] p-4 rounded-xl border border-[#d8e3fb] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#500054] tracking-wider block">
                  SimplyGo Fare Range
                </span>
                <span className="text-[13px] text-[#50434d] mt-0.5 block">
                  Distance-based graduated fare
                </span>
              </div>
              <div className="text-right">
                <span className="text-[18px] font-extrabold font-mono text-[#500054]">
                  $1.09 – {selectedService.adultCardFareMax}
                </span>
                <span className="text-[11px] text-[#50434d] block">Adult Card Fare</span>
              </div>
            </div>

            {/* Stoppage Timeline */}
            <div>
              <h3 className="text-[15px] font-extrabold text-[#111c2d] mb-4">
                Intermediate Stoppage Sequence
              </h3>

              <div className="relative pl-6 space-y-4 border-l-2 border-[#500054]/30 ml-3">
                {selectedService.stops.map((stop, idx) => (
                  <div key={stop.code} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#500054] border-2 border-white shadow-xs"></div>
                    <div className="bg-[#F8F9FA] group-hover:bg-[#f0f3ff] p-3 rounded-xl border border-[#E2E8F0] transition-colors flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono font-bold text-[#500054] bg-[#ffd6f8] px-1.5 py-0.2 rounded">
                            {stop.code}
                          </span>
                          <span className="text-[13px] font-bold text-[#111c2d]">{stop.name}</span>
                        </div>
                        <span className="text-[11px] text-[#50434d] mt-0.5 block">{stop.road}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#50434d]">
                        {stop.distance} km
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
