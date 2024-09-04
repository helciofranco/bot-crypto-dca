import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import { TelegramService } from '@helciofranco/telegram';
import axios from 'axios';
import type { ChaiInfoData } from './types';
import { query } from './constants';

dotenv.config();

const telegramService = new TelegramService(
  process.env.TELEGRAM_CHAT_ID || '',
  process.env.TELEGRAM_BOT_TOKEN || '',
  process.env.TELEGRAM_ENABLED === 'true',
);
const app = express();
const PORT = 3001;
const blockHeightDiff = 20;

app.use(bodyParser.json());

app.get('/indexer/mainnet', async (_req: Request, res: Response) => {
  try {
    const [{ data: core }, { data: indexer }] = await Promise.all([
      axios.post<ChaiInfoData>(
        process.env.FUEL_CORE_URL || '',
        {
          query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${process.env.FUEL_CORE_API_KEY || ''}`,
          },
        },
      ),
      axios.post<ChaiInfoData>(
        process.env.FUEL_INDEXER_URL || '',
        {
          query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Bearer ${process.env.FUEL_INDEXER_API_KEY || ''}`,
            Authorization: `Basic ${process.env.FUEL_CORE_API_KEY || ''}`,
          },
        },
      ),
    ]);

    const coreHeight = Number(core.data.chain.latestBlock.header.height);
    const indexerHeight = Number(indexer.data.chain.latestBlock.header.height);
    const diff = coreHeight - indexerHeight;

    const response = {
      core: coreHeight,
      indexer: indexerHeight,
      diff,
    };

    if (diff >= blockHeightDiff) {
      res.status(500).json(response);
      return;
    }

    res.json(response);
  } catch (error) {
    console.error('Error checking block sync:', error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  telegramService.sendMessage(
    '🚀 Fuel Indexer Healthchecker have been started',
  );
});
