import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'object' && 'code' in (body as object)) {
        // BusinessException — 이미 { code, message } 형태
        response.status(status).json(body);
      } else if (
        typeof body === 'object' &&
        'message' in (body as object) &&
        Array.isArray((body as Record<string, unknown>)['message'])
      ) {
        // ValidationPipe 오류 — message 배열을 첫 번째 항목으로 노출
        const messages = (body as Record<string, unknown>)['message'] as string[];
        response.status(status).json({
          code: 'VALIDATION_ERROR',
          message: messages[0],
        });
      } else {
        response.status(status).json({
          code: 'BAD_REQUEST',
          message: typeof body === 'string' ? body : '잘못된 요청입니다.',
        });
      }
      return;
    }

    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 오류가 발생했습니다.',
    });
  }
}
