import { Injectable, Inject } from '@nestjs/common';
import { BlockchainClient } from '@blockchain/chain-bridge';

@Injectable()
export class GameApiV2Service {
  constructor(
    @Inject('BLOCKCHAIN_CLIENT')
    private bc: BlockchainClient,
  ) {}

  async createAccount(address: string): Promise<any> {
    return this.bc.client.account(address);
  }
}
