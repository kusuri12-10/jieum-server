import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filter/global-exception.filter.js';

function buildValidationMessage(errors: ValidationError[]): string {
  const first = errors[0];

  // forbidNonWhitelisted: 허용되지 않은 필드
  if (first.constraints?.['whitelistValidation']) {
    return `허용되지 않는 필드가 포함되어 있습니다: ${first.property}`;
  }

  // 일반 유효성 검사 메시지 (DTO에 정의한 한국어 메시지)
  const message = first.constraints
    ? Object.values(first.constraints)[0]
    : '유효하지 않은 입력값입니다.';

  return message ?? '유효하지 않은 입력값입니다.';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: buildValidationMessage(errors),
        }),
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
