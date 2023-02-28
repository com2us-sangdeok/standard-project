import { ApiCode } from '../enum/api-status.enum';
import { ApiException } from './api-exception';

export class ExternalServerException extends ApiException {
  constructor(message: any, error = 'External server call failed') {
    super(message, error, ApiCode.ERROR);
  }
}
