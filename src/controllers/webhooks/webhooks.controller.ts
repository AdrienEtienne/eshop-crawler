import { Controller, Body, Module, Post } from '@nestjs/common';
import { SuccessBodyDto, WebhookDto } from '../../dtos';
import { EshopServiceModule, EshopService } from '../../services/eshop.service';

@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private readonly eshop: EshopService) {}

  @Post()
  async webhook(@Body() body: WebhookDto): Promise<SuccessBodyDto<undefined>> {
    if (!body || !body.type || body.type !== 'sync') {
      return {
        result: undefined,
      };
    }

    this.eshop.syncShops();

    return {
      result: undefined,
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [WebhooksController],
  imports: [EshopServiceModule],
})
export class WebhooksModule {}
