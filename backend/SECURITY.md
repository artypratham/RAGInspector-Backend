# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email the maintainers or use GitHub's private vulnerability reporting feature
3. Include steps to reproduce the issue
4. Allow reasonable time for a fix before public disclosure

We aim to acknowledge reports within 48 hours and provide a fix within 7 days for critical issues.

## Security Measures

This project implements:

- Helmet.js for HTTP security headers
- Rate limiting on authentication endpoints
- bcrypt password hashing (10 salt rounds)
- JWT authentication with token expiry
- Input validation via Zod on all endpoints
- Request body size limits (10MB)
- CORS allowlist (environment-configured)
- SQL injection prevention via Prisma ORM
- Environment variable validation at startup
- Non-root Docker container user
