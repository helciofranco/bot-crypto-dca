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
    const orders = await Promise.all(assets.map((asset) => binance.buy(asset)));

    const output = orders
      .map((order, index) => {
        const asset = assets[index];
        return `💰 ${order.executed} ${asset.base} for ${order.paid} ${asset.quote}\n ${asset.quote} ${order.average}/${asset.base}`;
      })
      .join('\n\n');

    await telegramService.sendMessage(output);

    await telegramService.sendMessage(`🕒 Next run: ${job?.nextDate()}`);
  } catch (error) {
    if (error instanceof Error) {
      await telegramService.sendMessage(error.message);
    }
  }
};

// Runs every 2 hours
job = new CronJob('0 */2 * * *', task, null, true, 'America/Sao_Paulo');

const start = async () => {
  const next = job.nextDate();
  await telegramService.sendMessage(
    `🚀 Auto-buy have been started.\n🕒 Next run: ${next}`,
  );

  const ip = await getMyIp();
  await telegramService.sendMessage(`📡 My IP is ${ip}`);
};

(async () => {
  await start();
  await task();
})();
