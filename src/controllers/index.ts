import { WebhooksModule } from './webhooks/webhooks.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';

@Module({
  controllers: [AppController],
  imports: [WebhooksModule],
  providers: [AppService],
})
export class ControllersModule {}
