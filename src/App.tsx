import React from 'react';
import { Header, NavTab } from './components/Header';
import { AlertTicker } from './components/AlertTicker';
import { HeroArrivalBoard } from './components/HeroArrivalBoard';
import { StopArrivalTable } from './components/StopArrivalTable';
import { FleetCorridorMap } from './components/FleetCorridorMap';
import { SearchRail } from './components/SearchRail';
import { TimetableModal } from './components/TimetableModal';
import { ChangeStopModal } from './components/ChangeStopModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ApiHealthModal } from './components/ApiHealthModal';
import { RoutesView } from './components/RoutesView';
import { MrtNetworkView } from './components/MrtNetworkView';
import { AlertsView } from './components/AlertsView';
import { Footer } from './components/Footer';
import { INITIAL_BUS_STOPS, INITIAL_SERVICES, TRANSIT_ALERTS, SERVICE_DETAILS_MAP } from './data/transitData';
import { BusStop, ServiceArrival, ServiceCategory } from './types/transit';
import { fetchLtaBusArrival, parseLtaArrival } from './services/ltaService';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<NavTab>('nextbus-arrival');
  const [textSize, setTextSize] = React.useState<'normal' | 'large' | 'larger'>('normal');

  // Bus stop state
  const [busStops] = React.useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [currentStopCode, setCurrentStopCode] = React.useState<string>('04168');
  const currentStop = busStops.find((s) => s.code === currentStopCode) || {
    code: currentStopCode,
    name: `Bus Stop ${currentStopCode}`,
    road: 'Singapore Transit Network',
    distanceMeters: 120,
    services: [],
    lat: 1.2934,
    lng: 103.8521,
  };

  // Selected Service and Category
  const [services, setServices] = React.useState<ServiceArrival[]>(INITIAL_SERVICES);
  const [selectedServiceNo, setSelectedServiceNo] = React.useState<string>('147');
  const [selectedCategory, setSelectedCategory] = React.useState<ServiceCategory | 'All'>('All');

  // Pinned Services
  const [pinnedServices, setPinnedServices] = React.useState<string[]>(['147']);

  // Modals state
  const [timetableServiceNo, setTimetableServiceNo] = React.useState<string | null>(null);
  const [isChangeStopOpen, setIsChangeStopOpen] = React.useState<boolean>(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = React.useState<boolean>(false);
  const [isHealthOpen, setIsHealthOpen] = React.useState<boolean>(false);

  // LTA Telematics Metadata
  const [ltaMeta, setLtaMeta] = React.useState<{ source?: string; warning?: string }>({
    source: 'LTA DataMall v3 Endpoint (/apt/bus-arrival)',
  });

  // Auto-refresh timer (20-second LTA refresh cadence)
  const [countdown, setCountdown] = React.useState<number>(20);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = React.useState<'idle' | 'locating' | 'located'>('idle');

  // Telematics fetch function from /apt/bus-arrival
  const loadTelematicsData = React.useCallback(async (stopCode: string, targetService?: string) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLtaBusArrival(stopCode, targetService);
      if (data._meta) {
        setLtaMeta({
          source: data._meta.source,
          warning: data._meta.warning || data._meta.message,
        });
      }

      if (data.Services && data.Services.length > 0) {
        const mappedServices: ServiceArrival[] = data.Services.map((raw) => {
          const detail = SERVICE_DETAILS_MAP[raw.ServiceNo];
          return {
            serviceNo: raw.ServiceNo,
            category: detail?.category || 'Trunk',
            destination: detail?.destination || `Terminal via Berth ${raw.NextBus?.DestinationCode || 'Loop'}`,
            via: detail ? detail.stops.slice(1, 4).map((s) => s.name).join(', ') : 'Central, City Hall, Orchard',
            fleetPlate: raw.NextBus?.Type === 'DD' ? 'SBS3829P' : 'SBS6819R',
            fleetModel: raw.NextBus?.Type === 'DD' ? 'Volvo B9TL (Double Decker)' : 'Single Decker WAB',
            nextBus: parseLtaArrival(raw.NextBus),
            secondBus: parseLtaArrival(raw.NextBus2),
            thirdBus: parseLtaArrival(raw.NextBus3),
          };
        });

        setServices(mappedServices);

        // Ensure selected service exists in list or pick first
        if (!mappedServices.some((s) => s.serviceNo === selectedServiceNo)) {
          setSelectedServiceNo(mappedServices[0].serviceNo);
        }
      }
    } catch (err) {
      console.warn('Using local fallback simulation as LTA network call failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedServiceNo]);

  // Load when stop code changes
  React.useEffect(() => {
    loadTelematicsData(currentStopCode);
  }, [currentStopCode, loadTelematicsData]);

  // Live countdown ticker effect (20 seconds)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadTelematicsData(currentStopCode);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStopCode, loadTelematicsData]);

  const handleManualRefresh = () => {
    setCountdown(20);
    loadTelematicsData(currentStopCode, selectedServiceNo);
  };

  const handleTogglePin = (serviceNo: string) => {
    setPinnedServices((prev) =>
      prev.includes(serviceNo) ? prev.filter((s) => s !== serviceNo) : [...prev, serviceNo]
    );
  };

  const handleRecalibrateGps = () => {
    setGpsStatus('locating');
    setTimeout(() => {
      setCurrentStopCode('04168');
      setGpsStatus('located');
      setTimeout(() => setGpsStatus('idle'), 3000);
    }, 900);
  };

  // Find active service object
  const activeService =
    services.find((s) => s.serviceNo === selectedServiceNo) || services[0];

  // Filter services by Category or Pinned if chosen
  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Calculate typography scaling class
  const textSizeClass =
    textSize === 'large'
      ? 'scale-[1.03] origin-top text-[15px]'
      : textSize === 'larger'
      ? 'scale-[1.07] origin-top text-[16px]'
      : 'text-[14px]';

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#111c2d] flex flex-col transition-all ${textSizeClass}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        textSize={textSize}
        onChangeTextSize={setTextSize}
        pinnedCount={pinnedServices.length}
        onOpenPinned={() => {
          setSelectedCategory('All');
          setActiveTab('nextbus-arrival');
        }}
        currentStopName={`${currentStop.name} (${currentStop.code})`}
        onOpenChangeStop={() => setIsChangeStopOpen(true)}
        onOpenHealth={() => setIsHealthOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        {/* Dynamic Service Alert Ticker */}
        <AlertTicker onOpenAdvisories={() => setActiveTab('service-alerts-and-advisories')} />

        {activeTab === 'nextbus-arrival' && (
          <div className="flex flex-col w-full">
            {/* Hero Transit Header & Geolocation Detector */}
            <section className="w-full bg-[#f0f3ff] px-4 md:px-10 pt-8 pb-10 border-b border-[#d8e3fb]">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#500054] text-[12px] font-bold uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                      <span>Commuter Dispatch Central</span>
                    </div>
                    <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#500054] tracking-tight">
                      NextBus Live Arrival Timings
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-[#50434d] mt-1 max-w-3xl">
                      Live Land Transport Authority (LTA) telematics feed for SBS Transit commuters across Singapore stops.
                    </p>
                  </div>

                  {/* Fleet Pulse live counter badge & API Gateway Monitor */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsHealthOpen(true)}
                      className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-[#d8e3fb] hover:border-[#500054] transition-colors flex items-center gap-2.5 cursor-pointer text-left"
                      title="Click to check API Gateway & LTA DataMall Endpoint Health"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#500054]">
                        hub
                      </span>
                      <div>
                        <span className="block text-[10px] font-bold text-[#50434d] uppercase tracking-wider">
                          LTA Endpoint
                        </span>
                        <span className="text-[12px] font-extrabold text-[#500054] truncate max-w-[130px] block font-mono">
                          /apt/bus-arrival
                        </span>
                      </div>
                    </button>

                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-xs border border-[#d8e3fb] flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping"></div>
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-[#50434d] uppercase tracking-wider">
                          Fleet Pulse
                        </span>
                        <span className="text-[13px] font-extrabold text-[#111c2d] font-mono">
                          3,248 Buses Synced
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nearest Stop GPS Banner */}
                <div className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-[#d8e3fb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-[#6c1d6e] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">my_location</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#89f5e7] text-[#00201d]">
                          Auto-Detected GPS
                        </span>
                        <span className="text-[12px] font-bold text-[#ac3500] font-mono">
                          Stop Code {currentStop.code}
                        </span>
                        <span className="text-[12px] text-[#50434d]">
                          • {currentStop.distanceMeters}m away from your location
                        </span>
                      </div>
                      <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#111c2d] mt-0.5">
                        {currentStop.name} — {currentStop.road}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleRecalibrateGps}
                      disabled={gpsStatus === 'locating'}
                      className="px-3.5 py-2 rounded-lg bg-[#F1F5F9] hover:bg-[#e7eeff] text-[#111c2d] text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#E2E8F0] disabled:opacity-50"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          gpsStatus === 'locating' ? 'animate-spin text-[#500054]' : ''
                        }`}
                      >
                        {gpsStatus === 'located' ? 'check_circle' : 'refresh'}
                      </span>
                      <span>
                        {gpsStatus === 'locating'
                          ? 'Locating...'
                          : gpsStatus === 'located'
                          ? 'Located (04168)'
                          : 'Recalibrate GPS'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsChangeStopOpen(true)}
                      className="px-3.5 py-2 rounded-lg bg-[#6c1d6e] text-white text-[13px] font-bold flex items-center gap-1.5 hover:bg-[#500054] transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_location_alt</span>
                      <span>Change Stop</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Functional Workspace Bento */}
            <section className="max-w-7xl mx-auto w-full px-4 md:px-10 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Rail (Search, Filter Modes, Nearby Stops) */}
                <div className="lg:col-span-4">
                  <SearchRail
                    busStops={busStops}
                    currentStopCode={currentStopCode}
                    onSelectStopCode={(code) => setCurrentStopCode(code)}
                    selectedServiceNo={selectedServiceNo}
                    onSelectServiceNo={(svc) => setSelectedServiceNo(svc)}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    onOpenAccessibilityGuide={() => setIsAccessibilityOpen(true)}
                  />
                </div>

                {/* Right Main Deck (Hero Arrival Board & Table & Corridor Map) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Hero Arrival Board for selected service */}
                  <HeroArrivalBoard
                    service={activeService}
                    refreshSeconds={countdown}
                    onManualRefresh={handleManualRefresh}
                    isRefreshing={isRefreshing}
                    isPinned={pinnedServices.includes(activeService.serviceNo)}
                    onTogglePin={handleTogglePin}
                    onOpenTimetable={(svc) => setTimetableServiceNo(svc)}
                    currentStopCode={currentStop.code}
                    currentStopName={currentStop.name}
                  />

                  {/* Co-Located Services Board at this Berth */}
                  <StopArrivalTable
                    services={filteredServices}
                    stopCode={currentStop.code}
                    selectedServiceNo={selectedServiceNo}
                    onSelectService={(svcNo) => setSelectedServiceNo(svcNo)}
                    pinnedServices={pinnedServices}
                    onTogglePin={handleTogglePin}
                  />

                  {/* Live Corridor Fleet Map & Stoppage Layout */}
                  <FleetCorridorMap
                    currentStopCode={currentStop.code}
                    currentStopName={currentStop.name}
                    selectedServiceNo={selectedServiceNo}
                  />
                </div>
              </div>
            </section>

            {/* SBS Transit Commuter Quick Links and Advisory Strip */}
            <section className="w-full bg-[#f0f3ff] px-4 md:px-10 py-10 mt-6 border-t border-[#d8e3fb]">
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-extrabold text-[#111c2d]">
                      Transit Alerts &amp; Passenger Guidelines
                    </h3>
                    <p className="text-[13px] text-[#50434d]">
                      Stay updated with real-time route alterations, road diversions, and system upgrades.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('service-alerts-and-advisories')}
                    className="text-[13px] font-bold text-[#ac3500] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All Announcements</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TRANSIT_ALERTS.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-xl bg-white shadow-xs border border-[#d8e3fb] space-y-2.5 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-[#ac3500] uppercase tracking-wider block">
                          {item.date}
                        </span>
                        <h4 className="text-[15px] font-extrabold text-[#111c2d] leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-[#50434d] line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('service-alerts-and-advisories')}
                        className="text-[12px] text-[#500054] font-bold hover:underline cursor-pointer flex items-center gap-1 pt-1"
                      >
                        <span>Read Advisory</span>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Bus Routes & Timetables Screen */}
        {activeTab === 'bus-routes-and-timetables' && (
          <RoutesView
            onOpenTimetable={(svc) => setTimetableServiceNo(svc)}
            onSelectServiceForLive={(svc) => {
              setSelectedServiceNo(svc);
              setActiveTab('nextbus-arrival');
            }}
          />
        )}

        {/* MRT/LRT Interchange Network Screen */}
        {activeTab === 'mrt-lrt-interchange-network' && <MrtNetworkView />}

        {/* Service Alerts & Advisories Screen */}
        {activeTab === 'service-alerts-and-advisories' && <AlertsView />}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenAccessibilityGuide={() => setIsAccessibilityOpen(true)}
      />

      {/* Timetable & Fares Modal */}
      <TimetableModal
        serviceNo={timetableServiceNo}
        onClose={() => setTimetableServiceNo(null)}
      />

      {/* Change Bus Stop Modal */}
      <ChangeStopModal
        isOpen={isChangeStopOpen}
        onClose={() => setIsChangeStopOpen(false)}
        busStops={busStops}
        currentStopCode={currentStopCode}
        onSelectStop={(code) => setCurrentStopCode(code)}
        onRecalibrateGps={handleRecalibrateGps}
      />

      {/* Accessibility & Concession Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* API Gateway & LTA DataMall Health Modal */}
      <ApiHealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
      />
    </div>
  );
}
