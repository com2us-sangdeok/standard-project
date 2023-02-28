import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameApiModule } from './game-api/game-api.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConvertPoolEntity } from './game-api/repository/convert-pool.entitty';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { getLogFormat, typeOrmTransports } from './common/logger/winston.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import DatabaseLogger from './common/logger/database.logger';
import { RequestContextMiddleware } from './middleware/request-context.middleware';
import {APP_INTERCEPTOR} from "@nestjs/core";
import {ResponseInterceptor} from "./interceptor/response.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    TerminusModule,
    HttpModule,
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        format: getLogFormat(process.env.NODE_ENV),
        transports: typeOrmTransports(process.env.NODE_ENV, configService),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [ConvertPoolEntity],
          // synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: true,
          logger: new DatabaseLogger(process.env.NODE_ENV),
        } as TypeOrmModuleAsyncOptions;
      },
      inject: [ConfigService],
    }),
    GameApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
