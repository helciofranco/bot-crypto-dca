import { CronJob } from 'cron';
import { TelegramService } from './modules/notification/TelegramService';
import { BinanceService } from './modules/exchanges/BinanceService';
import { Asset, type BuyParams, Quote } from './modules/exchanges/types';
import { getMyIp } from './utils/getMyIp';

let job: CronJob | undefined = undefined;
const telegramService = new TelegramService();

const assets: BuyParams[] = [
  {
    base: Asset.Bitcoin,
    quote: Quote.BRL,
    amount: 25,
  },
  {
    base: Asset.Ethereum,
    quote: Quote.BRL,
    amount: 25,
  },
  {
    base: Asset.UsdTether,
    quote: Quote.BRL,
    amount: 50,
  },
];

const task = async () => {
  const binance = new BinanceService();

  console.log('💰 Starting auto-buy');

  try {
    const orders = await Promise.all(assets.map(binance.buy));

    const output = orders
      .map((order, index) => {
        const asset = assets[index];
        return `💰 ${order.executed} ${asset.base} for ${order.paid} ${asset.quote}\n ${asset.quote} ${order.average}/${asset.base}`;
      })
      .join('\n\n');

    await telegramService.sendMessage(output);

    const msg = `🕒 Next run: ${job?.nextDate()}`;
    console.log(msg);
    await telegramService.sendMessage(msg);
  } catch (error) {
    console.error('💰 Error while auto-buying:', error);

    if (error instanceof Error) {
      await telegramService.sendMessage(error.message);
    }
  }
};

// Runs every 2 hours
job = new CronJob('0 */2 * * *', task, null, true, 'America/Sao_Paulo');

const start = async () => {
  const next = job.nextDate();
  const msg = `🚀 Auto-buy have been started.\n🕒 Next run: ${next}`;
  console.log(msg);
  await telegramService.sendMessage(msg);

  const ip = await getMyIp();
  console.log(`📡 My IP is ${ip}`);
  await telegramService.sendMessage(ip);
};

(async () => {
  await start();
})();
