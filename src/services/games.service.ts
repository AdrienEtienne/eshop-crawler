import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import * as nintendo from 'nintendo-switch-eshop';
import { logger } from '../config';
import { Game } from '../db/entities/game.entity';
import { get, uniq } from 'lodash';
import { MetaPagination } from '../dtos';
import { Shop } from '../db/entities/shop.entity';
import { Price } from '../db/entities/price.entity';
import { SearchPipeResult } from '../pipes/Search.pipe';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly games: Repository<Game>,
    @InjectRepository(Shop)
    private readonly shops: Repository<Shop>,
    @InjectRepository(Price)
    private readonly prices: Repository<Price>,
  ) {}
  // Query
  async findOneByTitle(title: string) {
    return this.games.findOne({
      where: { titleSlug: Game.titleSlug(title) },
    });
  }

  async search(
    options: {
      pageCurrent?: number;
      pageItems?: number;
      countries?: string;
      sales?: boolean;
      search?: SearchPipeResult;
    } = {},
  ): Promise<{ games: Game[]; pagination: MetaPagination }> {
    const {
      pageCurrent = 1,
      pageItems = 20,
      countries = '',
      sales = false,
      search,
    } = options;

    const query = this.games.createQueryBuilder('game');

    if (search) {
      query.where(
        new Brackets(qb => {
          for (const word of search.words) {
            qb.andWhere(`LOWER(game.title) LIKE '%${word}%'`);
          }
        }),
      );
    }

    let shops: Shop[] = [];
    if (countries) {
      const countryCodes = countries.split(',').map(el => el.toUpperCase());
      if (countryCodes.length > 0) {
        shops = await this.shops.find({ where: { code: In(countryCodes) } });
      }
    }

    let gameIds: string[] = [];
    if (shops.length > 0) {
      try {
        const prices = await this.prices.find({
          where: {
            shopId: In(shops.map(el => el.id)),
            onSale: sales ? true : undefined,
          },
        });
        gameIds = uniq(prices.map(el => el.gameId));
      } catch (error) {
        logger.error(error);
      }
    }

    if (gameIds.length > 0) {
      query.andWhere('game.id IN (:...ids)', { ids: gameIds });
    }

    const results = await query
      // Quote in order to have good case for column name
      .orderBy('"titleSlug"', 'ASC')
      .limit(pageItems)
      .offset((pageCurrent - 1) * pageItems)
      .getManyAndCount();

    const games = results[0];
    const count = results[1];

    return {
      games,
      pagination: {
        current: pageCurrent,
        items: pageItems,
        itemsTotal: count,
      },
    };
  }

  // Sync
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
          logger.error(`[KO] Sync game "${el.title}": ${error.message}`);
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
          logger.error(`[KO] Sync game "${el.title}": ${error.message}`);
        }
      }),
    );

    logger.log(`[OK] Sync games America`);
  }

  async sync() {
    await this.syncEuropeGames();
    await this.syncAmericaGames();
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [TypeOrmModule.forFeature([Game, Shop, Price])],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesServiceModule {}
