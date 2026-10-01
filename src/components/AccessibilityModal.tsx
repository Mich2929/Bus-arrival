import React from 'react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#500054] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#89f5e7] text-[#00201d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">accessible_forward</span>
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold">Commuter Accessibility &amp; Conditions of Carriage</h3>
              <p className="text-[12px] text-[#ffd6f8]">
                100% Wheelchair Accessible Bus Fleet &amp; Commuter Support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#111c2d] text-[13px] leading-relaxed">
          {/* Section 1: WAB Commitment */}
          <div className="bg-[#f0f3ff] p-4 rounded-xl border border-[#d8e3fb] space-y-2">
            <h4 className="text-[15px] font-extrabold text-[#500054] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>100% Wheelchair Accessible Bus Fleet</span>
            </h4>
            <p className="text-[#50434d]">
              Every SBS Transit scheduled bus deployed on public trunk, feeder, and express routes is equipped with a manual boarding ramp, low-floor pneumatic kneeling capability, and designated wheelchair passenger spaces with safety lap belts and driver notification bells.
            </p>
          </div>

          {/* Section 2: Boarding & Alighting Protocol */}
          <div className="space-y-3">
            <h4 className="text-[15px] font-extrabold text-[#111c2d]">
              Boarding &amp; Ramp Deployment Protocol
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-[#50434d]">
              <li>
                <strong>At the Bus Stop:</strong> Flag the approaching bus clearly or wait near the priority boarding line. Bus captains are trained to kneel the vehicle and deploy the ramp manually.
              </li>
              <li>
                <strong>Permitted Mobility Aids:</strong> Manual wheelchairs, motorized wheelchairs, and mobility scooters with maximum width of 700mm, length of 1,200mm, and total laden weight within 300kg.
              </li>
              <li>
                <strong>Safety Belt:</strong> For the safety of the commuter, the safety harness must be securely fastened during transit before the vehicle departs the berth.
              </li>
            </ul>
          </div>

          {/* Section 3: Open Strollers & Priority Seats */}
          <div className="space-y-3">
            <h4 className="text-[15px] font-extrabold text-[#111c2d]">
              Open Strollers &amp; Priority Seating Policy
            </h4>
            <p className="text-[#50434d]">
              Open strollers are permitted on all wheelchair accessible public buses. If a wheelchair passenger requires the bay, open strollers should be folded or relocated to allow priority access. Priority seats near the front and entrance doors are reserved for elderly commuters, expectant mothers, and passengers with reduced mobility.
            </p>
          </div>

          {/* Section 4: SimplyGo & Fare Concessions */}
          <div className="bg-[#dee8ff]/50 p-4 rounded-xl border border-[#d8e3fb] space-y-2">
            <h4 className="text-[14px] font-extrabold text-[#500054]">
              SimplyGo Concession Cards
            </h4>
            <p className="text-[#50434d]">
              Persons with Disabilities (PwD) and Senior Citizens enjoy heavily subsidised transit fares with a distance-based fare cap ($0.65 – $0.99) on all standard bus and train rides across Singapore. Contact SimplyGo at 1800-2255-663 for card replacement or fare dispute queries.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex justify-between items-center">
          <span className="text-[12px] text-[#50434d]">SBS Transit Passenger Services Guidelines 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#500054] text-white text-[13px] font-bold rounded-lg hover:bg-[#6c1d6e] transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
