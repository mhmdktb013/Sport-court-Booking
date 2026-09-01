import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect Database
connectDB();

const app = express();

// CORS Configuration for Production & Development
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, server-to-server, Render health checks)
    if (!origin) return callback(null, true);

    // In development or when wildcard is set, allow all
    if (process.env.NODE_ENV !== 'production' || configuredOrigins.includes('*') || configuredOrigins.length === 0) {
      return callback(null, true);
    }

    // Check against configured production frontend origins
    const isAllowed =
      configuredOrigins.includes(origin) ||
      configuredOrigins.some((allowed) => allowed === origin) ||
      (origin.endsWith('.vercel.app') && configuredOrigins.some((o) => o.includes('.vercel.app')));

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-venue-slug', 'x-venue-id'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'SportsZone Booking Platform API',
    status: 'running',
    health: '/api/health',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SportsZone Booking Platform API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`🚀 SportsZone Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
