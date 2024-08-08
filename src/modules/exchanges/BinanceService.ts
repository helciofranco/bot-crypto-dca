import type { Buy, BuyParams, Exchange } from './types';
import { config } from '../../config';
import { createHmac } from 'crypto';
import axios, { type AxiosInstance } from 'axios';

type BinanceBuy = {
  executedQty: string;
  cummulativeQuoteQty: string;
};

export class BinanceService implements Exchange {
  private secret: string;
  private client: AxiosInstance;

  constructor() {
    const { binance } = config;

    this.secret = binance.secret ?? '';
    this.client = axios.create({
      baseURL: binance.url,
      headers: {
        'X-MBX-APIKEY': binance.key,
      },
    });
  }

  async buy({ base, quote, amount }: BuyParams): Promise<Buy> {
    const symbol = `${base}${quote}`;
    const timestamp = Date.now();
    const queryString = `symbol=${symbol}&side=BUY&type=MARKET&quoteOrderQty=${amount}&timestamp=${timestamp}`;
    const signature = this.createSignature(queryString, this.secret);
    const url = `/order?${queryString}&signature=${signature}`;

    const { data } = await this.client.post<BinanceBuy>(url);
    const qtd = Number.parseFloat(data.cummulativeQuoteQty);

    return {
      executed: data.executedQty,
      paid: qtd.toFixed(2),
      average: (Number.parseFloat(data.executedQty) / qtd).toFixed(2),
    };
  }

  private createSignature(queryString: string, secretKey: string): string {
    return createHmac('sha256', secretKey).update(queryString).digest('hex');
  }
}
