import { Controller, Module, Get } from '@nestjs/common';
import { SuccessBodyDto } from '../../dtos';
import { ShopsService, ShopsServiceModule } from '../../services/shops.service';
import { Shop } from '../../db/entities/shop.entity';

@Controller('v1/shops')
export class ShopsController {
  constructor(private readonly shops: ShopsService) {}

  @Get()
  async list(): Promise<SuccessBodyDto<Shop[]>> {
    const results = await this.shops.find();

    return {
      result: results,
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [ShopsController],
  imports: [ShopsServiceModule],
})
export class ShopsModule {}
