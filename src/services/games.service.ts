import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nintendo from 'nintendo-switch-eshop';
import { logger } from '../config';
import { Game } from '../db/entities/game.entity';
import { get } from 'lodash';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly games: Repository<Game>,
  ) {}

  async findOneByTitle(title: string) {
    return this.games.findOne({
      where: { titleSlug: Game.titleSlug(title) },
    });
  }

  async syncEuropeGames() {
    let games: nintendo.GameEU[] = [];

    try {
      games = await nintendo.getGamesEurope();
      logger.log(`[OK] Fetch Games Europe`);
    } catch {
      logger.error(`[KO] Fetch Games Europe`);
      return;
    }

    await Promise.all(
      games.map(async el => {
        let game = await this.findOneByTitle(el.title);
        if (!game) {
          game = Game.createOne(el.title);
        }
        try {
          game.update({
            descriptionShort: el.excerpt,
            euId: el.nsuid_txt ? el.nsuid_txt[0] : null,
            euReleaseDate: el.date_from.toString(),
            euImageUrl: el.image_url,
            euUrl: el.url,
          });
          await game.save();
          return game;
        } catch (error) {
          logger.error(
            `[KO] Sync game "${el.title}": ${error.message}`,
            error.stack,
          );
        }
      }),
    );

    logger.log(`[OK] Sync games Europe`);
  }

  async syncAmericaGames() {
    const games: nintendo.GameUS[] = [];

    try {
      games.push(...(await nintendo.getGamesAmerica()));

      logger.log(`[OK] Fetch Games America`);
    } catch (error) {
      logger.error(`[KO] Fetch Games America: ${error.message}`);
    }

    await Promise.all(
      games.map(async el => {
        let game = await this.findOneByTitle(el.title);

        if (!game) {
          game = Game.createOne(el.title);
        }
        game.update({
          description: get(el, 'description'),
          americaId: el.nsuid,
          americaReleaseDate: get(el, 'releaseDateMask'),
          americaUrl: get(el, 'url'),
        });
        try {
          await game.save();
          return game;
        } catch (error) {
          logger.error(
            `[KO] Sync game "${el.title}": ${error.message}`,
            error.stack,
          );
        }
      }),
    );

    logger.log(`[OK] Sync games America`);
  }

  async syncGames() {
    await this.syncEuropeGames();
    await this.syncAmericaGames();
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesServiceModule {}
