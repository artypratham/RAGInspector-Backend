import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import extractionRoutes from './routes/extraction.routes';
import annotationRoutes from './routes/annotation.routes';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({
  origin: [FRONTEND_URL, 'https://rag-inspector-git-main-artyprathams-projects.vercel.app/' ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'RAG Inspector API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/extractions', extractionRoutes);
app.use('/api/annotations', annotationRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${FRONTEND_URL}`);
});
