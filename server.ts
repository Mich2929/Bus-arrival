import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import busArrivalHandler from './apt/bus-arrival.js';
// @ts-ignore
import healthHandler from './apt/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount APT & API routes for both /apt and /api paths
const handleBusArrival = (req: express.Request, res: express.Response) => {
  return busArrivalHandler(req, res);
};

const handleHealth = (req: express.Request, res: express.Response) => {
  return healthHandler(req, res);
};

// Route mappings
app.all('/apt/bus-arrival', handleBusArrival);
app.all('/apt/bus-arrival.js', handleBusArrival);
app.all('/api/bus-arrival', handleBusArrival);
app.all('/api/bus-arrival.js', handleBusArrival);

app.all('/apt/health', handleHealth);
app.all('/apt/health.js', handleHealth);
app.all('/apt/heath.js', handleHealth); // alias requested by user
app.all('/api/health', handleHealth);
app.all('/api/health.js', handleHealth);
app.all('/api/heath.js', handleHealth);

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`- Health Check: http://0.0.0.0:${PORT}/apt/health`);
    console.log(`- Bus Arrival: http://0.0.0.0:${PORT}/apt/bus-arrival?BusStopCode=83139`);
  });
}

startServer();
