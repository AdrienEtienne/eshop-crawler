import { Controller, Body, Module, Post } from '@nestjs/common';
import { SuccessBodyDto, WebhookDto } from '../../dtos';
import { ShopsService, ShopsServiceModule } from '../../services/shops.service';
import { GamesService, GamesServiceModule } from '../../services/games.service';
import {
  PricesService,
  PricesServiceModule,
} from '../../services/prices.service';

@Controller('v1/webhooks')
export class WebhooksController {
  constructor(
    private readonly shops: ShopsService,
    private readonly games: GamesService,
    private readonly prices: PricesService,
  ) {}

  @Post()
  async webhook(@Body() body: WebhookDto): Promise<SuccessBodyDto<undefined>> {
    if (!body || !body.type || body.type !== 'sync') {
      return {
        result: undefined,
      };
    }

    Promise.resolve()
      .then(() => this.shops.sync())
      .then(() => this.games.sync())
      .then(() => this.prices.sync());

    return {
      result: undefined,
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [WebhooksController],
  imports: [ShopsServiceModule, GamesServiceModule, PricesServiceModule],
})
export class WebhooksModule {}
