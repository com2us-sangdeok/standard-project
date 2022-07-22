import { Test, TestingModule } from '@nestjs/testing';
import {
  Fee,
  LCDClient,
  MnemonicKey,
  MsgSend,
  Wallet,
  Coins,
} from '@terra-money/terra.js';
import { Msg, Tx } from '@terra-money/terra.js/dist/core';
import { Pagination } from '@terra-money/terra.js/dist/client/lcd/APIRequester';
import { BlockchainClient } from '@blockchain/chain-bridge';
import { GrantService } from './grant.service';
import { BlockchainService } from '../core/blockchain/blockchain.service';
import { coreProviders } from '../core/core.provider';
import { BlockchainModule } from '../core/blockchain/blockchain.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('GranterService', () => {
  const sender = {
    address: 'terra14vqqls4t0np2g92lh0h92934ntwk0gaxqhn7wc',
    mnemonic:
      'salute actor hen river distance bus scissors bike blush return purity laugh remind rough magic work drum able car embrace rather credit blue add',
  };

  const receiver = {
    address: 'terra1dpau8af8qu3cpturacqu26uwnn2wagfqgu3c4p',
    mnemonic:
      'course patient raw vapor evoke survey together math decorate mango use fence abuse column coach tree fine wedding mixture educate acquire inject script milk',
  };

  const granter = {
    address: 'terra1757tkx08n0cqrw7p86ny9lnxsqeth0wgp0em95',
    mnemonic:
      'symbol force gallery make bulk round subway violin worry mixture penalty kingdom boring survey tool fringe patrol sausage hard admit remember broken alien absorb',
  };
  let granterService: GrantService;
  let walletService: BlockchainService;
  let lcd: LCDClient;
  let bc: BlockchainClient;
  beforeEach(async () => {
    process.env.BC_TYPE = 'terra';
    process.env.BC_NODE_URL = 'http://172.19.95.139:1317';
    process.env.BC_CHAIN_ID = 'localterra';

    console.log(process.env);
    const app: TestingModule = await Test.createTestingModule({
      imports: [BlockchainModule],
      controllers: [],
      providers: [...coreProviders, GrantService, BlockchainService],
      exports: [],
    }).compile();

    granterService = app.get<GrantService>(GrantService);
    walletService = app.get<BlockchainService>(BlockchainService);
    lcd = walletService.lcdClient();
    bc = walletService.blockChainClient();
  });

  describe('transfer coin with granter', () => {
    let senderWallet: Wallet;
    let senderWalletInfo;
    let tx: Tx;
    let simulFee: Fee;
    let msg: Msg;

    let senderBalance: [Coins, Pagination];
    let receiverBalance: [Coins, Pagination];
    let granterBalance: [Coins, Pagination];

    let senderLuna;
    let receiverLuna;
    let granterUusd;

    it('before : check balance', async () => {
      senderBalance = await lcd.bank.balance(sender.address);
      receiverBalance = await lcd.bank.balance(receiver.address);
      granterBalance = await lcd.bank.balance(granter.address);

      senderLuna = {
        denom: senderBalance[0].get('uluna').denom,
        amount: senderBalance[0].get('uluna').amount,
      };
      receiverLuna = {
        denom: receiverBalance[0].get('uluna').denom,
        amount: receiverBalance[0].get('uluna').amount,
      };
      granterUusd = {
        denom: granterBalance[0].get('uusd').denom,
        amount: granterBalance[0].get('uusd').amount,
      };

      console.log('sender', senderLuna.amount + senderLuna.denom);
      console.log('receiverBalance', receiverLuna.amount + receiverLuna.denom);
      console.log('granderBalance', granterUusd.amount, granterUusd.denom);
    });

    it('cal simulFee', async () => {
      msg = await new MsgSend(
        sender.address,
        receiver.address,
        '100000000uluna',
      );

      //msg 수수료 계산
      simulFee = await granterService.simulFee(
        granter.address,
        [msg],
        [sender.address],
      );

      expect(simulFee).not.toBeNull();
      console.log('simulFee', simulFee);
    });

    it('create unSigned Tx', async () => {
      // sign 빈 tx 생성
      tx = await lcd.tx.create([], { msgs: [msg], fee: simulFee });

      expect(tx).not.toBeNull();
      console.log('empty Tx', tx);
    });

    let signedTx: Tx;

    it('create signedTx', async () => {
      senderWallet = lcd.wallet(new MnemonicKey({ mnemonic: sender.mnemonic }));
      senderWalletInfo = await senderWallet.accountNumberAndSequence();

      //sender sign
      tx = await senderWallet.key.signTx(tx, {
        chainID: lcd.config.chainID,
        signMode: 127,
        sequence: senderWalletInfo.sequence,
        accountNumber: senderWalletInfo.account_number,
      });

      //granter sign
      signedTx = await granterService.grantSign(tx);

      expect(signedTx).not.toBeNull();
      console.log('signedTx', signedTx);
    });

    it('broadCast', async () => {
      const hash = await lcd.tx.broadcast(signedTx);
      expect(hash).not.toBeNull();
      console.log(hash);
    });

    it('after : check balance', async () => {
      const senderBalance1 = await lcd.bank.balance(sender.address);
      const receiverBalance1 = await lcd.bank.balance(receiver.address);
      const granterBalance1 = await lcd.bank.balance(granter.address);

      const senderLuna1 = {
        denom: senderBalance1[0].get('uluna').denom,
        amount: senderBalance1[0].get('uluna').amount,
      };
      const receiverLuna1 = {
        denom: receiverBalance1[0].get('uluna').denom,
        amount: receiverBalance1[0].get('uluna').amount,
      };
      const granterUusd1 = {
        denom: granterBalance1[0].get('uusd').denom,
        amount: granterBalance1[0].get('uusd').amount,
      };

      expect(senderLuna.amount).not.toBe(senderLuna1.amount);
      expect(senderLuna.amount).not.toBe(receiverLuna1.amount);
      expect(granterUusd.amount).not.toBe(granterUusd1.amount);

      console.log('sender', senderLuna.amount + senderLuna.denom);
      console.log('receiverBalance', receiverLuna.amount + receiverLuna.denom);
      console.log('granderBalance', granterUusd.amount, granterUusd.denom);
    });
  });
});
