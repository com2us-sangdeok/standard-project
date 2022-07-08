import { LogLevel } from '@nestjs/common/services/logger.service';
import {LoggerOptions} from "typeorm/logger/LoggerOptions";

export class CustomProductionLevel {
    private isProduction: boolean
    constructor(isProduction: boolean) {
        this.isProduction = isProduction
    }

    getLogLevel(): LogLevel[] {
        if (this.isProduction) {
            return ['log', 'warn', 'error'];
        }
        return ['error', 'warn', 'log', 'verbose', 'debug'];
    }

    getDbLevel(): LoggerOptions[] {
        if (this.isProduction) {
            return [];
        }
        return ['all', true];
    }
}
// function getLogLevels(isProduction: boolean): LogLevel[] {
//     if (isProduction) {
//         return ['log', 'warn', 'error'];
//     }
//     return ['error', 'warn', 'log', 'verbose', 'debug'];
// }

// export default getLogLevels;