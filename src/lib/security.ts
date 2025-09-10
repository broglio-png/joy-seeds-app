/**
 * Security utilities for the Gratitude App
 * Provides input validation, monitoring, and security helpers
 */

// Input validation and sanitization
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateTextLength = (text: string, maxLength: number = 1000): boolean => {
  return text.length <= maxLength && text.trim().length > 0;
};

export const sanitizeText = (text: string): string => {
  // Remove HTML tags and potentially dangerous characters
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// Security monitoring and logging
class SecurityMonitor {
  private static instance: SecurityMonitor;
  private logs: Array<{ timestamp: Date; level: 'info' | 'warn' | 'error'; message: string; data?: any }> = [];

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };
    
    this.logs.push(logEntry);
    
    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Console output for development
    if (import.meta.env.DEV) {
      console[level](`[Security] ${message}`, data);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  logSecurityEvent(event: string, details?: any) {
    this.log('warn', `Security event: ${event}`, details);
  }

  logError(error: Error, context?: string) {
    this.log('error', `Security error${context ? ` in ${context}` : ''}: ${error.message}`, {
      stack: error.stack,
      context
    });
  }
}

export const securityMonitor = SecurityMonitor.getInstance();

// Rate limiting utility (for future use)
export class RateLimiter {
  private requests = new Map<string, number[]>();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      securityMonitor.logSecurityEvent('Rate limit exceeded', { key, requests: validRequests.length });
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

// Content Security Policy generator
export const generateCSP = (): string => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for React dev
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://monxqvenifweuvcqhyby.supabase.co wss://monxqvenifweuvcqhyby.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];
  
  return cspDirectives.join('; ');
};

// Error boundary helper
export const handleSecurityError = (error: Error, errorInfo?: any) => {
  securityMonitor.logError(error, 'Security boundary');
  
  // In production, you might want to send this to a monitoring service
  if (!import.meta.env.DEV) {
    // Example: Send to monitoring service
    // monitoringService.reportError(error, errorInfo);
  }
};
