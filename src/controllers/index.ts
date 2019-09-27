import { WebhooksModule } from './webhooks/webhooks.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';
import { GamesModule } from './games/games.controller';
import { ShopsModule } from './shops/shops.controller';

@Module({
  controllers: [AppController],
  imports: [GamesModule, ShopsModule, WebhooksModule],
  providers: [AppService],
})
export class ControllersModule {}
