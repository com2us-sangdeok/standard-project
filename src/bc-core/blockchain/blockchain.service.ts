import { Inject, Injectable } from '@nestjs/common';
import { Fee, LCDClient, MnemonicKey } from '@terra-money/terra.js';
import {
  BlockchainClient,
} from '@blockchain/chain-bridge';

// tx 생성 수수료 대납
@Injectable()
export class BlockchainService {
  constructor(
    @Inject('BLOCKCHAIN_CLIENT')
    private bc: BlockchainClient,
  ) {}

  public lcdClient(): LCDClient {
    return this.bc.client.getLcdClient();
  }

  public blockChainClient(): BlockchainClient {
    return this.bc;
  }
}
