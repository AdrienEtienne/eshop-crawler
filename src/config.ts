import { Logger } from '@nestjs/common';

export const logger = new Logger('Main');

export const PORT = process.env.PORT || 3000;

export const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/postgres';
