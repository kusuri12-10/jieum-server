import { HttpException, HttpStatus } from '@nestjs/common';
import type { ErrorCodeValue } from './error-code.js';

export class BusinessException extends HttpException {
  constructor(
    errorCode: ErrorCodeValue,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code: errorCode.code, message: errorCode.message }, status);
  }
}
