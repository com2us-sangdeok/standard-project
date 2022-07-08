import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {CustomProductionLevel} from "./logger/log-level";
// import getLogLevels from "./logger/log-level";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

/*
  todo:
    + Config
    + DB Connection
    + Blockchain Connection
    Versioning
    + Swagger
    Security (auth)
    Logger
    Exception
    Error
    File
    Filter
    Transform pipe
    validation pipe / class validation
    http client
    distributed tracing (OpenTracing, Jaeger)
    rate limiting (@nestjs/throttler )
    Request context
    gRPC
 */
async function bootstrap() {
  const loglevel = new CustomProductionLevel(process.env.NODE_ENV === 'prod');
  const appOptions = {
    cors: true,
    bodyParser: true,
    // logger: getLogLevels(process.env.NODE_ENV === 'prod')
    // logger: loglevel.getLogLevel()
  };
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableVersioning({
    type: VersioningType.URI,
    //fixme: default 설정으로 모든 contoller 버전 컨트롤
    // defaultVersion: [VERSION_NEUTRAL],
    // defaultVersion: '2',
  });

  const options = new DocumentBuilder()
      .setTitle('Standard Project')
      .setDescription('Blockchain API description')
      .setVersion('1.0')
      // .addTag('blockchain')
      // .addBearerAuth()
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('SWAGGER_PATH'), app, document);

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
