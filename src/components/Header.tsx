import React from 'react';

export type NavTab = 'nextbus-arrival' | 'bus-routes-and-timetables' | 'mrt-lrt-interchange-network' | 'service-alerts-and-advisories';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  textSize: 'normal' | 'large' | 'larger';
  onChangeTextSize: (size: 'normal' | 'large' | 'larger') => void;
  pinnedCount?: number;
  onOpenPinned?: () => void;
  currentStopName?: string;
  onOpenChangeStop?: () => void;
  onOpenHealth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  textSize,
  onChangeTextSize,
  pinnedCount = 0,
  onOpenPinned,
  currentStopName = 'Singapore Central',
  onOpenChangeStop,
  onOpenHealth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Telematics & Accessibility Bar */}
      <div className="bg-[#500054] text-white py-1 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-semibold tracking-wide">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenHealth}
              className="flex items-center gap-1.5 text-[#89f5e7] hover:underline cursor-pointer"
              title="Click to check API Health & LTA DataMall Gateway Status"
            >
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>LTA DataMall v3 Synced</span>
              <span className="text-[10px] bg-white/20 text-white px-1 rounded ml-0.5">Health</span>
            </button>
            <button
              onClick={onOpenChangeStop}
              className="hidden sm:flex items-center gap-1.5 text-[#ffd6f8] hover:text-white transition-colors cursor-pointer"
              title="Click to change GPS location"
            >
              <span className="material-symbols-outlined text-[14px]">near_me</span>
              <span>GPS Active: {currentStopName}</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Text Size Accessibility Controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#ffd6f8] opacity-75">Text Size:</span>
              <div className="flex items-center bg-[#6c1d6e] rounded px-1">
                <button
                  type="button"
                  onClick={() => onChangeTextSize('normal')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    textSize === 'normal' ? 'bg-[#ffd6f8] text-[#37003a] font-bold' : 'text-white/80 hover:text-white'
                  }`}
                  aria-label="Normal text size"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTextSize('large')}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    textSize === 'large' ? 'bg-[#ffd6f8] text-[#37003a] font-bold' : 'text-white/80 hover:text-white'
                  }`}
                  aria-label="Large text size"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTextSize('larger')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    textSize === 'larger' ? 'bg-[#ffd6f8] text-[#37003a] font-bold' : 'text-white/80 hover:text-white'
                  }`}
                  aria-label="Extra large text size"
                >
                  A+
                </button>
              </div>
            </div>

            <a
              href="tel:18002872727"
              className="hidden md:flex items-center gap-1.5 text-[#ffd6f8] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">support_agent</span>
              <span>Hotline: 1800-287-2727</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo & Brand Lockup */}
          <button
            onClick={() => onSelectTab('nextbus-arrival')}
            className="flex items-center gap-3 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#500054] rounded-lg"
          >
            <img
              alt="SBS Transit Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UMXJk6hW4Rsb-YHXm49TDq1oiv44AVfO9Uube2UWEdBvnF8JRRKapIvMlL5nA9x3I1rtevX4K5p0oZi1iV18_9CiXxdVVm_O8uvhBsIEPfNaqLX0RRkYSrMIs-DLhDSQBlxMloBvk84Y_S-4lviJP1kSF2Rvvw94evVdxE1UKYaTP9464vytUoK--kl-Kj4ylAjRHCiQM60quZWTIEOgnU3-2JBriDwF4i-lEjLMultbkYNYLc4gwQyb0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback brand icon if image network is throttled
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-[18px] leading-tight font-extrabold text-[#500054] tracking-tight">
                SBS Transit
              </span>
              <span className="text-[11px] leading-tight text-[#ac3500] font-bold uppercase tracking-wider">
                NextBus Live
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 ml-4">
            <button
              type="button"
              onClick={() => onSelectTab('nextbus-arrival')}
              className={`transition-all rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer ${
                activeTab === 'nextbus-arrival'
                  ? 'bg-[#6c1d6e] text-white shadow-sm'
                  : 'text-[#50434d] hover:text-[#111c2d] hover:bg-[#e7eeff]/60'
              }`}
            >
              NextBus Arrival
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('bus-routes-and-timetables')}
              className={`transition-all rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer ${
                activeTab === 'bus-routes-and-timetables'
                  ? 'bg-[#6c1d6e] text-white shadow-sm'
                  : 'text-[#50434d] hover:text-[#111c2d] hover:bg-[#e7eeff]/60'
              }`}
            >
              Bus Routes & Timetables
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('mrt-lrt-interchange-network')}
              className={`transition-all rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer ${
                activeTab === 'mrt-lrt-interchange-network'
                  ? 'bg-[#6c1d6e] text-white shadow-sm'
                  : 'text-[#50434d] hover:text-[#111c2d] hover:bg-[#e7eeff]/60'
              }`}
            >
              MRT/LRT Interchange Network
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('service-alerts-and-advisories')}
              className={`transition-all rounded-lg px-4 py-2 text-[13px] font-bold cursor-pointer relative ${
                activeTab === 'service-alerts-and-advisories'
                  ? 'bg-[#6c1d6e] text-white shadow-sm'
                  : 'text-[#50434d] hover:text-[#111c2d] hover:bg-[#e7eeff]/60'
              }`}
            >
              <span>Service Alerts & Advisories</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#ac3500] text-white">
                4
              </span>
            </button>
          </nav>
        </div>

        {/* Right Indicators & User Controls */}
        <div className="flex items-center gap-4">
          {/* LTA Load Color Legend */}
          <div className="hidden sm:flex items-center bg-[#F1F5F9] px-3.5 py-1.5 rounded-full gap-2 text-[12px] border border-[#E2E8F0]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#16A34A] text-[16px]">
                airline_seat_recline_normal
              </span>
              <span className="text-[#50434d] font-medium">Seats</span>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <span className="material-symbols-outlined text-[#D97706] text-[16px]">person</span>
              <span className="text-[#50434d] font-medium">Standing</span>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <span className="material-symbols-outlined text-[#DC2626] text-[16px]">group</span>
              <span className="text-[#50434d] font-medium">Limited</span>
            </div>
          </div>

          {/* Pinned Bookmark button */}
          {onOpenPinned && (
            <button
              onClick={onOpenPinned}
              className="relative p-2 rounded-full hover:bg-[#e7eeff] text-[#500054] transition-colors cursor-pointer"
              title="View Pinned Services"
              aria-label="Pinned Services"
            >
              <span className="material-symbols-outlined text-[22px]">star</span>
              {pinnedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ac3500] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pinnedCount}
                </span>
              )}
            </button>
          )}

          {/* Commuter icon */}
          <div
            className="w-9 h-9 rounded-full bg-[#500054] text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#6c1d6e] transition-colors"
            title="SBS Commuter Profile"
          >
            <span className="material-symbols-outlined text-[19px]">person</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#500054] hover:bg-[#e7eeff] rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 space-y-2 shadow-lg animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              onSelectTab('nextbus-arrival');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] font-bold ${
              activeTab === 'nextbus-arrival' ? 'bg-[#6c1d6e] text-white' : 'text-[#111c2d] hover:bg-[#F1F5F9]'
            }`}
          >
            NextBus Arrival
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('bus-routes-and-timetables');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] font-bold ${
              activeTab === 'bus-routes-and-timetables' ? 'bg-[#6c1d6e] text-white' : 'text-[#111c2d] hover:bg-[#F1F5F9]'
            }`}
          >
            Bus Routes & Timetables
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('mrt-lrt-interchange-network');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] font-bold ${
              activeTab === 'mrt-lrt-interchange-network' ? 'bg-[#6c1d6e] text-white' : 'text-[#111c2d] hover:bg-[#F1F5F9]'
            }`}
          >
            MRT/LRT Interchange Network
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('service-alerts-and-advisories');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] font-bold flex items-center justify-between ${
              activeTab === 'service-alerts-and-advisories' ? 'bg-[#6c1d6e] text-white' : 'text-[#111c2d] hover:bg-[#F1F5F9]'
            }`}
          >
            <span>Service Alerts & Advisories</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ac3500] text-white">4</span>
          </button>
        </div>
      )}
    </header>
  );
};
