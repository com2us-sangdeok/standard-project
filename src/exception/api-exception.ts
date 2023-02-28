import { HttpException } from '@nestjs/common';
import { ApiCode } from '../enum/api-status.enum';

export class ApiException extends HttpException {
  constructor(message: any, error: any, statusCode: ApiCode) {
    super(HttpException.createBody(message, error, statusCode), statusCode);
  }
}
