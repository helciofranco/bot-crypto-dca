import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import type { PayoutWebhookData } from './types';
import { TelegramService } from '@helciofranco/telegram';

dotenv.config();

const telegramService = new TelegramService(
  process.env.TELEGRAM_CHAT_ID || '',
  process.env.TELEGRAM_BOT_TOKEN || '',
  process.env.TELEGRAM_ENABLED === 'true',
);
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/webhook', (req: Request, res: Response) => {
  const payload: PayoutWebhookData = req.body;
  handlePayout(payload);
  res.status(200).send('Webhook received');
});

function handlePayout(data: PayoutWebhookData) {
  console.log('Handling payout:', data);
  const msg = `
    💰 Status: ${data.status}\n
    From ${data.sender_wallet_address}\n
    Hash: ${data.tracking_complete.transaction_hash}\n
  `.trim();
  telegramService.sendMessage(msg);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  telegramService.sendMessage('🚀 Webhooks have been started');
});
