import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ControllersModule } from './controllers';

@Module({
  imports: [ControllersModule, DatabaseModule],
})
export class AppModule {}
