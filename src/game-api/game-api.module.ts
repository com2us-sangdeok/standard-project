import { Module } from '@nestjs/common';
// import { GameApiV1Module } from './v1/game-api-v1.module';
// import { GameApiV2Module } from './v2/game-api-v2.module';
// import { RouterModule } from '@nestjs/core';
import { GameApiV2Controller } from './v2/game-api-v2.controller';
import { GameApiV1Controller } from './v1/game-api-v1.controller';
import { gameApiProviders } from './game-api.providers';
import { GameApiV1Service } from './v1/game-api-v1.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { GameApiV2Service } from './v2/game-api-v2.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvertPoolEntity } from './repository/convert-pool.entitty';
import {WinstonModule} from "nest-winston";

@Module({
  // imports: [
  //   GameApiV1Module,
  //   GameApiV2Module,
  //
  //   RouterModule.register([
  //     {
  //       path: 'v1',
  //       module: GameApiV1Module,
  //     },
  //     {
  //       path: 'v2',
  //       module: GameApiV2Module,
  //     },
  //   ]),
  // ],
  imports: [BlockchainModule, TypeOrmModule.forFeature([ConvertPoolEntity]), WinstonModule],
  controllers: [GameApiV1Controller, GameApiV2Controller],
  providers: [...gameApiProviders, GameApiV1Service, GameApiV2Service],
})
export class GameApiModule {}
