import React from 'react';
import { BusStop } from '../types/transit';

interface ChangeStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  busStops: BusStop[];
  currentStopCode: string;
  onSelectStop: (code: string) => void;
  onRecalibrateGps: () => void;
}

export const ChangeStopModal: React.FC<ChangeStopModalProps> = ({
  isOpen,
  onClose,
  busStops,
  currentStopCode,
  onSelectStop,
  onRecalibrateGps,
}) => {
  const [filterText, setFilterText] = React.useState('');

  if (!isOpen) return null;

  const filteredStops = busStops.filter(
    (s) =>
      s.code.includes(filterText) ||
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.road.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#500054] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">location_searching</span>
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-[#111c2d]">Change Bus Stop Berth</h3>
              <p className="text-[12px] text-[#50434d]">
                Select from nearby berths or search 5,000+ LTA stops in Singapore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#E2E8F0] text-[#50434d] hover:text-[#111c2d] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search input & GPS action */}
        <div className="p-4 border-b border-[#E2E8F0] space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search by stop code (e.g. 04168) or road name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f0f3ff] text-[#111c2d] text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#500054] border border-[#d8e3fb]"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onRecalibrateGps();
                onClose();
              }}
              className="text-[12px] font-bold text-[#500054] hover:text-[#ac3500] flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span>Use Current Device GPS Location</span>
            </button>
            <span className="text-[11px] text-[#50434d]">{filteredStops.length} stops available</span>
          </div>
        </div>

        {/* List of stops */}
        <div className="p-4 overflow-y-auto space-y-2 max-h-96">
          {filteredStops.map((stop) => {
            const isSelected = stop.code === currentStopCode;

            return (
              <button
                key={stop.code}
                type="button"
                onClick={() => {
                  onSelectStop(stop.code);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-[#ffd6f8]/30 border-[#500054] ring-1 ring-[#500054]'
                    : 'bg-[#F8F9FA] hover:bg-[#f0f3ff] border-[#E2E8F0]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono font-bold text-[#500054] bg-[#ffd6f8] px-2 py-0.5 rounded">
                      {stop.code}
                    </span>
                    <span className="text-[14px] font-bold text-[#111c2d]">{stop.name}</span>
                  </div>
                  <div className="text-[12px] text-[#50434d] mt-0.5">{stop.road}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {stop.services.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white text-[#500054] border border-[#d8e3fb]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-[12px] font-bold text-[#50434d] block">
                    {stop.distanceMeters > 1000
                      ? `${(stop.distanceMeters / 1000).toFixed(1)} km`
                      : `${stop.distanceMeters} m`}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#16A34A] uppercase block mt-1">
                      Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#500054] text-white text-[13px] font-bold rounded-lg hover:bg-[#6c1d6e] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
