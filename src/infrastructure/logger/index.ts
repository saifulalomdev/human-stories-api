import { env } from '@/config/env';
import pino from 'pino';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' } : undefined,
});