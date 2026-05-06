import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
  isAdmin: boolean;
  iat: number; // 토큰 발급 시각 (Unix timestamp)
  exp: number; // 토큰 만료 시각 (Unix timestamp)
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return request.user;
  },
);
