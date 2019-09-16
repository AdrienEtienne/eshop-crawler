import { Controller, Body, Module, Post } from '@nestjs/common';
import { SuccessBodyDto, WebhookDto } from '../../dtos';
import { ShopsService, ShopsServiceModule } from '../../services/shops.service';
import { GamesService, GamesServiceModule } from '../../services/games.service';

@Controller('v1/webhooks')
export class WebhooksController {
  constructor(
    private readonly shops: ShopsService,
    private readonly games: GamesService,
  ) {}

  @Post()
  async webhook(@Body() body: WebhookDto): Promise<SuccessBodyDto<undefined>> {
    if (!body || !body.type || body.type !== 'sync') {
      return {
        result: undefined,
      };
    }

    this.shops.syncShops();
    this.games.syncGames();

    return {
      result: undefined,
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [WebhooksController],
  imports: [ShopsServiceModule, GamesServiceModule],
})
export class WebhooksModule {}
