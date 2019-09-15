import * as eshop from 'nintendo-switch-eshop';
import { writeFileAsync } from './tools';

// Shops
async function getActiveShops() {
  const data = await eshop.getActiveShops();
  await writeFileAsync('shops-active.json', data);
}
async function getShopsEurope() {
  const data = await eshop.getShopsEurope();
  await writeFileAsync('shops-europe.json', data);
}
async function getShopsAmerica() {
  const data = await eshop.getShopsAmerica();
  await writeFileAsync('shops-america.json', data);
}
async function getShopsAsia() {
  const data = await eshop.getShopsAsia();
  await writeFileAsync('shops-asia.json', data);
}

async function run() {
  await getShopsEurope();
  await getShopsAmerica();
  await getShopsAsia();
  await getActiveShops();
}

run();
