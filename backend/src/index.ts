import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import prisma from './config/database';
import authRoutes from './routes/auth.routes';
import extractionRoutes from './routes/extraction.routes';
import annotationRoutes from './routes/annotation.routes';

const app = express();

const allowedOrigins = env.NODE_ENV === 'production'
  ? [env.FRONTEND_URL]
  : [env.FRONTEND_URL, 'http://localhost:5173'];

app.use(helmet());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', message: 'RAG Inspector API is running' });
  } catch {
    res.status(503).json({ status: 'unhealthy', error: 'Database unreachable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/extractions', extractionRoutes);
app.use('/api/annotations', annotationRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
