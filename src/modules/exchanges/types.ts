export type Buy = {
  executed: string;
  paid: string;
  average: string;
};

export enum Asset {
  Bitcoin = 'BTC',
  Ethereum = 'ETH',
  UsdTether = 'USDT',
}

export enum Quote {
  BRL = 'BRL',
}

export type BuyParams = {
  base: Asset;
  quote: Quote;
  amount: number;
};

export interface Exchange {
  buy(params: BuyParams): Promise<Buy>;
}
