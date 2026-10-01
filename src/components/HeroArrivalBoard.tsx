import React from 'react';
import { ServiceArrival } from '../types/transit';

interface HeroArrivalBoardProps {
  service: ServiceArrival;
  refreshSeconds: number;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isPinned: boolean;
  onTogglePin: (serviceNo: string) => void;
  onOpenTimetable: (serviceNo: string) => void;
  currentStopCode: string;
  currentStopName: string;
}

export const HeroArrivalBoard: React.FC<HeroArrivalBoardProps> = ({
  service,
  refreshSeconds,
  onManualRefresh,
  isRefreshing,
  isPinned,
  onTogglePin,
  onOpenTimetable,
  currentStopCode,
  currentStopName,
}) => {
  const [alertEnabled, setAlertEnabled] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAlertToggle = (checked: boolean) => {
    setAlertEnabled(checked);
    if (checked) {
      showToast(`Proximity Alert armed: You'll be notified when ${service.serviceNo} is 2 stops away.`);
    } else {
      showToast(`Proximity alert disabled for Service ${service.serviceNo}.`);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-7 shadow-md relative overflow-hidden border border-[#E2E8F0]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-20 bg-[#111c2d] text-white text-[12px] px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[#89f5e7] text-[16px]">notifications_active</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Branded Top Accent Gradient Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#500054] via-[#6c1d6e] to-[#ac3500]"></div>

      {/* Card Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 border-b border-[#E2E8F0]/70">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#500054] text-white flex items-center justify-center font-extrabold text-[32px] tracking-tight shadow-md shrink-0">
            {service.serviceNo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded bg-[#ffd6f8] text-[#37003a] text-[11px] font-bold uppercase tracking-wider">
                {service.category} Service
              </span>
              <span className="text-[12px] text-[#ac3500] font-bold">
                SBS Transit Fleet #{service.fleetPlate}
              </span>
            </div>
            <h3 className="text-[22px] leading-tight text-[#111c2d] font-extrabold tracking-tight">
              Towards {service.destination}
            </h3>
            <p className="text-[13px] text-[#50434d] font-normal mt-0.5">
              via {service.via}
            </p>
          </div>
        </div>

        {/* Live sync controls */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[#50434d] text-[12px]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>
              Auto-refresh in{' '}
              <strong className="text-[#500054] font-bold font-mono">
                {isRefreshing ? '...' : `${refreshSeconds}s`}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="text-[#500054] hover:text-[#ac3500] text-[13px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Fetch latest telematics update"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'Syncing...' : 'Update Now'}</span>
          </button>
        </div>
      </div>

      {/* Triple Timing Display (Singapore LTA Standard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-5">
        {/* Next Bus (1st) */}
        <div className="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20 flex flex-col justify-between hover:bg-[#16A34A]/15 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#16A34A] tracking-wider">
              Next Bus
            </span>
            <div className="flex items-center gap-1.5 text-[#16A34A]">
              <span className="material-symbols-outlined text-[16px]" title="Wheelchair Accessible (WAB)">
                accessible
              </span>
              <span className="material-symbols-outlined text-[16px]" title={service.nextBus.type === 'DD' ? 'Double Decker Bus' : 'Single Decker Bus'}>
                {service.nextBus.type === 'DD' ? 'directions_bus' : 'airport_shuttle'}
              </span>
            </div>
          </div>
          <div className="my-3">
            <span className="text-[40px] leading-tight font-extrabold text-[#16A34A] tracking-tight font-mono">
              {service.nextBus.etaMinutes === 'Arr' ? 'Arr' : `${service.nextBus.etaMinutes}m`}
            </span>
            <span className="block text-[12px] text-[#16A34A] font-semibold mt-0.5">
              {service.nextBus.estimatedTimeStr}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#16A34A]/20">
            <span className="material-symbols-outlined text-[#16A34A] text-[16px]">
              airline_seat_recline_normal
            </span>
            <span className="text-[12px] text-[#16A34A] font-bold">Seats Available</span>
          </div>
        </div>

        {/* 2nd Bus */}
        <div className="p-4 rounded-xl bg-[#D97706]/10 border border-[#D97706]/20 flex flex-col justify-between hover:bg-[#D97706]/15 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#D97706] tracking-wider">
              2nd Bus
            </span>
            <div className="flex items-center gap-1.5 text-[#D97706]">
              <span className="material-symbols-outlined text-[16px]" title="Wheelchair Accessible (WAB)">
                accessible
              </span>
              <span className="material-symbols-outlined text-[16px]" title={service.secondBus.type === 'DD' ? 'Double Decker Bus' : 'Single Decker Bus'}>
                {service.secondBus.type === 'DD' ? 'directions_bus' : 'airport_shuttle'}
              </span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] leading-tight font-extrabold text-[#D97706] tracking-tight font-mono">
                {service.secondBus.etaMinutes}
              </span>
              <span className="text-[18px] font-bold text-[#D97706]">mins</span>
            </div>
            <span className="block text-[12px] text-[#50434d] mt-0.5 font-medium">
              {service.secondBus.estimatedTimeStr}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#D97706]/20">
            <span className="material-symbols-outlined text-[#D97706] text-[16px]">
              person
            </span>
            <span className="text-[12px] text-[#D97706] font-bold">Standing Available</span>
          </div>
        </div>

        {/* 3rd Bus */}
        <div className="p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex flex-col justify-between hover:bg-[#DC2626]/15 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#DC2626] tracking-wider">
              3rd Bus
            </span>
            <div className="flex items-center gap-1.5 text-[#DC2626]">
              <span className="material-symbols-outlined text-[16px]" title="Wheelchair Accessible (WAB)">
                accessible
              </span>
              <span className="material-symbols-outlined text-[16px]" title={service.thirdBus.type === 'DD' ? 'Double Decker Bus' : 'Single Decker Bus'}>
                {service.thirdBus.type === 'DD' ? 'directions_bus' : 'airport_shuttle'}
              </span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] leading-tight font-extrabold text-[#DC2626] tracking-tight font-mono">
                {service.thirdBus.etaMinutes}
              </span>
              <span className="text-[18px] font-bold text-[#DC2626]">mins</span>
            </div>
            <span className="block text-[12px] text-[#50434d] mt-0.5 font-medium">
              {service.thirdBus.estimatedTimeStr}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#DC2626]/20">
            <span className="material-symbols-outlined text-[#DC2626] text-[16px]">
              group
            </span>
            <span className="text-[12px] text-[#DC2626] font-bold">Limited Standing</span>
          </div>
        </div>
      </div>

      {/* Route Progress Mini-Tracker Stepper */}
      <div className="mt-6 pt-5 bg-[#f0f3ff] rounded-xl p-4 border border-[#e7eeff]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase font-bold text-[#50434d] tracking-wider">
            Live Route Progression
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#500054] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ac3500] animate-pulse"></span>
              2 Vehicles In-Transit
            </span>
          </div>
        </div>

        {/* Horizontal Step Progression */}
        <div className="relative flex items-center justify-between px-2 sm:px-6 py-2">
          {/* Background connector track */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#d8e3fb]"></div>
          <div className="absolute left-6 w-1/2 top-1/2 -translate-y-1/2 h-1 bg-[#500054]"></div>

          {/* Stop 1: Previous */}
          <div className="relative z-10 flex flex-col items-center group">
            <div className="w-8 h-8 rounded-full bg-[#d8e3fb] text-[#111c2d] flex items-center justify-center font-bold text-[11px] shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="text-[11px] font-bold text-[#111c2d] mt-1.5 font-mono">04142</span>
            <span className="text-[12px] text-[#50434d] text-center max-w-[85px] truncate">
              Armenian Ch
            </span>
          </div>

          {/* Stop 2: Current Location (Active) */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#500054] text-white flex items-center justify-center font-bold shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            </div>
            <span className="text-[11px] font-bold text-[#500054] mt-1 font-mono">
              {currentStopCode} (Here)
            </span>
            <span className="text-[12px] text-[#111c2d] font-bold text-center max-w-[100px] truncate">
              {currentStopName.split('—')[0] || currentStopName}
            </span>
          </div>

          {/* Stop 3: Next */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#d8e3fb] text-[#50434d] flex items-center justify-center font-bold text-[12px]">
              3
            </div>
            <span className="text-[11px] font-bold text-[#50434d] mt-1.5 font-mono">01013</span>
            <span className="text-[12px] text-[#50434d] text-center max-w-[85px] truncate">
              St. Joseph's Ch
            </span>
          </div>

          {/* Stop 4: After */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#d8e3fb] text-[#50434d] flex items-center justify-center font-bold text-[12px]">
              4
            </div>
            <span className="text-[11px] font-bold text-[#50434d] mt-1.5 font-mono">01029</span>
            <span className="text-[12px] text-[#50434d] text-center max-w-[85px] truncate">
              Opp Natl Lib
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Card Controls & Actions */}
      <div className="flex flex-wrap items-center justify-between pt-5 mt-5 gap-3 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTogglePin(service.serviceNo)}
            className={`px-3.5 py-2 rounded-lg text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPinned
                ? 'bg-[#ffd6f8] text-[#500054] border border-[#ffaaf8]'
                : 'bg-[#e7eeff] hover:bg-[#dee8ff] text-[#111c2d]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPinned ? 'bookmark' : 'bookmark_border'}
            </span>
            <span>{isPinned ? `Pinned (${service.serviceNo})` : `Pin Service ${service.serviceNo}`}</span>
          </button>

          <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#50434d] select-none hover:text-[#111c2d]">
            <input
              type="checkbox"
              checked={alertEnabled}
              onChange={(e) => handleAlertToggle(e.target.checked)}
              className="rounded text-[#500054] focus:ring-0 w-4 h-4 cursor-pointer accent-[#500054]"
            />
            <span>Alert when 2 stops away</span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => onOpenTimetable(service.serviceNo)}
          className="text-[13px] text-[#500054] font-bold hover:underline flex items-center gap-1 cursor-pointer hover:text-[#ac3500] transition-colors"
        >
          <span>Full {service.serviceNo} Timetable & Fares</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
