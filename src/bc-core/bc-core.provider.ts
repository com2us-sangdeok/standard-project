import { BlockchainClient } from '@blockchain/chain-bridge';

export const bcCoreProviders = [
  {
    provide: 'BLOCKCHAIN_CLIENT',
    useFactory: (blockchainClient: BlockchainClient) => blockchainClient,
    inject: ['CHAIN_SOURCE'],
  },
];
