import { CronJob } from 'cron';
import { BinanceService } from './modules/exchanges/BinanceService';
import { Asset, type BuyParams, Quote } from './modules/exchanges/types';
import { getMyIp } from './utils/getMyIp';
import { TelegramService } from '@helciofranco/telegram';

let job: CronJob | undefined = undefined;
const telegramService = new TelegramService(
  process.env.TELEGRAM_CHAT_ID || '',
  process.env.TELEGRAM_BOT_TOKEN || '',
  process.env.TELEGRAM_ENABLED === 'true',
);

const assets: BuyParams[] = [
  {
    base: Asset.Bitcoin,
    quote: Quote.BRL,
    amount: 50,
  },
  {
    base: Asset.Ethereum,
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

    await telegramService.sendMessage(output || '💰 No orders sent');

    await telegramService.sendMessage(`🕒 Next run: ${job?.nextDate()}`);
  } catch (error) {
    console.error(error);
    await telegramService.sendMessage('❌ An error has occurred');
  }
};

// Runs every 6 hours
job = new CronJob('0 */6 * * *', task, null, true, 'America/Sao_Paulo');

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
})();
