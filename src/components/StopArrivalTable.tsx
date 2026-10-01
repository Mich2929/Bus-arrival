import React from 'react';
import { ServiceArrival } from '../types/transit';

interface StopArrivalTableProps {
  services: ServiceArrival[];
  stopCode: string;
  selectedServiceNo: string;
  onSelectService: (serviceNo: string) => void;
  pinnedServices: string[];
  onTogglePin: (serviceNo: string) => void;
}

export const StopArrivalTable: React.FC<StopArrivalTableProps> = ({
  services,
  stopCode,
  selectedServiceNo,
  onSelectService,
  pinnedServices,
  onTogglePin,
}) => {
  const [sortBy, setSortBy] = React.useState<'arrival' | 'service' | 'crowd'>('arrival');

  // Filter out or reorder according to sort
  const sortedServices = React.useMemo(() => {
    const list = [...services];
    if (sortBy === 'service') {
      return list.sort((a, b) => a.serviceNo.localeCompare(b.serviceNo, undefined, { numeric: true }));
    }
    if (sortBy === 'crowd') {
      const rank = { seats: 1, standing: 2, limited: 3 };
      return list.sort((a, b) => rank[a.nextBus.load] - rank[b.nextBus.load]);
    }
    // Sort by arrival time
    return list.sort((a, b) => {
      const aVal = a.nextBus.etaMinutes === 'Arr' ? 0 : Number(a.nextBus.etaMinutes);
      const bVal = b.nextBus.etaMinutes === 'Arr' ? 0 : Number(b.nextBus.etaMinutes);
      return aVal - bVal;
    });
  }, [services, sortBy]);

  const renderLoadPill = (eta: number | 'Arr', load: 'seats' | 'standing' | 'limited') => {
    let bg = 'bg-[#16A34A]/10 text-[#16A34A]';
    let icon = 'airline_seat_recline_normal';

    if (load === 'standing') {
      bg = 'bg-[#D97706]/10 text-[#D97706]';
      icon = 'person';
    } else if (load === 'limited') {
      bg = 'bg-[#DC2626]/10 text-[#DC2626]';
      icon = 'group';
    }

    const text = eta === 'Arr' ? 'Arr' : `${eta} mins`;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold font-mono ${bg}`}>
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
        <span>{text}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5 border border-[#E2E8F0]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-extrabold text-[#111c2d] tracking-tight">
            All Buses Calling at Stop {stopCode}
          </h3>
          <p className="text-[13px] text-[#50434d]">
            Real-time arrival schedule for remaining services at this berth. Click any service to inspect full telematics.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-[#50434d]">Sort by:</span>
          <div className="flex bg-[#F1F5F9] rounded-lg p-0.5 border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSortBy('arrival')}
              className={`px-2.5 py-1 rounded text-[12px] font-bold transition-all cursor-pointer ${
                sortBy === 'arrival' ? 'bg-white text-[#500054] shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
              }`}
            >
              Arrival Time
            </button>
            <button
              type="button"
              onClick={() => setSortBy('service')}
              className={`px-2.5 py-1 rounded text-[12px] font-bold transition-all cursor-pointer ${
                sortBy === 'service' ? 'bg-white text-[#500054] shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
              }`}
            >
              Service No
            </button>
            <button
              type="button"
              onClick={() => setSortBy('crowd')}
              className={`px-2.5 py-1 rounded text-[12px] font-bold transition-all cursor-pointer ${
                sortBy === 'crowd' ? 'bg-white text-[#500054] shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
              }`}
            >
              Seats
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Arrival Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="text-[#50434d] text-[11px] font-bold uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              <th className="py-2.5 px-3">Service</th>
              <th className="py-2.5 px-3">Terminating At</th>
              <th className="py-2.5 px-3">Next Bus</th>
              <th className="py-2.5 px-3">2nd Bus</th>
              <th className="py-2.5 px-3">3rd Bus</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]/70 text-[13px]">
            {sortedServices.map((svc) => {
              const isSelected = svc.serviceNo === selectedServiceNo;
              const isPinned = pinnedServices.includes(svc.serviceNo);

              return (
                <tr
                  key={svc.serviceNo}
                  onClick={() => onSelectService(svc.serviceNo)}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer group ${
                    isSelected ? 'bg-[#ffd6f8]/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center justify-center w-11 h-9 rounded-lg font-extrabold text-[15px] font-mono shadow-xs transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-[#500054] text-white ring-2 ring-[#ffd6f8]'
                          : svc.category === 'Express'
                          ? 'bg-[#d8e3fb] text-[#111c2d]'
                          : 'bg-[#6c1d6e] text-white'
                      }`}
                    >
                      {svc.serviceNo}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-[13px] text-[#111c2d] font-bold flex items-center gap-1.5">
                      <span>{svc.destination}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold text-[#500054] bg-[#ffd6f8] px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-[#50434d] font-normal">
                      via {svc.via}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {renderLoadPill(svc.nextBus.etaMinutes, svc.nextBus.load)}
                  </td>

                  <td className="py-3 px-3">
                    {renderLoadPill(svc.secondBus.etaMinutes, svc.secondBus.load)}
                  </td>

                  <td className="py-3 px-3">
                    {renderLoadPill(svc.thirdBus.etaMinutes, svc.thirdBus.load)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(svc.serviceNo);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isPinned ? 'text-[#ac3500] hover:bg-[#ffdbd0]' : 'text-[#82737e] hover:text-[#500054] hover:bg-[#F1F5F9]'
                      }`}
                      title={isPinned ? 'Unpin route' : 'Pin route to top'}
                      aria-label={isPinned ? `Unpin ${svc.serviceNo}` : `Pin ${svc.serviceNo}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPinned ? 'star' : 'star_border'}
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
