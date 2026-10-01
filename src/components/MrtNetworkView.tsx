import React from 'react';
import { SBS_MRT_STATIONS } from '../data/transitData';
import { MRTStation } from '../types/transit';

export const MrtNetworkView: React.FC = () => {
  const [selectedLine, setSelectedLine] = React.useState<'ALL' | 'DTL' | 'NEL'>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredStations = SBS_MRT_STATIONS.filter((stn) => {
    const matchesLine = selectedLine === 'ALL' || stn.line === selectedLine;
    const matchesSearch =
      stn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stn.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stn.interchangeWith.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLine && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-[#f0f3ff] rounded-2xl p-6 md:p-8 border border-[#d8e3fb]">
        <div className="flex items-center gap-2 text-[#500054] text-[12px] font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">train</span>
          <span>SBS Transit Rail Division</span>
        </div>
        <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#500054] tracking-tight">
          MRT &amp; LRT Interchange Network
        </h1>
        <p className="text-[15px] text-[#50434d] mt-1 max-w-3xl">
          Operating Singapore&apos;s Downtown Line (DTL), North East Line (NEL), and Sengkang-Punggol Light Rail Transit (LRT) systems with world-class punctuality and integrated multi-modal bus interchanges.
        </p>

        {/* Live Line Status Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          <div className="bg-white p-4 rounded-xl border border-[#005049]/20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#0055A5] text-white flex items-center justify-center font-bold text-[12px]">
                DTL
              </span>
              <div>
                <span className="text-[13px] font-extrabold text-[#111c2d] block">
                  Downtown Line
                </span>
                <span className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Normal Service
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#50434d] font-mono">2-3m headway</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#500054]/20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#7A2A90] text-white flex items-center justify-center font-bold text-[12px]">
                NEL
              </span>
              <div>
                <span className="text-[13px] font-extrabold text-[#111c2d] block">
                  North East Line
                </span>
                <span className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Normal Service
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#50434d] font-mono">2-3m headway</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#748494]/20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#748494] text-white flex items-center justify-center font-bold text-[12px]">
                LRT
              </span>
              <div>
                <span className="text-[13px] font-extrabold text-[#111c2d] block">
                  Sengkang &amp; Punggol LRT
                </span>
                <span className="text-[11px] text-[#16A34A] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Normal Service
                </span>
              </div>
            </div>
            <span className="text-[12px] text-[#50434d] font-mono">3-4m headway</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex bg-[#F1F5F9] rounded-xl p-1 border border-[#E2E8F0] w-full md:w-auto">
          <button
            onClick={() => setSelectedLine('ALL')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
              selectedLine === 'ALL' ? 'bg-[#500054] text-white shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
            }`}
          >
            All Rail Lines
          </button>
          <button
            onClick={() => setSelectedLine('DTL')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
              selectedLine === 'DTL' ? 'bg-[#0055A5] text-white shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
            }`}
          >
            Downtown Line (DTL)
          </button>
          <button
            onClick={() => setSelectedLine('NEL')}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
              selectedLine === 'NEL' ? 'bg-[#7A2A90] text-white shadow-xs' : 'text-[#50434d] hover:text-[#111c2d]'
            }`}
          >
            North East Line (NEL)
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82737e] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search station or interchange..."
            className="w-full pl-11 pr-4 py-2 rounded-xl bg-white text-[#111c2d] text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#500054] border border-[#d8e3fb]"
          />
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => (
          <div
            key={station.code}
            className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded bg-[#f0f3ff] text-[#500054] border border-[#d8e3fb]">
                  {station.code}
                </span>
                <h3 className="text-[18px] font-extrabold text-[#111c2d] mt-2">
                  {station.name}
                </h3>
              </div>

              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  station.line === 'DTL' ? 'bg-[#0055A5]' : 'bg-[#7A2A90]'
                }`}
                title={station.line === 'DTL' ? 'Downtown Line' : 'North East Line'}
              ></span>
            </div>

            {/* Interchanges with other lines */}
            {station.interchangeWith.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase text-[#50434d] tracking-wider block mb-1">
                  Interchange Connections
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {station.interchangeWith.map((ic) => (
                    <span
                      key={ic}
                      className="text-[11px] font-semibold bg-[#F1F5F9] text-[#111c2d] px-2 py-0.5 rounded border border-[#E2E8F0]"
                    >
                      {ic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* First & Last Train timings */}
            <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E2E8F0] space-y-1.5 text-[12px]">
              <div className="flex items-center justify-between text-[#50434d]">
                <span>First Train (NB/EB):</span>
                <span className="font-mono font-bold text-[#111c2d]">
                  {station.firstTrainNorthOrEast}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#50434d]">
                <span>First Train (SB/WB):</span>
                <span className="font-mono font-bold text-[#111c2d]">
                  {station.firstTrainSouthOrWest}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#50434d] pt-1 border-t border-[#E2E8F0]">
                <span>Last Train:</span>
                <span className="font-mono font-bold text-[#ac3500]">
                  {station.lastTrainNorthOrEast} / {station.lastTrainSouthOrWest}
                </span>
              </div>
            </div>

            {/* Connected Bus Interchange */}
            {station.busInterchangeNearby && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#50434d] pt-1">
                <span className="material-symbols-outlined text-[16px] text-[#500054]">
                  directions_bus
                </span>
                <span className="truncate">{station.busInterchangeNearby}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
