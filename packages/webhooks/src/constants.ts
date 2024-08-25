import type { AlchemyNetwork } from './types';

export const explorersUrl: Record<AlchemyNetwork, string> = {
  ETH_MAINNET: 'https://etherscan.io',
  ARB_MAINNET: 'https://arbiscan.io',
};

export const networksName: Record<AlchemyNetwork, string> = {
  ETH_MAINNET: 'Ethereum',
  ARB_MAINNET: 'Arbitrum',
};
