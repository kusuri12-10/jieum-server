import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../common/decorator/current-user.decorator.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const isValid = await this.redisService.isTokenValid(
      payload.sub,
      payload.iat,
    );

    if (!isValid) {
      throw new UnauthorizedException({
        code: ErrorCode.UNAUTHORIZED.code,
        message: ErrorCode.UNAUTHORIZED.message,
      });
    }

    return {
      sub: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
