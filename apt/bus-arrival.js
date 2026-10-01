/**
 * LTA DataMall v3 Bus Arrival API Proxy & Formatter
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
 * Supports:
 * - BusStopCode: required query param (e.g. 83139, 04168)
 * - ServiceNo: optional query param (e.g. 15, 147)
 * Reads AccountKey from process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  // Extract query parameters (supporting both Node/Express req.query and URL searchParams)
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || req.query.stopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  } else if (req.url) {
    const parsedUrl = new URL(req.url, 'http://localhost');
    busStopCode = parsedUrl.searchParams.get('BusStopCode') || parsedUrl.searchParams.get('busStopCode') || '';
    serviceNo = parsedUrl.searchParams.get('ServiceNo') || parsedUrl.searchParams.get('serviceNo') || '';
  }

  // Set default to 04168 or 83139 if not provided
  if (!busStopCode) {
    busStopCode = '04168';
  }

  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY || process.env.VITE_LTA_ACCOUNT_KEY || '';

  // Setup CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // If LTA_ACCOUNT_KEY is available, fetch live from LTA DataMall v3
  if (ltaAccountKey && ltaAccountKey.trim().length > 0) {
    try {
      let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo && serviceNo.trim().length > 0) {
        ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(ltaUrl, {
        headers: {
          AccountKey: ltaAccountKey.trim(),
          accept: 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawData = await response.json();
        // Return raw LTA response enriched with parsed metadata
        return res.status(200).json({
          ...rawData,
          _meta: {
            source: 'LTA DataMall v3 (Live API)',
            requestedStop: busStopCode,
            requestedService: serviceNo || 'ALL',
            refreshedAt: new Date().toISOString(),
            status: 'success'
          }
        });
      } else {
        const errorText = await response.text().catch(() => '');
        console.warn(`LTA DataMall API responded with status ${response.status}:`, errorText);
        // Fall back gracefully with simulated data and warning notice
        const fallbackData = generateFallbackArrivalData(busStopCode, serviceNo);
        return res.status(200).json({
          ...fallbackData,
          _meta: {
            source: 'Simulated (LTA DataMall error)',
            warning: `LTA API responded with HTTP ${response.status}. Returned graceful fallback.`,
            requestedStop: busStopCode,
            refreshedAt: new Date().toISOString()
          }
        });
      }
    } catch (err) {
      console.error('Error fetching from LTA DataMall:', err);
      const fallbackData = generateFallbackArrivalData(busStopCode, serviceNo);
      return res.status(200).json({
        ...fallbackData,
        _meta: {
          source: 'Simulated (Network timeout/error)',
          warning: err.message,
          requestedStop: busStopCode,
          refreshedAt: new Date().toISOString()
        }
      });
    }
  }

  // When LTA_ACCOUNT_KEY is not yet configured in environment variables
  const simulatedData = generateFallbackArrivalData(busStopCode, serviceNo);
  return res.status(200).json({
    ...simulatedData,
    _meta: {
      source: 'Simulated Telematics (LTA_ACCOUNT_KEY unconfigured)',
      message: 'Add LTA_ACCOUNT_KEY in Vercel or environment variables to receive live LTA DataMall telematics.',
      requestedStop: busStopCode,
      requestedService: serviceNo || 'ALL',
      refreshedAt: new Date().toISOString()
    }
  });
}

/**
 * Generates structured fallback data complying 100% with LTA DataMall v3 schema
 */
