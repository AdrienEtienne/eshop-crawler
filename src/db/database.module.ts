import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { logger } from '../config';
import * as config from './database.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        logger.log(`[OK] Connection to database url ${config.url}`);
        return { ...config } as PostgresConnectionOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
