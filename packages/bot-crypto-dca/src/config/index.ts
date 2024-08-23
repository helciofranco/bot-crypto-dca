import dotenv from 'dotenv';

dotenv.config();

type Config = {
  telegram: {
    token: string;
    chatId: string;
    enabled: boolean;
  };
  binance: {
    key: string | undefined;
    secret: string | undefined;
    url: string | undefined;
  };
};

export const config: Config = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN as string,
    chatId: process.env.TELEGRAM_CHAT_ID as string,
    enabled: process.env.TELEGRAM_ENABLED === 'true',
  },
  binance: {
    key: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
    url: process.env.BINANCE_API_BASE_URL,
  },
} as const;
