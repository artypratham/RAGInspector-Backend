# Contributing to RAG Inspector Backend

Thanks for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/RAGInspector-Backend.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `cd backend && npm install`
5. Copy environment config: `cp .env.example .env` and fill in your values
6. Generate Prisma client: `npm run prisma:generate`
7. Run migrations: `npm run prisma:migrate`
8. Start dev server: `npm run dev`

## Development Workflow

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Using Docker

```bash
docker compose up
```

## Pull Request Process

1. Ensure your code compiles without errors (`npx tsc --noEmit`)
2. Ensure all tests pass (`npm test`)
3. Write tests for new functionality
4. Keep PRs focused on a single change
5. Update documentation if you change APIs

## Code Style

- TypeScript strict mode is enabled
- Use Zod schemas for all input validation
- Handle errors in every controller with try/catch
- Use Prisma error codes (P2002, P2025) for database constraint errors

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node version, OS)

## Security Vulnerabilities

Please see [SECURITY.md](SECURITY.md) for reporting security issues.
