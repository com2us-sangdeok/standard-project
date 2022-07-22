import { Injectable } from '@nestjs/common';
import { Msg, Tx } from '@terra-money/terra.js/dist/core';
import { SignMode } from '@terra-money/terra.proto/cosmos/tx/signing/v1beta1/signing';
import { BlockchainService } from '../core/blockchain/blockchain.service';

// tx 생성 수수료 대납
@Injectable()
export class GrantService {
  private bc = this.blockchainService.blockChainClient();
  private lcd = this.blockchainService.lcdClient();

  constructor(private readonly blockchainService: BlockchainService) {}

  public async simulFee(
    payer: string,
    msgs: Msg[],
    signerList: string[],
  ): Promise<any> {
    return await this.bc.client.getFee(msgs, payer, signerList);
  }

  public async grantSign(tx: Tx): Promise<Tx> {
    //TODO HSM교체 예정
    const granterAddress = 'terra1757tkx08n0cqrw7p86ny9lnxsqeth0wgp0em95';
    const granterMnemonic =
      'symbol force gallery make bulk round subway violin worry mixture penalty kingdom boring survey tool fringe patrol sausage hard admit remember broken alien absorb';

    // 대납자의 지갑주소로 sign 하기 위함
    const granterWallet = this.bc.client.wallet(granterMnemonic);

    const granterInfo = await granterWallet.accountNumberAndSequence();

    return granterWallet.key.signTx(tx, {
      chainID: this.lcd.config.chainID,
      signMode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
      sequence: granterInfo.sequence,
      accountNumber: granterInfo.account_number,
    });
  }
}
