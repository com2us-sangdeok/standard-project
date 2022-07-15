import {Injectable, Inject, InternalServerErrorException} from '@nestjs/common';
import { BlockchainClient } from '@blockchain/chain-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { ConvertPoolEntity } from '../repository/convert-pool.entitty';
import { Repository } from 'typeorm';
import { GameApiV1ConvertPoolDto } from './dto/game-api-v1.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {RequestContext} from "../../context/request.context";

@Injectable()
export class GameApiV1Service {
  constructor(
    private configService: ConfigService,
    @Inject('BLOCKCHAIN_CLIENT')
    private bc: BlockchainClient,
    @InjectRepository(ConvertPoolEntity)
    private readonly usersRepository: Repository<ConvertPoolEntity>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  async createAccount(address: string): Promise<any> {
    return this.bc.client.account(address);
  }

  create(createUserDto: GameApiV1ConvertPoolDto): Promise<ConvertPoolEntity> {
    RequestContext.set('user-id', 'alice');
    const userId: string = RequestContext.get('user-id');
    this.logger.log(`>>>>>>>>>: user-id : ${RequestContext.get('user-id')}`);
    this.logger.log(`>>>>>>>>>: ${RequestContext.TXID} : ${RequestContext.get(RequestContext.TXID)}`);
    this.logger.log(`>>>>>>>>>: ${RequestContext.UNIQUE_KEY} : ${RequestContext.get(RequestContext.UNIQUE_KEY)}`);
    this.logger.log(`>>>>>>>>>: ${RequestContext.NAMESPACE} : ${RequestContext.get(RequestContext.NAMESPACE)}`);


    // db test
    const convertPoolEntity = new ConvertPoolEntity();
    convertPoolEntity.appName = createUserDto.appName;
    convertPoolEntity.lowerGameCurrency = createUserDto.lowerGameCurrency;
    convertPoolEntity.gameToken = createUserDto.gameToken;
    convertPoolEntity.upperGameCurrency = createUserDto.upperGameCurrency;
    convertPoolEntity.ctx = createUserDto.ctx;

    // log test
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(convertPoolEntity), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(convertPoolEntity));
    this.logger.log('log: ' + JSON.stringify(convertPoolEntity));
    this.logger.verbose('verbose: ' + JSON.stringify(convertPoolEntity));
    this.logger.debug('debug: ' + JSON.stringify(convertPoolEntity));

    return this.usersRepository.save(convertPoolEntity);
  }

}
