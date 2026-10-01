import React from 'react';

interface AlertTickerProps {
  onOpenAdvisories: () => void;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({ onOpenAdvisories }) => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) {
    return (
      <div className="w-full bg-[#ffdbd0]/50 text-[#390c00] px-4 md:px-10 py-1.5 text-[12px] flex items-center justify-between border-b border-[#ffdbd0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <span className="opacity-80">1 active transit alert for Service 16/16M</span>
          <button
            onClick={() => setDismissed(false)}
            className="text-[#ac3500] font-bold hover:underline cursor-pointer"
          >
            Show Alert Banner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#ffdbd0] text-[#390c00] px-4 md:px-10 py-2.5 shadow-sm transition-all border-b border-[#ffb59d]/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-white bg-[#ac3500] text-[11px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
            Live Alert
          </span>
          <p className="text-[13px] text-[#390c00] truncate font-medium">
            <strong>Service 16/16M:</strong> Diversion active along Joo Chiat Road for Car-Free Sunday. SBS Transit trials predictive AI algorithms for real-time fleet sync.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAdvisories}
            className="text-[12px] font-bold text-[#ac3500] hover:underline whitespace-nowrap cursor-pointer flex items-center gap-1"
          >
            <span>View Advisories (4)</span>
            <span>→</span>
          </button>
          <button
            aria-label="Dismiss Alert"
            className="text-[#390c00] hover:opacity-70 p-1 flex items-center rounded cursor-pointer"
            onClick={() => setDismissed(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
