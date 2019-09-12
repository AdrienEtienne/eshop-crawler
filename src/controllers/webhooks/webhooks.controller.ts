import { Controller, Get, Body, Module } from '@nestjs/common';
import { SuccessBodyDto, WebhookDto } from '../../dtos';
import { logger } from '../../config';

@Controller()
export class WebhooksController {
  @Get('webhooks')
  webhook(@Body() body: WebhookDto): SuccessBodyDto<undefined> {
    if (!body || !body.type || body.type !== 'sync') {
      return {
        result: undefined,
      };
    }

    logger.log('process');

    return {
      result: undefined,
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [WebhooksController],
})
export class WebhooksModule {}