function generateFallbackArrivalData(busStopCode, serviceNo) {
  const now = Date.now();
  const formatIso = (offsetMinutes) => {
    return new Date(now + offsetMinutes * 60 * 1000).toISOString();
  };

  const allMockServices = [
    {
      ServiceNo: '147',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '17009',
        DestinationCode: '64009',
        EstimatedArrival: formatIso(0),
        Monitored: 1,
        Latitude: '1.29340',
        Longitude: '103.85210',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '17009',
        DestinationCode: '64009',
        EstimatedArrival: formatIso(8),
        Monitored: 1,
        Latitude: '1.28540',
        Longitude: '103.84410',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus3: {
        OriginCode: '17009',
        DestinationCode: '64009',
        EstimatedArrival: formatIso(19),
        Monitored: 1,
        Latitude: '1.27800',
        Longitude: '103.83200',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD'
      }
    },
    {
      ServiceNo: '124',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '14009',
        DestinationCode: '52499',
        EstimatedArrival: formatIso(1),
        Monitored: 1,
        Latitude: '1.29120',
        Longitude: '103.85100',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus2: {
        OriginCode: '14009',
        DestinationCode: '52499',
        EstimatedArrival: formatIso(11),
        Monitored: 1,
        Latitude: '1.27900',
        Longitude: '103.84200',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus3: {
        OriginCode: '14009',
        DestinationCode: '52499',
        EstimatedArrival: formatIso(23),
        Monitored: 1,
        Latitude: '1.26800',
        Longitude: '103.82900',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '166',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '17009',
        DestinationCode: '54009',
        EstimatedArrival: formatIso(4),
        Monitored: 1,
        Latitude: '1.29500',
        Longitude: '103.85000',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '17009',
        DestinationCode: '54009',
        EstimatedArrival: formatIso(14),
        Monitored: 1,
        Latitude: '1.28800',
        Longitude: '103.84100',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '17009',
        DestinationCode: '54009',
        EstimatedArrival: formatIso(28),
        Monitored: 1,
        Latitude: '1.27200',
        Longitude: '103.81900',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      }
    },
    {
      ServiceNo: '174',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10049',
        DestinationCode: '22009',
        EstimatedArrival: formatIso(6),
        Monitored: 1,
        Latitude: '1.29600',
        Longitude: '103.84900',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus2: {
        OriginCode: '10049',
        DestinationCode: '22009',
        EstimatedArrival: formatIso(17),
        Monitored: 1,
        Latitude: '1.29100',
        Longitude: '103.84100',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '10049',
        DestinationCode: '22009',
        EstimatedArrival: formatIso(29),
        Monitored: 1,
        Latitude: '1.28500',
        Longitude: '103.83200',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '10049',
        DestinationCode: '44009',
        EstimatedArrival: formatIso(0),
        Monitored: 1,
        Latitude: '1.29340',
        Longitude: '103.85210',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '10049',
        DestinationCode: '44009',
        EstimatedArrival: formatIso(9),
        Monitored: 1,
        Latitude: '1.28900',
        Longitude: '103.84500',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '10049',
        DestinationCode: '44009',
        EstimatedArrival: formatIso(18),
        Monitored: 1,
        Latitude: '1.28200',
        Longitude: '103.83800',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD'
      }
    },
    {
      ServiceNo: '851',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '59009',
        EstimatedArrival: formatIso(7),
        Monitored: 1,
        Latitude: '1.29700',
        Longitude: '103.85300',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '59009',
        EstimatedArrival: formatIso(19),
        Monitored: 1,
        Latitude: '1.29100',
        Longitude: '103.84700',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '59009',
        EstimatedArrival: formatIso(31),
        Monitored: 1,
        Latitude: '1.28500',
        Longitude: '103.83900',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '61',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '82009',
        DestinationCode: '43009',
        EstimatedArrival: formatIso(12),
        Monitored: 1,
        Latitude: '1.29200',
        Longitude: '103.85100',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus2: {
        OriginCode: '82009',
        DestinationCode: '43009',
        EstimatedArrival: formatIso(24),
        Monitored: 1,
        Latitude: '1.28500',
        Longitude: '103.84200',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus3: {
        OriginCode: '82009',
        DestinationCode: '43009',
        EstimatedArrival: formatIso(36),
        Monitored: 1,
        Latitude: '1.27900',
        Longitude: '103.83300',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      }
    },
    {
      ServiceNo: '32',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '84009',
        DestinationCode: '11389',
        EstimatedArrival: formatIso(15),
        Monitored: 1,
        Latitude: '1.29400',
        Longitude: '103.85200',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus2: {
        OriginCode: '84009',
        DestinationCode: '11389',
        EstimatedArrival: formatIso(28),
        Monitored: 1,
        Latitude: '1.28900',
        Longitude: '103.84400',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus3: {
        OriginCode: '84009',
        DestinationCode: '11389',
        EstimatedArrival: formatIso(42),
        Monitored: 1,
        Latitude: '1.28100',
        Longitude: '103.83600',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      }
    }
  ];

  let filtered = allMockServices;
  if (serviceNo && serviceNo.trim().length > 0) {
    const matched = allMockServices.filter(
      (s) => s.ServiceNo.toLowerCase() === serviceNo.trim().toLowerCase()
    );
    filtered = matched.length > 0 ? matched : [
      {
        ServiceNo: serviceNo.toUpperCase(),
        Operator: 'SBST',
        NextBus: {
          OriginCode: '04168',
          DestinationCode: '00000',
          EstimatedArrival: formatIso(5),
          Monitored: 1,
          Latitude: '1.29340',
          Longitude: '103.85210',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD'
        },
        NextBus2: {
          OriginCode: '04168',
          DestinationCode: '00000',
          EstimatedArrival: formatIso(15),
          Monitored: 1,
          Latitude: '1.28540',
          Longitude: '103.84410',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'SD'
        },
        NextBus3: {
          OriginCode: '',
          DestinationCode: '',
          EstimatedArrival: '',
          Monitored: 0,
          Latitude: '',
          Longitude: '',
          VisitNumber: '',
          Load: '',
          Feature: '',
          Type: ''
        }
      }
    ];
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    BusStopCode: busStopCode,
    Services: filtered
  };
}
