// utils/logger.ts
import fs from 'fs';
import winston from 'winston';
import 'winston-daily-rotate-file';

// Use /tmp/logs on Vercel; fallback to env or 'logs' locally
const logDir =
  process.env.LOG_FILE_PATH || (process.env.VERCEL ? '/tmp/logs' : 'logs');

// Ensure directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    // Daily rotated file logs (ephemeral on Vercel)
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'ecics-log-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || '100m',
    }),
    // Console logs (appears in Vercel dashboard)
    new winston.transports.Console(),
  ],
});

export default logger;
