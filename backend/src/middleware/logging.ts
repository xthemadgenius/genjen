import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

// Custom token for response time in different colors
morgan.token('response-time-colored', (req: Request, res: Response) => {
  const responseTimeToken = (morgan as any)['response-time'];
  const responseTime = parseFloat(responseTimeToken(req, res) || '0');
  const time = responseTime.toFixed(2);
  
  // Color coding based on response time
  if (responseTime < 100) return `\x1b[32m${time}ms\x1b[0m`; // Green for fast
  if (responseTime < 500) return `\x1b[33m${time}ms\x1b[0m`; // Yellow for moderate
  return `\x1b[31m${time}ms\x1b[0m`; // Red for slow
});

// Custom token for status code with colors
morgan.token('status-colored', (req: Request, res: Response) => {
  const status = res.statusCode;
  
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`; // Red for server errors
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`; // Yellow for client errors
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`; // Cyan for redirects
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`; // Green for success
  return `\x1b[37m${status}\x1b[0m`; // White for informational
});

// Custom token for HTTP method with colors
morgan.token('method-colored', (req: Request) => {
  const method = req.method;
  
  switch (method) {
    case 'GET': return `\x1b[32m${method}\x1b[0m`;    // Green
    case 'POST': return `\x1b[34m${method}\x1b[0m`;   // Blue
    case 'PUT': return `\x1b[33m${method}\x1b[0m`;    // Yellow
    case 'DELETE': return `\x1b[31m${method}\x1b[0m`; // Red
    case 'PATCH': return `\x1b[35m${method}\x1b[0m`;  // Magenta
    default: return `\x1b[37m${method}\x1b[0m`;       // White
  }
});

// Custom token for user agent detection
morgan.token('user-agent-short', (req: Request) => {
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Postman')) return 'Postman';
  if (userAgent.includes('curl')) return 'curl';
  if (userAgent.includes('wget')) return 'wget';
  if (userAgent.includes('bot')) return 'Bot';
  
  return 'Unknown';
});

