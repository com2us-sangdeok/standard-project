// import {Injectable, NestMiddleware} from '@nestjs/common';
// import {NextFunction, Request, Response} from "express";
// import morgan from 'morgan';
// import {CustomLoggerService} from '../loggers/logger.service';
// import {getOsEnv} from '../env';
//
// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//
//   private logger = new CustomLoggerService();
//
//   public use(req: Request, res: Response, next: NextFunction): any {
//     return morgan(getOsEnv('LOG_OUT'), {
//       stream: {
//         write: this.logger.info.bind(this.logger),
//       },
//     })(req, res, next);
//   }
// }

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
class LogsMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction) {
        response.on('finish', () => {
            const { method, originalUrl } = request;
            const { statusCode, statusMessage } = response;

            const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

            if (statusCode >= 500) {
                return this.logger.error(message);
            }

            if (statusCode >= 400) {
                return this.logger.warn(message);
            }

            return this.logger.log(message);
        });

        next();
    }
}

export default LogsMiddleware;