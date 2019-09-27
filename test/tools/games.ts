import * as faker from 'faker';
import { Game } from '../../src/db/entities/game.entity';

export async function generateGame() {
  const game = Game.createOne(faker.random.words());
  await game.save();

  return game;
}
