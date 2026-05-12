import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { HttpAdapterHost } from '@nestjs/core';

export enum ErrorCode {
  // 通用错误
  SUCCESS = 0,
  SYSTEM_ERROR = 1000,
  PARAM_ERROR = 1001,
  UNAUTHORIZED = 1002,
  FORBIDDEN = 1003,
  NOT_FOUND = 1004,

  // 认证错误
  WECHAT_LOGIN_FAILED = 2001,
  TOKEN_EXPIRED = 2002,
  TOKEN_INVALID = 2003,

  // 审核错误
  CERTIFICATE_PENDING = 3001,
  CERTIFICATE_REJECTED = 3002,
  CERTIFICATE_NOT_AUDITED = 3003,

  // 路线错误
  ROUTE_NOT_FOUND = 4001,
  ROUTE_FULL = 4002,
  ROUTE_EXPIRED = 4003,
  ROUTE_INVALID = 4004,

  // 订单错误
  ORDER_NOT_FOUND = 5001,
  ORDER_STATUS_INVALID = 5002,
  ORDER_CANNOT_CANCEL = 5003,
  ORDER_NOT_CONFIRMED = 5004,
  ORDER_ALREADY_EXISTS = 5005,

  // 企业错误
  COMPANY_NOT_FOUND = 6001,
  COMPANY_ALREADY_JOINED = 6002,

  // 评价错误
  REVIEW_ALREADY_EXISTS = 7001,
  REVIEW_NOT_ALLOWED = 7002,
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorCode = ErrorCode.SYSTEM_ERROR;
    let message = '系统错误，请稍后重试';
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as any;
        errorCode = resp.code || ErrorCode.SYSTEM_ERROR;
        message = resp.message || exception.message;
      } else {
        message = exceptionResponse as string || exception.message;
      }
    }

    const apiResponse: ApiResponse = {
      code: errorCode,
      message,
    };

    httpAdapter.reply(response, apiResponse, httpStatus);
  }
}
