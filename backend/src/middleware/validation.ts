import { Request, Response, NextFunction } from 'express';
import { body, query, param, ValidationChain, validationResult } from 'express-validator';

// Custom validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? (error as any).value : undefined,
      location: (error as any).location || 'body'
    }));
    
    res.status(400).json({
      error: {
        message: 'Validation failed',
        status: 400,
        details: formattedErrors
      }
    });
    return;
  }
  
  next();
};

// Email validation
export const validateEmail = () => [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email must be less than 254 characters')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Email format is invalid')
];

// Username validation
export const validateUsername = () => [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .not()
    .isIn(['admin', 'root', 'user', 'test', 'null', 'undefined', 'api', 'www'])
    .withMessage('Username is reserved')
];

// Name validation (structured first_name, last_name)
export const validateName = () => [
  body('name.first_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
    .trim()
    .escape(),
  
  body('name.last_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
    .trim()
    .escape()
];

// Wallet address validation
export const validateWalletAddress = () => [
  body('walletAddress')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Must be a valid Ethereum wallet address (42 characters starting with 0x)')
];

// UUID validation
export const validateUUID = (field: string = 'id') => [
  param(field)
    .isUUID(4)
    .withMessage(`${field} must be a valid UUID`)
];

// Signature validation
export const validateSignature = () => [
  body('signature')
    .matches(/^0x[a-fA-F0-9]{130}$/)
    .withMessage('Signature must be a valid hex string (132 characters starting with 0x)'),
  
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .trim()
];

// Pagination validation
export const validatePagination = () => [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be a positive integer between 1 and 1000')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a positive integer between 1 and 100')
    .toInt(),
    
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'email', 'username'])
    .withMessage('SortBy must be one of: createdAt, updatedAt, email, username'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc')
];

// Search validation
export const validateSearch = () => [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .matches(/^[a-zA-Z0-9\s@._-]+$/)
    .withMessage('Search query contains invalid characters')
    .trim()
    .escape()
];

// ENS name validation
export const validateENS = () => [
  body('ensName')
    .optional()
    .matches(/^[a-z0-9-]+\.base\.eth$/)
    .withMessage('ENS name must be a valid .base.eth domain')
    .isLength({ max: 63 })
    .withMessage('ENS name must be less than 63 characters')
];

// Membership tier validation
export const validateMembershipTier = () => [
  body('membershipTierId')
    .isIn(['1', '2', '3', '4'])
    .withMessage('Membership tier must be one of: 1 (Basic), 2 (Pro), 3 (Premium), 4 (Enterprise)')
];

// User registration validation
export const validateUserRegistration = () => [
  ...validateEmail(),
  ...validateUsername(),
  ...validateName()
];

// User update validation
export const validateUserUpdate = () => [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email must be less than 254 characters'),
  
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  ...validateName(),
  ...validateENS()
];

// Wallet generation validation
export const validateWalletGeneration = () => [
  body('userId')
    .isUUID(4)
    .withMessage('User ID must be a valid UUID'),
  
  ...validateWalletAddress(),
  ...validateSignature()
];

// Content type validation middleware
export const validateContentType = (allowedTypes: string[] = ['application/json']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip validation for GET requests and health checks
    if (req.method === 'GET' || req.path.includes('health')) {
      return next();
    }
    
    const contentType = req.get('Content-Type');
    
    if (!contentType) {
      res.status(400).json({
        error: {
          message: 'Content-Type header is required',
          status: 400,
          expectedTypes: allowedTypes
        }
      });
      return;
    }
    
    const isValidType = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type.toLowerCase())
    );
    
    if (!isValidType) {
      res.status(415).json({
        error: {
          message: 'Unsupported Media Type',
          status: 415,
          received: contentType,
          expectedTypes: allowedTypes
        }
      });
      return;
    }
    
    next();
  };
};

// Request body size validation
export const validateRequestSize = (maxSizeBytes: number = 1024 * 1024) => { // Default 1MB
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.get('Content-Length');
    
    if (contentLength) {
      const size = parseInt(contentLength);
      
      if (size > maxSizeBytes) {
        res.status(413).json({
          error: {
            message: 'Request entity too large',
            status: 413,
            maxSize: `${Math.round(maxSizeBytes / 1024 / 1024)}MB`,
            receivedSize: `${Math.round(size / 1024 / 1024)}MB`
          }
        });
        return;
      }
    }
    
    next();
  };
};

// Custom sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
      .trim();
  };
  
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

// Rate limiting validation
export const validateApiKey = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.get('X-API-Key');
    
    // In development, skip API key validation
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    if (!apiKey) {
      res.status(401).json({
        error: {
          message: 'API key is required',
          status: 401
        }
      });
      return;
    }
    
    // Validate API key format (basic validation)
    if (!/^[a-zA-Z0-9]{32,}$/.test(apiKey)) {
      res.status(401).json({
        error: {
          message: 'Invalid API key format',
          status: 401
        }
      });
      return;
    }
    
    // In a real application, you would validate the API key against a database
    // For now, we'll accept any properly formatted key
    next();
  };
};