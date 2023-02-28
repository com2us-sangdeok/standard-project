import { Injectable } from '@nestjs/common';
import { createNamespace, getNamespace, Namespace } from 'cls-hooked';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RequestContext } from '../common/context/request.context';

@Injectable()
export class AxiosClientUtil {
  private namespace: Namespace;

  constructor(private httpService: HttpService) {
    this.namespace =
      getNamespace(RequestContext.NAMESPACE) ||
      createNamespace(RequestContext.NAMESPACE);
  }

  public async get(
    url: string,
    headerOpts?: any,
  ): Promise<AxiosResponseDto<any>> {
    const headers = this.setHeaderData(headerOpts);
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers: headers }),
      );

      return new AxiosResponseDto<any>(response.status, '', response.data);
    } catch (e) {
      throw e;
    }
  }

  public async post(url: string, data?: any, headerOpts?: any): Promise<any> {
    const headers = this.setHeaderData(headerOpts);
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers: headers }),
      );

      return new AxiosResponseDto<any>(response.status, '', response.data);
    } catch (e) {
      throw e;
    }
  }

  public async put(url: string, data?: any, headerOpts?: any): Promise<any> {
    const headers = this.setHeaderData(headerOpts);
    try {
      const response = await firstValueFrom(
        this.httpService.put(url, data, { headers: headers }),
      );

      return new AxiosResponseDto<any>(response.status, '', response.data);
    } catch (e) {
      throw e;
    }
  }

  public async patch(url: string, data?: any, headerOpts?: any): Promise<any> {
    const headers = this.setHeaderData(headerOpts);
    try {
      const response = await firstValueFrom(
        this.httpService.patch(url, data, { headers: headers }),
      );

      return new AxiosResponseDto<any>(response.status, '', response.data);
    } catch (e) {
      throw e;
    }
  }

  private setHeaderData(headerOptions: any): any {
    const correlationId =
      this.namespace.get(RequestContext.CORRELATION_ID) ??
      RequestContext.uniqueKeyGenerator();
    const header = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip,deflate,compress',
      correlationId: correlationId,
    };
    Object.assign(header, headerOptions);
    return header;
  }
}

export class AxiosResponseDto<T> {
  constructor(status: number, string, data?: T) {
    this.status = status;
    this.body = data;
  }

  status: number;
  body?: T;
}
