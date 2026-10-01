/**
 * Health check endpoint for monitoring API and LTA DataMall connectivity.
 * Works both as a Vercel Serverless Function and Express route handler.
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  const ltaKey = process.env.LTA_ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY || '';

  // Basic API Health Details
  const healthData = {
    status: 'healthy',
    service: 'SBS Transit NextBus API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : null,
    environment: process.env.NODE_ENV || 'production',
    ltaAccountKeyConfigured: Boolean(ltaKey && ltaKey.trim().length > 0),
    endpoints: {
      busArrival: '/apt/bus-arrival?BusStopCode=83139',
      busArrivalService: '/apt/bus-arrival?BusStopCode=83139&ServiceNo=15',
      health: '/apt/health'
    },
    ltaDataMall: {
      status: 'pending',
      latencyMs: null,
      message: null
    }
  };

  // Test LTA DataMall API Connectivity if Key is provided
  if (healthData.ltaAccountKeyConfigured) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const ltaResponse = await fetch('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139', {
        headers: {
          AccountKey: ltaKey,
          accept: 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;
      healthData.ltaDataMall.latencyMs = latency;

      if (ltaResponse.ok) {
        healthData.ltaDataMall.status = 'connected';
        healthData.ltaDataMall.statusCode = ltaResponse.status;
        healthData.ltaDataMall.message = 'Successfully connected to LTA DataMall v3 API';
      } else {
        healthData.ltaDataMall.status = 'error';
        healthData.ltaDataMall.statusCode = ltaResponse.status;
        healthData.ltaDataMall.message = `LTA DataMall returned HTTP ${ltaResponse.status} ${ltaResponse.statusText}. Check your LTA_ACCOUNT_KEY.`;
      }
    } catch (err) {
      healthData.ltaDataMall.status = 'unreachable';
      healthData.ltaDataMall.message = err.name === 'AbortError' ? 'LTA request timed out after 5s' : err.message;
    }
  } else {
    healthData.ltaDataMall.status = 'unconfigured';
    healthData.ltaDataMall.message = 'LTA_ACCOUNT_KEY environment variable is not configured yet. Using graceful simulated telematics.';
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  const statusCode = healthData.ltaDataMall.status === 'unreachable' ? 503 : 200;
  return res.status(statusCode).json(healthData);
}
