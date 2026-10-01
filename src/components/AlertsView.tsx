import React from 'react';
import { TRANSIT_ALERTS } from '../data/transitData';
import { TransitAlert } from '../types/transit';

export const AlertsView: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = React.useState<TransitAlert | null>(TRANSIT_ALERTS[0]);
  const [filterCategory, setFilterCategory] = React.useState<string>('all');

  const filteredAlerts = TRANSIT_ALERTS.filter((alert) => {
    if (filterCategory === 'all') return true;
    return alert.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#f0f3ff] rounded-2xl p-6 md:p-8 border border-[#d8e3fb]">
        <div className="flex items-center gap-2 text-[#ac3500] text-[12px] font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">campaign</span>
          <span>Commuter Dispatch Broadcasts</span>
        </div>
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#500054] tracking-tight">
          Service Alerts &amp; Passenger Advisories
        </h1>
        <p className="text-[15px] text-[#50434d] mt-1 max-w-3xl">
          Official bulletins on road diversions, civic events, MRT line enhancement works, and seasonal bus schedule revisions across Singapore.
        </p>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: 'all', label: 'All Advisories' },
            { id: 'diversion', label: 'Route Diversions' },
            { id: 'maintenance', label: 'Track Maintenance' },
            { id: 'upgrade', label: 'System Trials' },
            { id: 'advisory', label: 'General Notices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#500054] text-white shadow-xs'
                  : 'bg-white hover:bg-[#e7eeff] text-[#111c2d] border border-[#d8e3fb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Alerts list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[12px] font-bold text-[#50434d] px-1 uppercase tracking-wider">
            Active Bulletins ({filteredAlerts.length})
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-[#500054] ring-2 ring-[#ffd6f8] shadow-md'
                      : 'bg-white hover:bg-[#F8F9FA] border-[#E2E8F0] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#ac3500] uppercase">
                      {alert.date}
                    </span>
                    {alert.active && (
                      <span className="px-2 py-0.5 rounded text-white bg-[#ac3500] text-[10px] font-bold uppercase tracking-wider">
                        Active Today
                      </span>
                    )}
                  </div>

                  <h3 className="text-[14px] font-extrabold text-[#111c2d] mt-1.5 leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-[12px] text-[#50434d] mt-1 line-clamp-2">
                    {alert.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-[#E2E8F0]/70">
                    <span className="text-[10px] text-[#50434d] self-center mr-1">
                      Affected Services:
                    </span>
                    {alert.affectedServices.map((svc) => (
                      <span
                        key={svc}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#f0f3ff] text-[#500054] border border-[#d8e3fb]"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Full Bulletin View */}
        <div className="lg:col-span-7">
          {selectedAlert ? (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2E8F0] space-y-6">
              <div className="border-b border-[#E2E8F0] pb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-[#ffdbd0] text-[#390c00]">
                    {selectedAlert.category}
                  </span>
                  <span className="text-[12px] text-[#50434d]">
                    Published on {selectedAlert.date}
                  </span>
                </div>
                <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#111c2d] leading-snug">
                  {selectedAlert.title}
                </h2>
              </div>

              <div className="space-y-4 text-[14px] text-[#111c2d] leading-relaxed">
                <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] font-semibold text-[#500054]">
                  {selectedAlert.summary}
                </div>

                <div className="prose text-[#50434d] space-y-3">
                  <p>{selectedAlert.fullDetails}</p>
                </div>

                <div className="bg-[#f0f3ff] p-4 rounded-xl border border-[#d8e3fb] space-y-2">
                  <h4 className="text-[13px] font-bold text-[#500054] uppercase tracking-wider">
                    Impacted Commuter Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlert.affectedServices.map((svc) => (
                      <span
                        key={svc}
                        className="text-[13px] font-mono font-extrabold px-3 py-1 rounded-lg bg-white text-[#500054] border border-[#d8e3fb] shadow-xs"
                      >
                        Service {svc}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#50434d] mt-2">
                    Dynamic telematics and arrival predictions in the NextBus live feed will reflect these skip-stop schedules.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[12px] text-[#50434d]">
                  For enquiries, call ComfortDelGro customer care at 1800-287-2727.
                </div>
                <a
                  href="tel:18002872727"
                  className="px-4 py-2 bg-[#500054] text-white rounded-lg text-[13px] font-bold hover:bg-[#6c1d6e] transition-colors"
                >
                  Call Hotline
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-[#50434d] border border-[#E2E8F0]">
              Select an advisory from the left to view complete commuter information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
