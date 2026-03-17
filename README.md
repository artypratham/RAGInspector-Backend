# RAG Inspector Backend

Backend API for **RAG Inspector** — a tool for evaluating, annotating, and auditing Retrieval-Augmented Generation (RAG) pipeline outputs.

Built with TypeScript, Express, Prisma, and PostgreSQL.

## Features

- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **Extractions** — Store and manage RAG extraction schemas and outputs
- **Annotations** — Mark extraction fields as correct/incorrect with error categorization (hallucination, retrieval, extraction, formatting)
- **Submission workflow** — Submit extractions with annotations in a single atomic transaction
- **Production-hardened** — Rate limiting, security headers, input validation, graceful shutdown

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/artypratham/RAGInspector-Backend.git
cd RAGInspector-Backend/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and a secure JWT_SECRET

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

### Using Docker

```bash
# Start PostgreSQL + API with one command
docker compose up

# In a separate terminal, run migrations
docker compose exec api npx prisma migrate dev
```

## API Reference

### Health Check

| Method | Endpoint  | Description                    |
| ------ | --------- | ------------------------------ |
| GET    | `/health` | Returns API and database status |

### Authentication

| Method | Endpoint          | Body                                     | Description        |
| ------ | ----------------- | ---------------------------------------- | ------------------ |
| POST   | `/api/auth/signup` | `{ email, password, name? }`            | Register new user  |
| POST   | `/api/auth/login`  | `{ email, password }`                   | Login              |
| GET    | `/api/auth/me`     | —                                        | Get current user   |

### Extractions (requires `Authorization: Bearer <token>`)

| Method | Endpoint                   | Description                              |
| ------ | -------------------------- | ---------------------------------------- |
| POST   | `/api/extractions`         | Create extraction                        |
| POST   | `/api/extractions/submit`  | Create extraction with annotations       |
| GET    | `/api/extractions`         | List extractions (paginated: `?limit=&offset=`) |
| GET    | `/api/extractions/:id`     | Get extraction with annotations/records  |
| PUT    | `/api/extractions/:id`     | Update extraction                        |
| DELETE | `/api/extractions/:id`     | Delete extraction                        |

### Annotations (requires `Authorization: Bearer <token>`)

| Method | Endpoint               | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| POST   | `/api/annotations`     | Create annotation                        |
| GET    | `/api/annotations`     | List annotations (`?extractionId=` required) |
| PUT    | `/api/annotations/:id` | Update annotation                        |
| DELETE | `/api/annotations/:id` | Delete annotation                        |

## Environment Variables

| Variable       | Required | Default                 | Description                        |
| -------------- | -------- | ----------------------- | ---------------------------------- |
| `DATABASE_URL` | Yes      | —                       | PostgreSQL connection string       |
| `JWT_SECRET`   | Yes      | —                       | Minimum 32 characters              |
| `PORT`         | No       | `5000`                  | Server port                        |
| `NODE_ENV`     | No       | `development`           | `development`, `production`, `test` |
| `FRONTEND_URL` | No       | `http://localhost:5173` | Allowed CORS origin                |

## Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Start development server (watch) |
| `npm run build`       | Compile TypeScript                |
| `npm start`           | Run compiled production build     |
| `npm test`            | Run test suite                    |
| `npm run prisma:generate` | Generate Prisma client       |
| `npm run prisma:migrate`  | Run database migrations      |
| `npm run prisma:studio`   | Open Prisma Studio GUI       |

## Project Structure

```
src/
  config/        # Environment validation, database client
  controllers/   # Request handlers (auth, extraction, annotation)
  middleware/     # Authentication and validation middleware
  routes/        # Express route definitions
  types/         # Zod validation schemas and TypeScript types
  utils/         # JWT and password utilities
  __tests__/     # Unit tests
  index.ts       # Application entry point
prisma/
  schema.prisma  # Database schema
```

## Security

- Rate limiting on auth endpoints (10 requests / 15 min)
- Helmet.js security headers
- bcrypt password hashing (10 salt rounds)
- JWT tokens with 7-day expiry
- Zod input validation on all endpoints with size limits
- CORS allowlist configured per environment
- SQL injection prevention via Prisma ORM
- Non-root user in Docker container

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## Deployment

Pre-configured for:
- **Railway** — `railway.json`
- **Render** — `render.yaml`
- **Docker** — `Dockerfile` + `docker-compose.yml`

Build command: `npm install && npm run prisma:generate && npm run build`
Start command: `npm start`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
