import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';

// Security headers middleware
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // X-Frame-Options
  frameguard: { action: 'deny' },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  
  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: false,
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  
  // X-Download-Options
  ieNoOpen: true,
  
  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false // Disabled for API compatibility
});

// Rate limiting middleware
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      status: 429,
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health' || req.path === '/api/health/table';
  },
  keyGenerator: (req: Request) => {
    // Use IP address and User-Agent for more accurate rate limiting
    return `${req.ip}-${req.get('User-Agent')}`;
  }
});

// Strict rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: {
      message: 'Too many authentication attempts, please try again later.',
      status: 429,
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `auth-${req.ip}-${req.get('User-Agent')}`;
  }
});

// Slow down middleware - progressively delay responses
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: process.env.NODE_ENV === 'production' ? 50 : 500, // Allow 50 requests per windowMs without delay in production
  delayMs: () => 500, // Add 500ms delay per request after delayAfter (new v2 behavior)
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  skip: (req: Request) => {
    return req.path === '/api/health' || req.path === '/api/health/table';
  },
  validate: {
    delayMs: false // Disable the warning message
  }
});

// HTTP Parameter Pollution protection
export const parameterPollutionProtection = hpp({
  whitelist: ['tags', 'features'] // Allow arrays for specific parameters
});

// NoSQL injection protection
export const mongoSanitization = mongoSanitize({
  replaceWith: '_', // Replace prohibited characters with underscore
  onSanitize: ({ req, key }: { req: Request; key: string }) => {
    console.warn(`Sanitized potentially malicious data in ${key} from IP: ${req.ip}`);
  }
});

// Input validation and sanitization middleware
export const inputSanitization = (req: Request, res: Response, next: NextFunction) => {
  // Remove potential XSS characters from request body
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Basic XSS prevention
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      const sanitized: any = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
};

// Security response headers middleware
export const securityResponseHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Add custom security headers
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Cache control for API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

// IP whitelist middleware (for sensitive operations)
export const ipWhitelist = (allowedIPs: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    // In development, allow all IPs
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    
    // If no whitelist is provided, allow all
    if (allowedIPs.length === 0) {
      return next();
    }
    
    // Check if IP is whitelisted
    const isAllowed = allowedIPs.some(allowedIP => {
      if (allowedIP.includes('/')) {
        // CIDR notation support (basic)
        return clientIP.startsWith(allowedIP.split('/')[0]);
      }
      return clientIP === allowedIP;
    });
    
    if (!isAllowed) {
      console.warn(`Access denied for IP: ${clientIP}`);
      res.status(403).json({
        error: {
          message: 'Access denied from this IP address',
          status: 403
        }
      });
      return;
    }
    
    next();
  };
};

// Request size limiting middleware
export const requestSizeLimit = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');
    if (contentLength) {
      const sizeInBytes = parseInt(contentLength);
      const maxSizeInBytes = parseSize(maxSize);
      
      if (sizeInBytes > maxSizeInBytes) {
        res.status(413).json({
          error: {
            message: `Request entity too large. Maximum size allowed: ${maxSize}`,
            status: 413
          }
        });
        return;
      }
    }
    next();
  };
};

// Helper function to parse size strings like '10mb', '1gb', etc.
const parseSize = (size: string): number => {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)(b|kb|mb|gb)$/);
  if (!match) return 1024 * 1024; // Default 1MB
  
  const [, num, unit] = match;
  return Math.floor(parseFloat(num) * units[unit]);
};