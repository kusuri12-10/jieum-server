# 시스템 구조

## 기술 스택

| 항목 | 내용 |
|---|---|
| 런타임 | Node.js |
| 프레임워크 | NestJS 11 (Express 어댑터) |
| 언어 | TypeScript 5 (target ES2023, nodenext 모듈 해석) |
| ORM | TypeORM |
| 데이터베이스 | MySQL |
| 인증 | JWT (Access Token 15m / Refresh Token 7d) |
| 캐시/세션 | Redis (ioredis) — 로그아웃 토큰 무효화 |
| 유효성 검사 | class-validator + class-transformer |
| 패스워드 해시 | bcrypt |

---

## 아키텍처

**레이어드 아키텍처 + DDD(Domain-Driven Design)** 를 적용합니다.

```
Presentation  →  Application  →  Domain  ←  Infrastructure
(Controller)     (Service)      (Entity,      (ORM Entity,
                 (DTO)          Repository     Repository
                                Interface)     Impl)
```

### 레이어 역할

| 레이어 | 디렉토리 | 역할 |
|---|---|---|
| Presentation | `presentation/` | HTTP 요청 수신, 응답 반환. 비즈니스 로직 없음 |
| Application | `application/` | 유스케이스 오케스트레이션, DTO 정의 |
| Domain | `domain/` | 순수 비즈니스 엔티티 및 레포지토리 인터페이스 (프레임워크 의존성 없음) |
| Infrastructure | `infrastructure/` | TypeORM ORM 엔티티, 레포지토리 구현체 |

---

## 디렉토리 구조

```
src/
├── main.ts                              # 앱 진입점 (ValidationPipe, GlobalExceptionFilter 등록)
├── app.module.ts                        # 루트 모듈 (TypeORM, ConfigModule, 전체 모듈 등록)
│
├── redis/                               # Redis 전역 모듈
│   ├── redis.constants.ts               # REDIS_CLIENT Symbol 토큰
│   ├── redis.module.ts                  # @Global() — ioredis 클라이언트 등록 및 RedisService export
│   └── redis.service.ts                 # setLogoutTime / isTokenValid
│
├── common/                              # 공통 유틸리티
│   ├── decorator/
│   │   └── current-user.decorator.ts   # @CurrentUser() — JWT payload 파라미터 데코레이터
│   ├── exception/
│   │   ├── error-code.ts               # 에러 코드 상수 정의
│   │   └── business.exception.ts       # 도메인 예외 클래스 (HttpException 래핑)
│   ├── filter/
│   │   └── global-exception.filter.ts  # 전역 예외 필터 (에러 응답 포맷 통일)
│   └── guard/
│       └── jwt-auth.guard.ts           # JWT 인증 가드
│
├── auth/                                # 인증 모듈
│   ├── domain/
│   │   ├── entity/user.entity.ts       # User 도메인 엔티티
│   │   └── repository/user.repository.ts  # UserRepository 인터페이스
│   ├── application/
│   │   ├── dto/signup.request.dto.ts
│   │   ├── dto/login.request.dto.ts
│   │   └── auth.service.ts             # 회원가입, 로그인, 로그아웃, 탈퇴 유스케이스
│   ├── infrastructure/
│   │   ├── orm/user.orm-entity.ts      # TypeORM USER 테이블 매핑
│   │   ├── repository/user.repository.impl.ts
│   │   └── jwt.strategy.ts             # Passport JWT 전략
│   ├── presentation/auth.controller.ts
│   └── auth.module.ts
│
├── mail/                                # 우편함 모듈
│   ├── domain/
│   │   ├── entity/daily-question.entity.ts
│   │   ├── entity/reply.entity.ts
│   │   ├── repository/daily-question.repository.ts
│   │   └── repository/reply.repository.ts
│   ├── application/
│   │   ├── dto/submit-reply.request.dto.ts
│   │   ├── dto/reply-all.query.dto.ts
│   │   └── mail.service.ts             # 질문 조회, 답신 제출(코인 지급), 목록 조회
│   ├── infrastructure/
│   │   ├── orm/daily-question.orm-entity.ts
│   │   ├── orm/reply.orm-entity.ts
│   │   ├── repository/daily-question.repository.impl.ts
│   │   └── repository/reply.repository.impl.ts
│   ├── presentation/mail.controller.ts
│   └── mail.module.ts
│
├── main-screen/                         # 메인화면 모듈
│   ├── domain/
│   │   ├── entity/streak.entity.ts
│   │   └── repository/streak.repository.ts
│   ├── application/
│   │   ├── dto/update-streak-goal.request.dto.ts
│   │   └── main-screen.service.ts      # 메인화면 집계, 스트릭 목표 변경
│   ├── infrastructure/
│   │   ├── orm/streak.orm-entity.ts
│   │   └── repository/streak.repository.impl.ts
│   ├── presentation/main-screen.controller.ts
│   └── main-screen.module.ts
│
├── stat/                                # 통계 모듈
│   ├── application/stat.service.ts     # 총 답변 수, 최장/최단 답변 조회
│   ├── presentation/stat.controller.ts
│   └── stat.module.ts
│
├── shop/                                # 상점 모듈
│   ├── domain/
│   │   ├── entity/product.entity.ts
│   │   ├── entity/purchase.entity.ts
│   │   ├── repository/product.repository.ts
│   │   └── repository/purchase.repository.ts
│   ├── application/
│   │   ├── dto/product-list.query.dto.ts
│   │   └── shop.service.ts             # 상품 목록/상세, 구매(코인 차감, 중복 방지)
│   ├── infrastructure/
│   │   ├── orm/product.orm-entity.ts
│   │   ├── orm/purchase.orm-entity.ts
│   │   ├── repository/product.repository.impl.ts
│   │   └── repository/purchase.repository.impl.ts
│   ├── presentation/shop.controller.ts
│   └── shop.module.ts
│
└── theme/                               # 테마 모듈
    ├── domain/
    │   ├── entity/theme-item.entity.ts
    │   ├── entity/user-theme.entity.ts
    │   ├── repository/theme-item.repository.ts
    │   └── repository/user-theme.repository.ts
    ├── application/theme.service.ts     # 테마 목록(잠금 여부), 테마 변경(구매 여부 확인)
    ├── infrastructure/
    │   ├── orm/theme-item.orm-entity.ts
    │   ├── orm/user-theme.orm-entity.ts
    │   ├── repository/theme-item.repository.impl.ts
    │   └── repository/user-theme.repository.impl.ts
    ├── presentation/theme.controller.ts
    └── theme.module.ts
```

