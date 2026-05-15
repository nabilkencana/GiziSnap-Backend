import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

const ALLOWED_ORIGINS = [
  'https://gizisnap.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gizisnap-frontend-1004063957486.asia-southeast2.run.app'
  // Cloud Run frontend (pattern match di bawah)
];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Increase payload size limit
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

  // ── Manual CORS middleware (paling aman, handle preflight OPTIONS) ──────────
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin || '';
    const isAllowed =
      ALLOWED_ORIGINS.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.run\.app$/.test(origin) ||   // Google Cloud Run URLs
      origin === ''; 

    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    } else {
      res.header('Access-Control-Allow-Origin', 'https://gizisnap.vercel.app');
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    );

    // Handle OPTIONS preflight immediately
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  });

  // Serve uploaded food images as static files at /uploads/*
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Enable validation for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
