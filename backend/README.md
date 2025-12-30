# RAG Inspector Backend API

Backend API for RAG Inspector - A RAG pipeline diagnostics and analysis tool.

## Features

- 🔐 JWT-based authentication
- ✅ Input validation with Zod
- 🗄️ PostgreSQL with Prisma ORM
- 🚀 TypeScript + Express
- 📊 Extraction history management
- 📝 Annotation tracking
- ☁️ NeonDB serverless PostgreSQL

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod
- **Deployment**: Render/Railway (free tier)

## Prerequisites

- Node.js 18+
- PostgreSQL database (NeonDB)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://neondb_owner:npg_7hGanWUmL6Mf@ep-green-silence-a154caot-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR create and run migrations (for production)
npm run prisma:migrate

# Open Prisma Studio to view/edit data
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Extractions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/extractions` | Create extraction | Yes |
| GET | `/api/extractions` | List all extractions | Yes |
| GET | `/api/extractions/:id` | Get extraction details | Yes |
| PUT | `/api/extractions/:id` | Update extraction | Yes |
| DELETE | `/api/extractions/:id` | Delete extraction | Yes |

### Annotations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/annotations` | Create annotation | Yes |
| GET | `/api/annotations?extractionId=xxx` | List annotations | Yes |
| PUT | `/api/annotations/:id` | Update annotation | Yes |
| DELETE | `/api/annotations/:id` | Delete annotation | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## Request/Response Examples

### Signup

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGc..."
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Extraction

```bash
POST /api/extractions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Loan Application Extraction",
  "schemaInput": "{\"input_schema\": {...}}",
  "outputJson": "{\"record_id\": \"rec_001\", ...}"
}
```

### Create Annotation

```bash
POST /api/annotations
Authorization: Bearer <token>
Content-Type: application/json

{
  "extractionId": "clxxx...",
  "fieldName": "borrower_name",
  "recordId": "rec_001",
  "originalValue": "John Smith",
  "correctedValue": "Jonathan Smith",
  "comment": "Full name correction",
  "flagType": "correction"
}
```

## Database Schema

### User
- `id`: String (CUID)
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Extraction
- `id`: String (CUID)
- `userId`: String (FK)
- `title`: String
- `schemaInput`: Text
- `outputJson`: Text
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Record
- `id`: String (CUID)
- `extractionId`: String (FK)
- `recordId`: String
- `docId`: String
- `success`: Boolean
- `recordData`: Text
- `createdAt`: DateTime

### Annotation
- `id`: String (CUID)
- `extractionId`: String (FK)
- `fieldName`: String
- `recordId`: String
- `originalValue`: String
- `correctedValue`: String
- `comment`: String
- `flagType`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Deployment

### Option 1: Render (Recommended - Free Tier)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select the `backend` folder
6. Render will auto-detect the `render.yaml` configuration
7. Add environment variables in Render dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

### Option 2: Railway (Free Tier)

1. Push code to GitHub
2. Go to [Railway](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the configuration
6. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`

### Option 3: Manual Deployment (Any VPS)

```bash
# Clone repository
git clone <your-repo>
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Build
npm run build

# Run migrations
npm run prisma:migrate

# Start server
npm start
```

## Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL`: Your NeonDB connection string
- `JWT_SECRET`: Strong secret key (min 32 characters)
- `PORT`: 5000 (or platform default)
- `NODE_ENV`: production
- `FRONTEND_URL`: Your frontend deployment URL (e.g., https://your-app.vercel.app)

## Development

### File Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   └── env.ts             # Environment validation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── extraction.controller.ts
│   │   └── annotation.controller.ts
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   └── validate.ts        # Zod validation
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── extraction.routes.ts
│   │   └── annotation.routes.ts
│   ├── types/
│   │   └── validation.ts      # Zod schemas
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── password.ts        # Password hashing
│   └── index.ts               # App entry point
├── .env                        # Environment variables
├── .env.example               # Example env file
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Passwords are hashed using bcryptjs with 10 salt rounds
- JWT tokens expire in 7 days
- All authenticated routes require valid JWT token
- Input validation on all endpoints using Zod
- CORS configured for frontend origin only
- Database queries use Prisma's parameterized queries (SQL injection protected)

## License

MIT
