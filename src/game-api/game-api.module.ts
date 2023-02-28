import { Module } from '@nestjs/common';
// import { GameApiV1Module } from './v1/game-api-v1.modules';
// import { GameApiV2Module } from './v2/game-api-v2.modules';
// import { RouterModule } from '@nestjs/bc-core';
import { GameApiV2Controller } from './v2/game-api-v2.controller';
import { GameApiV1Controller } from './v1/game-api-v1.controller';
// import { gameApiProviders } from './game-api.providers';
import { GameApiV1Service } from './v1/game-api-v1.service';
import { BlockchainModule } from '../bc-core/blockchain/blockchain.module';
import { GameApiV2Service } from './v2/game-api-v2.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvertPoolEntity } from './repository/convert-pool.entitty';
import { WinstonModule } from 'nest-winston';
import { BlockchainService } from '../bc-core/blockchain/blockchain.service';
import { bcCoreProviders } from '../bc-core/bc-core.provider';
import { AxiosClientUtil } from '../util/axios-client.util';
import {HttpModule} from "@nestjs/axios";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  // imports: [
  //   GameApiV1Module,
  //   GameApiV2Module,
  //
  //   RouterModule.register([
  //     {
  //       path: 'v1',
  //       modules: GameApiV1Module,
  //     },
  //     {
  //       path: 'v2',
  //       modules: GameApiV2Module,
  //     },
  //   ]),
  // ],
  imports: [
    BlockchainModule,
    TypeOrmModule.forFeature([ConvertPoolEntity]),
    WinstonModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [GameApiV1Controller, GameApiV2Controller],
  providers: [
    ...bcCoreProviders,
    GameApiV1Service,
    GameApiV2Service,
    BlockchainService,
    AxiosClientUtil,
  ],
})
export class GameApiModule {}
