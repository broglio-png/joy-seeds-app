# Security Guide for Gratitude App

## Overview

This document outlines the security measures implemented in the Gratitude App and provides guidance for maintaining security as the application evolves.

## Current Security Implementation

### 1. Input Validation & Sanitization
- **Email validation**: Proper regex validation and length limits
- **Text sanitization**: HTML tag removal and XSS prevention
- **Length limits**: Character limits on all user inputs
- **Real-time validation**: Immediate feedback to users

### 2. Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer Policy**: Controls referrer information
- **Permissions Policy**: Restricts browser features

### 3. Error Handling & Monitoring
- **Security boundary**: Graceful error handling with user-friendly messages
- **Security monitoring**: Logging of security events and errors
- **Rate limiting**: Ready for implementation when needed

### 4. Authentication Preparation
- **Auth hook**: Ready-to-use authentication structure
- **Session management**: Secure session handling prepared
- **Error logging**: Authentication events monitored

## Supabase Security Configuration

### Current Status
✅ **Secure by default**: No database tables created yet
✅ **Proper client setup**: Supabase client correctly configured
⚠️ **Minor issues**: Auth OTP expiry and Postgres version (low priority)

### When Adding Database Features

1. **Always enable RLS (Row Level Security)**
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

2. **Create proper policies**
```sql
-- Example user-specific data policy
CREATE POLICY "Users can view their own data" 
ON your_table 
FOR SELECT 
USING (auth.uid() = user_id);
```

3. **Use proper user references**
- Reference `auth.uid()` for current user
- Never create foreign keys to `auth.users`
- Create `profiles` table for additional user data

### Required Supabase Updates

1. **Auth OTP Expiry Settings**
   - Go to: https://supabase.com/dashboard/project/monxqvenifweuvcqhyby/auth/providers
   - Update OTP expiry to recommended values (currently exceeds recommendations)

2. **Database Version**
   - Monitor for Postgres updates in Supabase dashboard
   - Apply security patches when available

## Security Monitoring

### Built-in Security Monitor
The app includes a security monitoring system that logs:
- Failed authentication attempts
- Rate limit violations
- Security errors and exceptions
- Input validation failures

### Accessing Logs
```typescript
import { securityMonitor } from '@/lib/security';

// Get all security logs
const logs = securityMonitor.getLogs();

// Log custom security events
securityMonitor.logSecurityEvent('Suspicious activity', { details });
```

## Production Deployment Security

### Environment Variables
- Never expose sensitive keys in client-side code
- Use proper environment variable configuration
- Rotate keys regularly

### HTTPS Configuration
- Always use HTTPS in production
- Configure proper SSL/TLS certificates
- Enable HSTS (Strict Transport Security)

### Content Security Policy
The app includes production-ready CSP headers in `public/_headers`. Adjust as needed for your deployment platform.

## Security Checklist

### Before Adding User Authentication
- [ ] Review and test authentication flow
- [ ] Implement proper password policies
- [ ] Set up email verification
- [ ] Configure session timeouts
- [ ] Test logout functionality

### Before Adding Database Features
- [ ] Enable RLS on all tables
- [ ] Create appropriate policies
- [ ] Test policy enforcement
- [ ] Validate input handling
- [ ] Test error scenarios

### Before Production Deployment
- [ ] Update Supabase OTP expiry settings
- [ ] Configure security headers
- [ ] Test CSP policy
- [ ] Set up error monitoring
- [ ] Review access logs
- [ ] Test backup procedures

## Incident Response

### Security Event Detection
1. Monitor security logs regularly
2. Set up alerts for critical events
3. Review authentication failures
4. Monitor for unusual patterns

### Response Procedures
1. **Immediate**: Identify and contain the issue
2. **Assessment**: Determine scope and impact
3. **Mitigation**: Apply fixes and updates
4. **Recovery**: Restore normal operations
5. **Review**: Analyze and improve security measures

## Security Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [OWASP Web Security](https://owasp.org/www-project-web-security-testing-guide/)
- [React Security Guide](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Contact

For security concerns or questions, review the code and documentation. The security implementation is designed to be self-documenting and maintainable.