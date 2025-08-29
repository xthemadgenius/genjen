import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

// Enhanced error handler with security considerations
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Don't process if response was already sent
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Security: Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    // Generic error messages for production
    if (statusCode === 500) {
      message = 'Something went wrong on our end';
    } else if (statusCode === 404) {
      message = 'Resource not found';
    } else if (statusCode === 403) {
      message = 'Access forbidden';
    } else if (statusCode === 401) {
      message = 'Authentication required';
    }
  }

  // Enhanced error logging with request context
  const errorContext = {
    timestamp: new Date().toISOString(),
    error: {
      message: err.message,
      statusCode,
      code: err.code,
      stack: err.stack,
      isOperational: err.isOperational || false,
    },
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer'),
      contentType: req.get('Content-Type'),
      // Only log body in development and for non-sensitive errors
      ...(process.env.NODE_ENV === 'development' && statusCode !== 401 && {
        body: JSON.stringify(req.body).substring(0, 1000), // Limit body size in logs
        query: req.query,
        params: req.params,
      }),
    },
    response: {
      statusCode,
    },
  };

  // Color-coded console logging
  if (statusCode >= 500) {
    console.error(`\x1b[31m❌ SERVER ERROR [${statusCode}]:\x1b[0m`, JSON.stringify(errorContext, null, 2));
  } else if (statusCode >= 400) {
    console.warn(`\x1b[33m⚠️  CLIENT ERROR [${statusCode}]:\x1b[0m`, JSON.stringify(errorContext, null, 2));
  } else {
    console.log(`\x1b[36mℹ️  INFO [${statusCode}]:\x1b[0m`, JSON.stringify(errorContext, null, 2));
  }

  // Security headers for error responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Structured error response
  const errorResponse: any = {
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      ...(err.code && { code: err.code }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details,
      }),
    }
  };

  // Add request ID for tracking (if available)
  if (req.headers['x-request-id']) {
    errorResponse.error.requestId = req.headers['x-request-id'];
  }

  res.status(statusCode).json(errorResponse);
};

// Enhanced async handler with better error context
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Add request context to the error
      error.requestMethod = req.method;
      error.requestUrl = req.originalUrl || req.url;
      error.requestIp = req.ip;
      
      next(error);
    });
  };
};

// Not found handler (404)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as CustomError;
  error.statusCode = 404;
  error.isOperational = true;
  
  // Log 404 attempts for security monitoring (skip common browser requests)
  const commonBrowserRequests = ['/favicon.ico', '/robots.txt', '/sitemap.xml', '/apple-touch-icon.png'];
  if (!commonBrowserRequests.includes(req.originalUrl)) {
    console.warn(`\x1b[33m🔍 404 NOT FOUND:\x1b[0m ${req.method} ${req.originalUrl} from ${req.ip}`);
  }
  
  next(error);
};

// Global exception handler for uncaught exceptions
export const globalExceptionHandler = () => {
  process.on('uncaughtException', (error: Error) => {
    console.error('\x1b[31m💀 UNCAUGHT EXCEPTION:\x1b[0m', {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
    
    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      console.error('Process will exit due to uncaught exception');
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('\x1b[31m💀 UNHANDLED REJECTION:\x1b[0m', {
      timestamp: new Date().toISOString(),
      reason: reason instanceof Error ? {
        message: reason.message,
        stack: reason.stack,
      } : reason,
      promise: promise.toString(),
    });
    
    // In production, you might want to restart the process
    if (process.env.NODE_ENV === 'production') {
      console.error('Process will exit due to unhandled rejection');
      process.exit(1);
    }
  });
};

// Custom error classes
export class ValidationError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string, details?: any) {
    super(message);
    this.statusCode = 400;
    this.isOperational = true;
    this.code = 'VALIDATION_ERROR';
    this.name = 'ValidationError';
    
    if (details) {
      this.message = `${message}: ${JSON.stringify(details)}`;
    }
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.statusCode = 401;
    this.isOperational = true;
    this.code = 'AUTHENTICATION_ERROR';
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.statusCode = 403;
    this.isOperational = true;
    this.code = 'AUTHORIZATION_ERROR';
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.statusCode = 404;
    this.isOperational = true;
    this.code = 'NOT_FOUND_ERROR';
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.statusCode = 429;
    this.isOperational = true;
    this.code = 'RATE_LIMIT_ERROR';
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Database operation failed') {
    super(message);
    this.statusCode = 500;
    this.isOperational = true;
    this.code = 'DATABASE_ERROR';
    this.name = 'DatabaseError';
  }
}

export class BlockchainError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string = 'Blockchain operation failed') {
    super(message);
    this.statusCode = 500;
    this.isOperational = true;
    this.code = 'BLOCKCHAIN_ERROR';
    this.name = 'BlockchainError';
  }
}