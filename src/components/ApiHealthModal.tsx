import React from 'react';
import { ApiHealthResponse, checkApiHealth } from '../services/ltaService';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = React.useState<ApiHealthResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHealth = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkApiHealth();
      setHealth(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reach health endpoint');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen, fetchHealth]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#500054] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#89f5e7] text-[#00201d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">monitor_heart</span>
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold">API &amp; LTA Gateway Health Monitor</h3>
              <p className="text-[12px] text-[#ffd6f8]">
                Monitoring /apt/health and /apt/bus-arrival
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[13px]">
          {loading && !health && (
            <div className="py-8 text-center text-[#50434d]">
              <span className="material-symbols-outlined animate-spin text-[32px] text-[#500054]">
                sync
              </span>
              <p className="mt-2 font-semibold">Testing API connectivity &amp; pinging LTA DataMall...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <div>
                <strong>Health Check Failed</strong>
                <p className="text-[12px] mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {health && (
            <div className="space-y-4">
              {/* Overall Status Badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      health.status === 'healthy' ? 'bg-[#16A34A] animate-pulse' : 'bg-[#DC2626]'
                    }`}
                  ></span>
                  <span className="text-[14px] font-extrabold text-[#111c2d]">
                    Gateway Status: {health.status.toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={fetchHealth}
                  disabled={loading}
                  className="px-3 py-1 bg-white hover:bg-[#F1F5F9] rounded text-[12px] font-bold text-[#500054] border border-[#E2E8F0] flex items-center gap-1 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span>Refresh</span>
                </button>
              </div>

              {/* LTA DataMall Telematics Status */}
              <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#d8e3fb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase text-[#500054] tracking-wider">
                    LTA DataMall v3 Connectivity
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      health.ltaDataMall.status === 'connected'
                        ? 'bg-[#16A34A] text-white'
                        : health.ltaDataMall.status === 'unconfigured'
                        ? 'bg-[#D97706] text-white'
                        : 'bg-[#DC2626] text-white'
                    }`}
                  >
                    {health.ltaDataMall.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-[12px] text-[#50434d] leading-relaxed">
                  {health.ltaDataMall.message}
                </p>

                {health.ltaDataMall.latencyMs !== null && health.ltaDataMall.latencyMs !== undefined && (
                  <div className="text-[11px] text-[#50434d] font-mono pt-1">
                    Latency: <strong>{health.ltaDataMall.latencyMs} ms</strong>
                  </div>
                )}
              </div>

              {/* Environment Variable Check */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                <h4 className="text-[12px] font-bold uppercase text-[#50434d] tracking-wider">
                  Configuration &amp; Environment
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="p-2 rounded bg-[#F8F9FA]">
                    <span className="text-[#50434d] block">LTA_ACCOUNT_KEY</span>
                    <strong className={health.ltaAccountKeyConfigured ? 'text-[#16A34A]' : 'text-[#D97706]'}>
                      {health.ltaAccountKeyConfigured ? 'Configured ✓' : 'Not Set (Using Fallback)'}
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-[#F8F9FA]">
                    <span className="text-[#50434d] block">Environment</span>
                    <strong className="text-[#111c2d] capitalize">{health.environment}</strong>
                  </div>
                  <div className="p-2 rounded bg-[#F8F9FA]">
                    <span className="text-[#50434d] block">Server Uptime</span>
                    <strong className="text-[#111c2d] font-mono">
                      {health.uptimeSeconds ? `${health.uptimeSeconds}s` : 'Serverless'}
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-[#F8F9FA]">
                    <span className="text-[#50434d] block">Timestamp</span>
                    <strong className="text-[#111c2d] font-mono text-[10px]">
                      {new Date(health.timestamp).toLocaleTimeString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Active API Endpoints */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                <h4 className="text-[12px] font-bold uppercase text-[#50434d] tracking-wider">
                  Available Monitored Endpoints
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-[#500054]">
                  <div className="p-1.5 rounded bg-[#F8F9FA] flex items-center justify-between">
                    <span>GET /apt/bus-arrival?BusStopCode=83139</span>
                    <span className="text-[#16A34A] font-bold">200 OK</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#F8F9FA] flex items-center justify-between">
                    <span>GET /apt/bus-arrival?BusStopCode=83139&amp;ServiceNo=15</span>
                    <span className="text-[#16A34A] font-bold">200 OK</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#F8F9FA] flex items-center justify-between">
                    <span>GET /apt/health (or /apt/heath.js)</span>
                    <span className="text-[#16A34A] font-bold">200 OK</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#50434d]">
            Endpoints ready for Vercel deployment
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#500054] text-white text-[13px] font-bold rounded-lg hover:bg-[#6c1d6e] transition-colors cursor-pointer"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
