import { DATABASE_URL } from '../config';

export const cli = {
  migrationsDir: 'src/db/migration',
};
export const entities = [__dirname + '/../**/*.entity{.ts,.js}'];
export const migrations = [__dirname + '/migration/*{.ts,.js}'];
export const migrationsRun = true;
export const type = 'postgres';
export const url = DATABASE_URL;
