import { ForbiddenError } from '@casl/ability';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      if (exception.getResponse()) {
        message = exception.getResponse()['message'];
        error = exception.getResponse()['error'];
        if (!error) {
          error = message;
        }
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof ForbiddenError) {
      const exc = new ForbiddenException();
      httpStatus = exc.getStatus();
      // httpStatus = exception.getStatus();
      message = exception.message;
      error = exc.getResponse()['message'];
    } else if (exception instanceof EntityNotFoundError) {
      const exc = new NotFoundException();
      httpStatus = exc.getStatus();
      // httpStatus = exception.getStatus();
      message = exception.message;
      error = exc.getResponse()['message'];
    } else {
      console.error(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
