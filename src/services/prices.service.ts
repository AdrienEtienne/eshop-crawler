import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Shop } from '../db/entities/shop.entity';
import * as nintendo from 'nintendo-switch-eshop';
import { logger } from '../config';
import { Price } from '../db/entities/price.entity';
import { Game } from '../db/entities/game.entity';
import { Region } from 'nintendo-switch-eshop';
import { toNumber, groupBy } from 'lodash';

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(Price)
    private readonly prices: Repository<Price>,
    @InjectRepository(Shop)
    private readonly shops: Repository<Shop>,
    @InjectRepository(Game)
    private readonly games: Repository<Game>,
  ) {}

  find(options?: FindManyOptions<Price>) {
    return this.prices.find(options);
  }

  async sync() {
    const shops = await this.shops.find();
    const games = await this.games.find({
      order: {
        updatedAt: 'ASC',
      },
    });

    logger.log(`Sync Prices for ${games.length} games`);
    let index = 1;

    for (const game of games) {
      const tmpRegions: Array<{
        gameId: string;
        region: nintendo.Region;
      }> = [];
      if (game.euId) {
        tmpRegions.push({
          gameId: game.euId,
          region: Region.EUROPE,
        });
      }
      if (game.americaId) {
        tmpRegions.push({
          gameId: game.americaId,
          region: Region.AMERICAS,
        });
      }

      const lstToCheck: Array<{
        gameId: string;
        shops: Shop[];
      }> = [];

      tmpRegions.forEach(tmpRegion => {
        const gameId = tmpRegion.gameId;

        const currencies = groupBy(
          shops.filter(shop => shop.region === tmpRegion.region),
          el => el.currency,
        );

        // tslint:disable-next-line: forin
        for (const currency in currencies) {
          const tmpShops = currencies[currency];

          lstToCheck.push({
            gameId,
            shops: tmpShops,
          });
        }
      });

      for (const toCheck of lstToCheck) {
        const gameId = toCheck.gameId;
        const gameShops = toCheck.shops;
        let titleData: nintendo.TitleData;

        for (const gameShop of gameShops) {
          try {
            const priceResponse = await nintendo.getPrices(
              gameShop.code,
              gameId,
            );
            if (
              !priceResponse.prices ||
              priceResponse.prices.length === 0 ||
              !priceResponse.prices[0].regular_price
            ) {
              continue;
            }
            titleData = priceResponse.prices[0];
            break;
          } catch (error) {
            logger.error(
              `Cant find price for "${game.title}", country="${gameShop.country}": ${error.message}`,
            );
            break;
          }
        }

        if (!titleData) {
          logger.warn(
            `Cant find price for "${game.title}" shop="${gameShops[0].country}"`,
          );
          break;
        }

        for (const gameShop of gameShops) {
          try {
            let price = await this.prices.findOne({
              where: { game, shop: gameShop },
            });
            if (!price) {
              price = Price.create({ game, shop: gameShop });
            }
            price.amount = titleData.regular_price.amount;
            price.amountValue = toNumber(titleData.regular_price.raw_value);
            price.currency = titleData.regular_price.currency;
            if (titleData.discount_price) {
              price.discountAmount = titleData.discount_price.amount;
              price.discountAmountValue = toNumber(
                titleData.discount_price.raw_value,
              );
              price.onSale = true;
            } else {
              price.discountAmount = null;
              price.discountAmountValue = null;
              price.onSale = false;
            }
            await price.save();
          } catch (error) {
            logger.error(
              `Cannot sync game "${game.title}" shop=${gameShop.country} : ${error.message}`,
            );
            break;
          }
        }
      }

      logger.log(`[OK] Sync Game ${index} "${game.title}"`);
      await game.save();
      index++;
    }

    logger.log(`[OK] Sync Prices`);
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [TypeOrmModule.forFeature([Price, Shop, Game])],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesServiceModule {}