// Custom token for request size
morgan.token('req-size', (req: Request) => {
  const contentLength = req.get('Content-Length');
  if (contentLength) {
    const size = parseInt(contentLength);
    if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)}MB`;
    if (size > 1024) return `${(size / 1024).toFixed(2)}KB`;
    return `${size}B`;
  }
  return '-';
});

// Development logging format (colorful and detailed)
const developmentFormat = ':method-colored :url :status-colored :res[content-length] - :response-time-colored :user-agent-short';

// Production logging format (JSON structured for log aggregation)
const productionFormat = morgan.compile('{"timestamp":":date[iso]","method":":method","url":":url","status":":status","contentLength":":res[content-length]","responseTime":":response-time","userAgent":":user-agent","ip":":remote-addr","referer":":referrer"}');

// Request logging middleware
export const requestLogger = process.env.NODE_ENV === 'production' 
  ? morgan(productionFormat)
  : morgan(developmentFormat);

// Security event logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log suspicious activities
  const logSecurityEvent = (event: string, details: any = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method,
      url: req.url,
      headers: {
        origin: req.get('Origin'),
        referer: req.get('Referer'),
        host: req.get('Host'),
      },
      ...details
    };
    
    console.warn(`🚨 SECURITY EVENT: ${JSON.stringify(logEntry)}`);
  };

  // Check for suspicious patterns
  const url = req.url.toLowerCase();
  const userAgent = req.get('User-Agent')?.toLowerCase() || '';
  
  // Detect common attack patterns
  const suspiciousPatterns = [
    { pattern: /(\.\.|\/\.\.\/|\\\.\.\\)/g, type: 'Path Traversal' },
    { pattern: /(union|select|insert|delete|drop|create|alter)/gi, type: 'SQL Injection Attempt' },
    { pattern: /<script|javascript:|onload=|onerror=/gi, type: 'XSS Attempt' },
    { pattern: /(\$\{|\{\{|<%)/g, type: 'Template Injection' },
    { pattern: /(cmd|eval|exec|system)/gi, type: 'Command Injection' },
    { pattern: /(\/proc\/|\/etc\/passwd|\/windows\/system32)/gi, type: 'File System Probe' },
  ];
  
  // Check URL for suspicious patterns
  suspiciousPatterns.forEach(({ pattern, type }) => {
    if (pattern.test(url) || pattern.test(JSON.stringify(req.body))) {
      logSecurityEvent(type, {
        matchedPattern: pattern.toString(),
        requestBody: req.body
      });
    }
  });
  
  // Check for suspicious user agents
  const maliciousUserAgents = [
    'sqlmap', 'nmap', 'nikto', 'dirb', 'gobuster', 'wpscan', 'masscan'
  ];
  
  maliciousUserAgents.forEach(agent => {
    if (userAgent.includes(agent)) {
      logSecurityEvent('Malicious User Agent', {
        detectedAgent: agent,
        fullUserAgent: req.get('User-Agent')
      });
    }
  });
  
  // Check for unusual request patterns
  if (req.method === 'POST' && !req.get('Content-Type')) {
    logSecurityEvent('POST without Content-Type', {});
  }
  
  // Check for missing common headers
  if (!req.get('User-Agent') && !req.url.includes('health')) {
    logSecurityEvent('Missing User-Agent Header', {});
  }
  
  // Log slow requests
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) { // Log requests taking more than 5 seconds
      logSecurityEvent('Slow Request', {
        duration,
        status: res.statusCode
      });
    }
  });
  
  next();
};

// Error logging middleware
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: err.message,
      stack: err.stack,
      status: err.statusCode || 500,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      headers: process.env.NODE_ENV === 'development' ? req.headers : {},
      body: process.env.NODE_ENV === 'development' ? req.body : '[REDACTED]',
    }
  };
  
  // Log to console with color coding
  if (err.statusCode >= 500) {
    console.error(`\x1b[31m❌ SERVER ERROR:\x1b[0m ${JSON.stringify(errorLog, null, 2)}`);
  } else if (err.statusCode >= 400) {
    console.warn(`\x1b[33m⚠️  CLIENT ERROR:\x1b[0m ${JSON.stringify(errorLog, null, 2)}`);
  } else {
    console.log(`\x1b[36mℹ️  INFO:\x1b[0m ${JSON.stringify(errorLog, null, 2)}`);
  }
  
  // In production, you might want to send this to a logging service
  // Example: logstash, elasticsearch, splunk, datadog, etc.
  
  next(err);
};

// API access logging middleware
export const apiAccessLogger = (req: Request, res: Response, next: NextFunction) => {
  // Only log API endpoints
  if (!req.path.startsWith('/api/')) {
    return next();
  }
  
  const accessLog = {
    timestamp: new Date().toISOString(),
    type: 'api_access',
    method: req.method,
    endpoint: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    origin: req.get('Origin'),
    referer: req.get('Referer'),
  };
  
  // Log API access in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`\x1b[36m📡 API ACCESS:\x1b[0m ${req.method} ${req.path} from ${req.ip}`);
  }
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(accessLog));
  }
  
  next();
};

// Performance monitoring middleware
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
    };
    
    // Log performance metrics for slow requests
    if (duration > 1000 || Math.abs(memoryDelta.heapUsed) > 10 * 1024 * 1024) { // 1 second or 10MB memory change
      const perfLog = {
        timestamp: new Date().toISOString(),
        type: 'performance',
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: Math.round(duration),
        memory: {
          delta: memoryDelta,
          current: endMemory,
        },
        ip: req.ip,
      };
      
      console.warn(`\x1b[35m⚡ PERFORMANCE:\x1b[0m ${JSON.stringify(perfLog)}`);
    }
  });
  
  next();
};