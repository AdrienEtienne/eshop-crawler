import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../db/entities/shop.entity';
import * as nintendo from 'nintendo-switch-eshop';
import { logger } from '../config';
import { wait } from '../tools';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shops: Repository<Shop>,
  ) {}

  async sync(): Promise<Shop[]> {
    let results: Shop[] = [];

    const eshops: nintendo.EShop[] = [];

    logger.log(`Start sync Shops`);

    try {
      eshops.push(...(await nintendo.getShopsEurope()));
      logger.log(`[OK] Fetch Eshops Europe`);
    } catch (error) {
      logger.error(`[KO] Fetch Eshops Europe: ${error.message}`);
    }

    await wait(2);

    try {
      eshops.push(...(await nintendo.getShopsAmerica()));
      logger.log(`[OK] Fetch Eshops America`);
    } catch (error) {
      logger.error(`[KO] Fetch Eshops America: ${error.message}`);
    }

    await wait(2);

    try {
      eshops.push(...(await nintendo.getShopsAsia()));
      logger.log(`[OK] Fetch Eshops Asia`);
    } catch (error) {
      logger.error(`[KO] Fetch Eshops Asia`, error.trace);
    }

    try {
      results = await Promise.all(
        eshops.map(async el => {
          let shop = await this.shops.findOne({ where: { code: el.code } });
          if (!shop) {
            shop = this.shops.create({
              code: el.code,
              country: el.country,
              currency: el.currency,
              region: el.region,
            });
            await shop.save();
            logger.log(`Eshop for country="${shop.country}" created`);
          } else {
            logger.log(`Eshop for country="${shop.country}" already exists`);
          }
          return shop;
        }),
      );

      logger.log(`[OK] Sync Eshops`);
    } catch (error) {
      logger.error(`[KO] Sync Eshops: ${error.message}`);
    }

    return results;
  }
}

// tslint:disable-next-line: max-classes-per-file
@Module({
  imports: [TypeOrmModule.forFeature([Shop])],
  providers: [ShopsService],
  exports: [ShopsService],
})
export class ShopsServiceModule {}
