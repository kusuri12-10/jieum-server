import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/entity/user.entity.js';
import { USER_REPOSITORY, type UserRepository } from '../domain/repository/user.repository.js';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import type { SignupRequestDto } from './dto/signup.request.dto.js';
import type { LoginRequestDto } from './dto/login.request.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupRequestDto) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = User.create({ email: dto.email, passwordHash, nickname: dto.nickname });
    const saved = await this.userRepository.save(user);

    return {
      userId: saved.id,
      nickname: saved.nickname,
      email: saved.email,
    };
  }

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || user.isDeleted()) {
      throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return {
      accessToken,
      refreshToken,
      user: { userId: user.id, nickname: user.nickname, coins: user.coins },
    };
  }

  async logout(_userId: number): Promise<void> {
    // 토큰 블랙리스트가 필요한 경우 여기에 구현
    // 현재는 stateless JWT 방식
  }

  async withdraw(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(user.withdraw());
  }
}
