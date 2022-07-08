import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameApiModule } from './game-api/game-api.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvertPoolEntity } from './game-api/repository/convert-pool.entitty';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseLogger from "./logger/database-logger";
import {CustomProductionLevel} from "./logger/log-level";
// import getLogLevels from "./logger/log-level";
const dblevel = new CustomProductionLevel("prod"==process.env.NODE_ENV)
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    TerminusModule,
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // fixme: db type을 env 로딩으로 변경
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [ConvertPoolEntity],
        synchronize: Boolean(configService.get('DB_SYNCHRONIZE')),
        //['query']//Boolean(configService.get('DB_LOGGING')),
        logging: ['query', 'error'],//dblevel.getDbLevel()
        // logger: new DatabaseLogger(),
        // logging: true,
        logger: 'file', //'advanced-console'
      }),
      inject: [ConfigService],
    }),
    GameApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
