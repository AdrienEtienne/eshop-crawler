import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DATABASE_URL, logger } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        logger.log(`Connection to database url ${DATABASE_URL}`);
        return {
          cli: {
            migrationsDir: 'src/db/migration',
          },
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migration/*{.ts,.js}'],
          migrationsRun: true,
          type: 'postgres',
          url: DATABASE_URL,
        } as PostgresConnectionOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
