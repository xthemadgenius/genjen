import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

// Import enhanced middleware
import { 
  errorHandler, 
  notFoundHandler, 
  globalExceptionHandler 
} from './middleware/errorHandler';

import {
  securityHeaders,
  rateLimiter,
  authRateLimiter,
  speedLimiter,
  parameterPollutionProtection,
  mongoSanitization,
  inputSanitization,
  securityResponseHeaders,
  requestSizeLimit
} from './middleware/security';

import {
  requestLogger,
  securityLogger,
  errorLogger,
  apiAccessLogger,
  performanceLogger
} from './middleware/logging';

import {
  validateContentType,
  sanitizeInput
} from './middleware/validation';

// Database and routes
import { initSupabase } from './utils/supabaseClient';
import { initPostgres } from './utils/postgresClient';
import healthRoutes from './routes/healthRoutes';
import userRoutes from './routes/userRoutes';
import membershipRoutes from './routes/membershipRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize global exception handlers
globalExceptionHandler();

// Initialize databases
initSupabase();
initPostgres();

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// ======================
// SECURITY MIDDLEWARE (Order matters!)
// ======================

// 1. Security headers (should be first)
app.use(securityHeaders);

// 2. Request logging and monitoring
app.use(requestLogger);
app.use(securityLogger);
app.use(performanceLogger);
app.use(apiAccessLogger);

// 3. Rate limiting and DDoS protection
app.use(rateLimiter);
app.use(speedLimiter);

// 4. Request parsing and size limits
app.use(compression()); // Enable gzip compression
app.use(requestSizeLimit('10mb')); // Limit request size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Input validation and sanitization
app.use(validateContentType(['application/json', 'application/x-www-form-urlencoded']));
app.use(parameterPollutionProtection);
app.use(mongoSanitization);
app.use(inputSanitization);
app.use(sanitizeInput);

// 6. CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization',
    'X-API-Key',
    'X-Request-ID'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  maxAge: 86400 // 24 hours
}));

// 7. Custom security headers
app.use(securityResponseHeaders);

// ======================
// ROUTES
// ======================

// Apply auth rate limiter to authentication endpoints
app.use('/api/users/register', authRateLimiter);
app.use('/api/users/:id/generate-wallet', authRateLimiter);

// Mount routes
app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);

// Handle favicon requests (prevent 404 spam in logs)
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No Content
});

// ======================
// ERROR HANDLING
// ======================

// 404 handler (must be after all routes)
app.use('*', notFoundHandler);

// Error logging middleware
app.use(errorLogger);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🛡️  Security: Enhanced middleware enabled`);
  console.log(`📊 Health check (JSON) at http://localhost:${PORT}/api/health`);
  console.log(`🏥 Health dashboard (HTML) at http://localhost:${PORT}/api/health/table`);
  console.log(`👥 Users API (email-first registration) at http://localhost:${PORT}/api/users`);
  console.log(`📧 Register user at http://localhost:${PORT}/api/users/register`);
  console.log(`🔗 Generate wallet at http://localhost:${PORT}/api/users/:id/generate-wallet`);
  console.log(`🎯 Memberships API available at http://localhost:${PORT}/api/memberships`);
  console.log(`⛓️  Base blockchain (Chain ID: 8453)`);
  console.log(`🔄 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`⚡ Rate limiting: ${process.env.NODE_ENV === 'production' ? '100' : '1000'} req/15min`);
  console.log(`🔒 Security headers: Enabled`);
  console.log(`📝 Request logging: ${process.env.NODE_ENV === 'production' ? 'JSON' : 'Colored'}`);
  console.log(`\n🎨 View the health dashboard: http://localhost:${PORT}/api/health/table`);
});