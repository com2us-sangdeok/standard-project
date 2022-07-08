import { Module } from '@nestjs/common';
import { blockchainProviders } from './blockchain.providers';

@Module({
  providers: [...blockchainProviders],
  exports: [...blockchainProviders],
})
export class BlockchainModule {}
