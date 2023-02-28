import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseMessageKey } from '../decorator/response.decorator';
import { Reflector } from '@nestjs/core';
import { ApiCode } from '../enum/api-status.enum';
import { SUCCESS } from '../decorator/response.constants';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  // constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: ApiCode.OK,
        message: SUCCESS,
        data: data,
      })),
    );

    // const responseMessage =
    //   this.reflector.get<string>(ResponseMessageKey, context.getHandler()) ??
    //   '';
    //
    // return next.handle().pipe(
    //   map((data) => ({
    //     code: context.switchToHttp().getResponse().statusCode,
    //     message: responseMessage,
    //     data,
    //   })),
    // );
  }
}
