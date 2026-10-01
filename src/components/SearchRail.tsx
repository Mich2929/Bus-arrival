import React from 'react';
import { BusStop, ServiceCategory } from '../types/transit';

interface SearchRailProps {
  busStops: BusStop[];
  currentStopCode: string;
  onSelectStopCode: (code: string) => void;
  selectedServiceNo: string;
  onSelectServiceNo: (svc: string) => void;
  selectedCategory: ServiceCategory | 'All';
  onSelectCategory: (cat: ServiceCategory | 'All') => void;
  onOpenAccessibilityGuide: () => void;
}

export const SearchRail: React.FC<SearchRailProps> = ({
  busStops,
  currentStopCode,
  onSelectStopCode,
  selectedServiceNo,
  onSelectServiceNo,
  selectedCategory,
  onSelectCategory,
  onOpenAccessibilityGuide,
}) => {
  const [searchMode, setSearchMode] = React.useState<'service' | 'stop'>('service');
  const [searchInput, setSearchInput] = React.useState(selectedServiceNo);
  const [stopSearchInput, setStopSearchInput] = React.useState(currentStopCode);

  React.useEffect(() => {
    setSearchInput(selectedServiceNo);
  }, [selectedServiceNo]);

  React.useEffect(() => {
    setStopSearchInput(currentStopCode);
  }, [currentStopCode]);

  const quickServices = ['147', '124', '166', '174', '190', '851', '61', '32'];

  const walkingStops = [
    { code: '04142', name: 'Armenian Ch, Hill St', distance: '140m' },
    { code: '04167', name: 'City Hall Stn Exit B, Nth Bridge', distance: '190m' },
    { code: '01029', name: 'Opp Natl Lib, Nth Bridge Rd', distance: '280m' },
  ];

  const handleEstimateArrival = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'service') {
      const clean = searchInput.trim().toUpperCase();
      if (clean) {
        onSelectServiceNo(clean);
      }
    } else {
      const cleanStop = stopSearchInput.trim();
      if (cleanStop) {
        onSelectStopCode(cleanStop);
      }
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search Mode Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm space-y-5 border border-[#E2E8F0]">
        {/* Segmented Tab Bar */}
        <div className="flex rounded-lg bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setSearchMode('service')}
            className={`flex-1 py-2 text-center rounded-md text-[13px] font-bold transition-all cursor-pointer ${
              searchMode === 'service'
                ? 'bg-[#6c1d6e] text-white shadow-xs'
                : 'text-[#50434d] hover:text-[#111c2d]'
            }`}
          >
            Service No.
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('stop')}
            className={`flex-1 py-2 text-center rounded-md text-[13px] font-bold transition-all cursor-pointer ${
              searchMode === 'stop'
                ? 'bg-[#6c1d6e] text-white shadow-xs'
                : 'text-[#50434d] hover:text-[#111c2d]'
            }`}
          >
            Bus Stop No.
          </button>
        </div>

        {/* Dynamic Form based on Tab */}
        <form onSubmit={handleEstimateArrival} className="space-y-4">
          {searchMode === 'service' ? (
            <div>
              <label
                htmlFor="bus-service-input"
                className="block text-[11px] font-bold text-[#50434d] uppercase tracking-wider mb-1.5"
              >
                Bus Service Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
                  directions_bus
                </span>
                <input
                  id="bus-service-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. 147, 124, 166, 190..."
                  className="w-full pl-11 pr-10 py-3 rounded-lg bg-[#f0f3ff] text-[#111c2d] text-[18px] font-extrabold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#500054] shadow-xs border border-[#d8e3fb]"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82737e] hover:text-[#111c2d] cursor-pointer"
                    aria-label="Clear input"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="bus-stop-code-input"
                className="block text-[11px] font-bold text-[#50434d] uppercase tracking-wider mb-1.5"
              >
                5-Digit Bus Stop Code
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
                  pin_drop
                </span>
                <input
                  id="bus-stop-code-input"
                  type="text"
                  maxLength={5}
                  value={stopSearchInput}
                  onChange={(e) => setStopSearchInput(e.target.value)}
                  placeholder="e.g. 04168, 04142, 01029..."
                  className="w-full pl-11 pr-10 py-3 rounded-lg bg-[#f0f3ff] text-[#111c2d] text-[18px] font-extrabold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#500054] shadow-xs border border-[#d8e3fb] font-mono"
                />
                {stopSearchInput && (
                  <button
                    type="button"
                    onClick={() => setStopSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#82737e] hover:text-[#111c2d] cursor-pointer"
                    aria-label="Clear stop code"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stop Selector Optional */}
          <div>
            <label
              htmlFor="bus-stop-select"
              className="block text-[11px] font-bold text-[#50434d] uppercase tracking-wider mb-1.5"
            >
              Target Bus Stop (Optional)
            </label>
            <div className="relative">
              <select
                id="bus-stop-select"
                value={currentStopCode}
                onChange={(e) => onSelectStopCode(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#f0f3ff] text-[#111c2d] text-[13px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#500054] border border-[#d8e3fb] cursor-pointer"
              >
                {busStops.map((stop) => (
                  <option key={stop.code} value={stop.code}>
                    {stop.code} - {stop.name}, {stop.road}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#82737e] text-[20px]">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* Route Quick Filters */}
          <div>
            <div className="text-[11px] font-bold text-[#50434d] uppercase tracking-wider mb-2">
              Category Filter
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['Popular', 'Trunk', 'Feeder', 'Express'] as ServiceCategory[]).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(isSelected ? 'All' : cat)}
                    className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6c1d6e] text-white shadow-xs'
                        : 'bg-[#e7eeff] hover:bg-[#dee8ff] text-[#111c2d]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estimate Arrival Time Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#ac3500] hover:bg-[#ff6932] text-white text-[14px] font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
            <span>Estimate Arrival Time</span>
          </button>
        </form>

        {/* Quick Service Jumpers */}
        <div className="pt-2 border-t border-[#E2E8F0]">
          <span className="block text-[11px] font-bold text-[#50434d] uppercase tracking-wider mb-2">
            Services at this Stop
          </span>
          <div className="grid grid-cols-4 gap-2">
            {quickServices.map((svcNo) => {
              const isActive = svcNo === selectedServiceNo;
              return (
                <button
                  key={svcNo}
                  type="button"
                  onClick={() => onSelectServiceNo(svcNo)}
                  className={`py-2 rounded-lg text-center font-extrabold text-[16px] font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#500054] text-white shadow-md scale-105 ring-2 ring-[#ffd6f8]'
                      : 'bg-[#dee8ff] hover:bg-[#500054] hover:text-white text-[#111c2d]'
                  }`}
                >
                  {svcNo}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Co-located Stops within 300m */}
      <div className="bg-white rounded-xl p-5 shadow-sm space-y-4 border border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-extrabold text-[#111c2d]">
            Stops in Walking Radius
          </h3>
          <span className="text-[11px] text-[#ac3500] font-bold uppercase tracking-wider">
            &lt; 300m
          </span>
        </div>
        <ul className="space-y-2">
          {walkingStops.map((stop) => {
            const isCurrent = stop.code === currentStopCode;
            return (
              <li
                key={stop.code}
                onClick={() => onSelectStopCode(stop.code)}
                className={`p-2.5 rounded-lg transition-all flex items-center justify-between cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#ffd6f8]/30 border-[#500054]'
                    : 'bg-[#f0f3ff] hover:bg-[#e7eeff] border-transparent'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-mono font-bold text-[#500054]">
                      {stop.code}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] bg-[#500054] text-white font-bold px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#111c2d] font-medium leading-tight">
                    {stop.name}
                  </p>
                </div>
                <span className="text-[11px] text-[#50434d] font-bold bg-[#e7eeff] px-2 py-0.5 rounded">
                  {stop.distance}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Passenger Fare & WAB Accessibility Helper */}
      <div className="bg-[#dee8ff] rounded-xl p-5 shadow-sm space-y-3 border border-[#d8e3fb]">
        <div className="flex items-center gap-2 text-[#500054] text-[16px] font-extrabold">
          <span className="material-symbols-outlined text-[20px]">accessible</span>
          <span>Accessibility Guide</span>
        </div>
        <p className="text-[12px] text-[#111c2d] leading-relaxed">
          All SBS Transit Trunk &amp; Feeder services at this berth are 100%{' '}
          <strong>Wheelchair Accessible Buses (WAB)</strong> equipped with manual ramps and designated safety harnesses.
        </p>
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onOpenAccessibilityGuide}
            className="text-[12px] text-[#ac3500] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Conditions of Carriage</span>
            <span>→</span>
          </button>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-[#111c2d] shadow-2xs">
            SimplyGo Concession
          </span>
        </div>
      </div>
    </aside>
  );
};