---

## 모듈 의존 관계

```
RedisModule (@Global)          ← 모든 모듈에서 주입 가능

MainScreenModule
  ├── AuthModule        (UserRepository)
  └── ThemeModule       (UserThemeRepository)
        └── ShopModule  (PurchaseRepository)

MailModule
  └── AuthModule        (UserRepository — 코인 지급)

StatModule
  └── MailModule        (ReplyRepository — 통계 집계)
```

### Redis 활용

| 기능 | 키 패턴 | TTL |
|---|---|---|
| 로그아웃 시각 기록 | `auth:logout:{userId}` | 7일 (Refresh Token 만료 주기와 동일) |

- 로그아웃 시 해당 키에 `iat` 타임스탬프를 저장
- `JwtStrategy.validate()` 에서 `iat > storedLogoutTime` 을 검사 → 로그아웃 이후 발급된 토큰은 모두 거부

---

## 공통 규칙

### 인증
모든 인증 필요 엔드포인트는 `JwtAuthGuard`를 적용합니다.

```
Authorization: Bearer {accessToken}
```

### 에러 응답 포맷
```json
{ "code": "ERROR_CODE", "message": "설명" }
```

### 에러 코드 목록

| 코드 | HTTP | 설명 |
|---|---|---|
| `EMAIL_ALREADY_EXISTS` | 409 | 이미 사용 중인 이메일 |
| `INVALID_CREDENTIALS` | 401 | 이메일/비밀번호 불일치 |
| `UNAUTHORIZED` | 401 | 인증 토큰 없음/만료 |
| `USER_NOT_FOUND` | 404 | 사용자 없음 |
| `QUESTION_NOT_FOUND` | 404 | 오늘의 질문 없음 |
| `ALREADY_REPLIED` | 409 | 오늘 이미 답신 완료 |
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |
| `INSUFFICIENT_COINS` | 400 | 코인 부족 |
| `ALREADY_PURCHASED` | 409 | 이미 구매한 상품 |
| `THEME_NOT_FOUND` | 404 | 테마 없음 |
| `THEME_NOT_UNLOCKED` | 403 | 미구매 테마 선택 시도 |

### DDD 원칙
- **도메인 엔티티**: 순수 TypeScript 클래스. 프레임워크 데코레이터 없음. 비즈니스 로직 포함 (`user.withdraw()`, `user.withCoins()` 등)
- **레포지토리 인터페이스**: 도메인 레이어에 정의 → 의존성 역전(DIP) 적용
- **ORM 엔티티**: 인프라 레이어에만 존재. `toDomain()` / `fromDomain()` 매핑 메서드 보유
- **레포지토리 바인딩**: NestJS DI 컨테이너에서 `Symbol` 토큰으로 인터페이스와 구현체 연결
