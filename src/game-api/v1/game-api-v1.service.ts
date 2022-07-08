import {Injectable, Inject, InternalServerErrorException} from '@nestjs/common';
import { BlockchainClient } from '@blockchain/chain-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { ConvertPoolEntity } from '../repository/convert-pool.entitty';
import { Repository } from 'typeorm';
import { GameApiV1ConvertPoolDto } from './dto/game-api-v1.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
    const convertPoolEntity = new ConvertPoolEntity();
    convertPoolEntity.appName = createUserDto.appName;
    convertPoolEntity.lowerGameCurrency = createUserDto.lowerGameCurrency;
    convertPoolEntity.gameToken = createUserDto.gameToken;
    convertPoolEntity.upperGameCurrency = createUserDto.upperGameCurrency;
    convertPoolEntity.ctx = createUserDto.ctx;

    this.printLoggerServiceLog(createUserDto)

    return this.usersRepository.save(convertPoolEntity);
  }

    printLoggerServiceLog(dto: GameApiV1ConvertPoolDto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
