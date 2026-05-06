import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { ErrorCode } from '../exception/error-code.js';
import type { JwtPayload } from '../decorator/current-user.decorator.js';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  handleRequest<TUser>(err: Error, user: TUser): TUser {
    const validUser = super.handleRequest(err, user);
    const payload = validUser as unknown as JwtPayload;
    if (!payload.isAdmin) {
      throw new ForbiddenException({
        code: ErrorCode.FORBIDDEN.code,
        message: ErrorCode.FORBIDDEN.message,
      });
    }
    return validUser;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
