import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Game } from '../src/db/entities/game.entity';
import { generateGame } from './tools';
import { SuccessBodyDto } from '../src/dtos';

describe('Games Controller (e2e)', () => {
  let app: INestApplication;
  let game: Game;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    game = await generateGame();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/games')
      .expect(200);
    const body = res.body as SuccessBodyDto<Game[]>;
    const games = body.result;
    expect(games.length).toBeGreaterThan(0);
    const meta = body!.meta;
    expect(meta.pagination.current).toBe(1);
    expect(meta.pagination.items).toBe(20);
    expect(meta.pagination.itemsTotal).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await getConnection('default').close();
    await app.close();
  });
});
