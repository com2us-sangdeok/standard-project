import { Module } from '@nestjs/common';
import { coreProviders } from '../core/core.provider';
import { BlockchainModule } from '../core/blockchain/blockchain.module';

import { GrantService } from './grant.service';
import { BlockchainService } from '../core/blockchain/blockchain.service';

@Module({
  imports: [BlockchainModule],
  controllers: [],
  providers: [...coreProviders, GrantService, BlockchainService],
  exports: [GrantService],
})
export class CommonModule {}
