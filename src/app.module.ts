import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ControllersModule } from './controllers';

@Module({
  imports: [DatabaseModule, ControllersModule],
})
export class AppModule {}
