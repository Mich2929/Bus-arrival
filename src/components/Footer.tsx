import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'nextbus-arrival' | 'bus-routes-and-timetables' | 'mrt-lrt-interchange-network' | 'service-alerts-and-advisories') => void;
  onOpenAccessibilityGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAccessibilityGuide }) => {
  return (
    <footer className="w-full bg-[#f0f3ff] mt-12 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-t border-[#d8e3fb]">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#d8e3fb]">
          {/* Brand Info & Hotline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#500054] flex items-center justify-center text-white font-extrabold text-[15px]">
                S
              </div>
              <span className="text-[18px] font-extrabold text-[#500054] tracking-tight">
                SBS Transit
              </span>
            </div>
            <p className="text-[12px] text-[#50434d] leading-relaxed">
              ComfortDelGro Group Member. Singapore&apos;s leading public bus and rail operator committed to delivering safe, reliable, and comfortable passenger transit journeys.
            </p>
            <div className="pt-2">
              <div className="text-[11px] text-[#50434d] uppercase tracking-wider font-bold">
                Customer Relations Hotline
              </div>
              <a
                className="text-[18px] text-[#ac3500] font-extrabold hover:underline block"
                href="tel:18002872727"
              >
                1800-287-2727
              </a>
              <div className="text-[12px] text-[#50434d]">Daily: 7:30am – 8:00pm SGT</div>
            </div>
          </div>

          {/* Transit Services */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111c2d] uppercase tracking-wider">
              Transit Services
            </h4>
            <ul className="space-y-2 text-[13px] text-[#50434d]">
              <li>
                <button
                  onClick={() => onSelectTab('nextbus-arrival')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  NextBus Real-Time Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('bus-routes-and-timetables')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Trunk &amp; Feeder Bus Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mrt-lrt-interchange-network')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Downtown Line (DTL) Timetable
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mrt-lrt-interchange-network')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  North East Line (NEL) &amp; LRT
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccessibilityGuide}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Wheelchair Accessible Buses (WAB)
                </button>
              </li>
            </ul>
          </div>

          {/* Commuter Info */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111c2d] uppercase tracking-wider">
              Commuter Info
            </h4>
            <ul className="space-y-2 text-[13px] text-[#50434d]">
              <li>
                <button
                  onClick={onOpenAccessibilityGuide}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Conditions of Carriage
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccessibilityGuide}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Fare Table &amp; SimplyGo Concession
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('service-alerts-and-advisories')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Lost &amp; Found Depots
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mrt-lrt-interchange-network')}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Bus Interchange Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAccessibilityGuide}
                  className="hover:text-[#500054] transition-colors cursor-pointer text-left"
                >
                  Passenger Security &amp; Safety Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* LTA Data & Regulatory */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111c2d] uppercase tracking-wider">
              LTA Data &amp; Regulatory
            </h4>
            <p className="text-[12px] text-[#50434d] leading-relaxed">
              Transit timetable data powered by Land Transport Authority (LTA) DataMall API under the Singapore Open Data License. Arrival timings are dynamically estimated based on live vehicle automatic tracking.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-[#d8e3fb] px-2.5 py-1 rounded text-[#111c2d] text-[11px] font-bold">
                LTA DataMall 2.0
              </span>
              <span className="bg-[#d8e3fb] px-2.5 py-1 rounded text-[#111c2d] text-[11px] font-bold">
                SimplyGo Ready
              </span>
              <span className="bg-[#d8e3fb] px-2.5 py-1 rounded text-[#111c2d] text-[11px] font-bold">
                ISO 9001 Transit
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#50434d] gap-4">
          <p>© 2026 SBS Transit Ltd. Co. Reg. No.: 199206653M. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenAccessibilityGuide}
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenAccessibilityGuide}
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              onClick={() => onSelectTab('bus-routes-and-timetables')}
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Site Map
            </button>
            <button
              onClick={onOpenAccessibilityGuide}
              className="hover:text-[#111c2d] transition-colors cursor-pointer"
            >
              Accessibility Feedback
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
