import { Controller, Module, Get, Query } from '@nestjs/common';
import { SuccessBodyDto } from '../../dtos';
import { GamesService, GamesServiceModule } from '../../services/games.service';
import { NumberPipe } from '../../pipes/Number.pipe';
import { BooleanPipe } from '../../pipes/Boolean.pipe';
import {
  PricesService,
  PricesServiceModule,
} from '../../services/prices.service';

@Controller('v1/games')
export class GamesController {
  constructor(
    private readonly games: GamesService,
    private readonly prices: PricesService,
  ) {}

  @Get()
  async list(
    @Query('page', new NumberPipe({ defaultValue: 1, min: 1 }))
    pageCurrent: number,
    @Query('countries')
    countries: string,
    @Query('sales', new BooleanPipe({ defaultValue: false }))
    sales: boolean,
  ): Promise<SuccessBodyDto<any[]>> {
    const results = await this.games.search({
      pageCurrent,
      countries,
      sales,
    });

    return {
      result: await Promise.all(
        results.games.map(async game => ({
          ...game,
          prices: await this.prices.find({ where: { gameId: game.id } }),
        })),
      ),
      meta: { pagination: results.pagination },
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [GamesController],
  imports: [GamesServiceModule, PricesServiceModule],
})
export class GamesModule {}
