import * as eshop from 'nintendo-switch-eshop';
import * as fs from 'fs';
import { writeFileAsync } from './tools';

// Games
async function getGamesAmerica() {
  const data = await eshop.getGamesAmerica({ limit: 3 });

  await writeFileAsync('games-america.json', data);
}
async function getGamesEurope() {
  const data = await eshop.getGamesEurope({ limit: 3 });

  await writeFileAsync('games-europe.json', data);
}
async function getGamesJapan() {
  const data = await eshop.getGamesJapan();

  await writeFileAsync('games-japan.json', data.slice(0, 2));
}

async function run() {
  await Promise.all([getGamesAmerica(), getGamesEurope(), getGamesJapan()]);
}

run();
