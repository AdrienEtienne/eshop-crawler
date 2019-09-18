import { Controller, Module, Get, Param, Query } from '@nestjs/common';
import { SuccessBodyDto } from '../../dtos';
import { GamesService, GamesServiceModule } from '../../services/games.service';
import { NumberPipe } from '../../pipes/Number.pipe';
import { Game } from '../../db/entities/game.entity';

@Controller('v1/games')
export class GamesController {
  constructor(private readonly games: GamesService) {}

  @Get()
  async list(
    @Query('page', new NumberPipe({ defaultValue: 1, min: 1 }))
    pageCurrent: number,
  ): Promise<SuccessBodyDto<Game[]>> {
    const results = await this.games.search({
      pageCurrent,
    });

    return {
      result: results.games,
      meta: { pagination: results.pagination },
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  controllers: [GamesController],
  imports: [GamesServiceModule],
})
export class GamesModule {}
