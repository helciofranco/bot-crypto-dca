import { CronJob } from 'cron';
import { TelegramService } from './modules/notification/TelegramService';
import { BinanceService } from './modules/exchanges/BinanceService';
import { Asset, Quote } from './modules/exchanges/types';
import { getMyIp } from './utils/getMyIp';

let job: CronJob | undefined = undefined;
const telegramService = new TelegramService();

const task = async () => {
  const binance = new BinanceService();

  console.log('💰 Starting auto-buy');

  try {
    const [btc, eth] = await Promise.all([
      binance.buy({
        base: Asset.Bitcoin,
        quote: Quote.BRL,
        amount: 25,
      }),
      binance.buy({
        base: Asset.Ethereum,
        quote: Quote.BRL,
        amount: 25,
      }),
    ]);

    const message = `💰 ${btc.executed} BTC for R$ ${btc.paid}\nR$ ${btc.average}/BTC\n\n💰 ${eth.executed} ETH for R$ ${eth.paid}\nR$ ${eth.average}/ETH`;
    await telegramService.sendMessage(message);

    const msg = `🕒 Next run: ${job?.nextDate()}`;
    console.log(msg);
    await telegramService.sendMessage(msg);
  } catch (error) {
    console.error('💰 Error while auto-buying:', error);
  }
};

// Runs every 2 hours
job = new CronJob('0 */2 * * *', task);

const start = async () => {
  job.start();
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
