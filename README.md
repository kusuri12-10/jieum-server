# 지음 (Jieum) — 백엔드 API

> 하루 한 번 나와 대화하는 시간, 지음

지음(Jieum)의 백엔드 서버입니다.  
사용자는 오늘의 질문에 답변을 남기고, 스트릭을 이어가며 코인을 모아 상점에서 테마 아이템을 구매할 수 있습니다.

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 런타임 | Node.js |
| 프레임워크 | NestJS 11 (Express) |
| 언어 | TypeScript 5 |
| ORM | TypeORM 0.3 |
| DB | MySQL |
| 캐시/세션 | Redis (ioredis) |
| 인증 | JWT (Access + Refresh Token) |
| 패스워드 | bcrypt |

---

## 실행 방법

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
# DB
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=jieum

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 코인
REPLY_COIN_REWARD=10

NODE_ENV=development
```

### 개발 서버 실행

```bash
npm install
npm run start:dev
```

### 빌드 및 프로덕션 실행

```bash
npm run build
npm run start:prod
```

### 테스트

```bash
npm test           # 단위 테스트
npm run test:cov   # 커버리지 포함
npm run test:e2e   # E2E 테스트
```

### 코드 품질

```bash
npm run lint       # ESLint (자동 수정)
npm run format     # Prettier
```

---

## 아키텍처

도메인 주도 설계(DDD) + 레이어드 아키텍처를 적용했습니다.

```
src/
  auth/           # 인증 (회원가입, 로그인, 로그아웃)
  user/           # 마이페이지 (닉네임 변경, 회원탈퇴)
  mail/           # 우편함 (오늘의 질문, 답신)
  main-screen/    # 메인화면 (코인, 스트릭, 테마 현황)
  stat/           # 통계 (답변 수, 최장/최단 답변)
  shop/           # 상점 (상품 목록, 구매)
  theme/          # 테마 (테마 목록, 변경)
  admin/          # 관리자
  │  question/    # 질문 관리
  │  user/        # 유저 조회
  │  product/     # 상품 관리
  │  theme/       # 테마 아이템 관리
  redis/          # Redis 서비스
  common/         # 공통 (Guard, Decorator, Exception)
```

각 모듈은 다음 레이어로 구성됩니다.

```
{module}/
  domain/
    entity/       # 도메인 엔티티 (순수 비즈니스 로직)
    repository/   # 레포지토리 인터페이스 (Symbol 토큰 DI)
  infrastructure/
    orm/          # TypeORM 엔티티
    repository/   # 레포지토리 구현체
  application/
    dto/          # Request DTO (class-validator)
    *.service.ts  # 유즈케이스
  presentation/
    *.controller.ts
```

---

## API 엔드포인트

모든 인증 필요 엔드포인트는 `Authorization: Bearer {accessToken}` 헤더가 필요합니다.

### Auth

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| POST | `/signup` | - | 회원가입 |
| POST | `/login` | - | 로그인, JWT 발급 |
| POST | `/logout` | 필요 | 로그아웃, 토큰 무효화 |

### User (마이페이지)

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| PATCH | `/user/nickname` | 필요 | 닉네임 변경 |
| DELETE | `/user` | 필요 | 회원탈퇴 (soft delete) |

### Mail

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/mail/today` | 필요 | 오늘의 질문 조회 |
| POST | `/mail/today/reply` | 필요 | 답신 제출 (코인 +10) |
| GET | `/reply-all` | 필요 | 내 전체 답신 목록 (페이지네이션) |

### Main Screen

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/main` | 필요 | 코인, 스트릭, 장착 테마 조회 |
| PATCH | `/streak` | 필요 | 스트릭 목표 일수 변경 |

### Stat

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/stat` | 필요 | 총 답변 수, 최장/최단 답변 |

### Shop

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/products` | 필요 | 상품 목록 (카테고리 필터, 페이지네이션) |
| GET | `/products/:id` | 필요 | 상품 상세 |
| POST | `/products/:id` | 필요 | 상품 구매 |

### Theme

| Method | Endpoint | 인증 | 설명 |
|---|---|---|---|
| GET | `/theme/bottle` | 필요 | 유리병 테마 목록 |
| GET | `/theme/mailbox` | 필요 | 우편함 테마 목록 |
| GET | `/theme/mail` | 필요 | 편지 테마 목록 |
| PATCH | `/theme/bottle/:id` | 필요 | 유리병 테마 변경 |
| PATCH | `/theme/mailbox/:id` | 필요 | 우편함 테마 변경 |
| PATCH | `/theme/mail/:id` | 필요 | 편지 테마 변경 |

### Admin (관리자 전용)

| Method | Endpoint | 설명 |
|---|---|---|
| POST | `/admin/questions` | 질문 추가 (날짜 지정 가능) |
| DELETE | `/admin/questions/:id` | 질문 삭제 |
| GET | `/admin/questions/:id/replies` | 질문별 전체 답신 조회 |
| GET | `/admin/users/:id` | 유저 정보 조회 |
| POST | `/admin/products` | 상품 추가 |
| PATCH | `/admin/products/:id` | 상품 수정 |
| DELETE | `/admin/products/:id` | 상품 삭제 (soft delete) |
| DELETE | `/admin/products` | 상품 일괄 삭제 |
| POST | `/admin/theme-items` | 테마 아이템 추가 |
| PATCH | `/admin/theme-items/:id` | 테마 아이템 수정 |
| DELETE | `/admin/theme-items/:id` | 테마 아이템 삭제 |
| DELETE | `/admin/theme-items` | 테마 아이템 일괄 삭제 |

---

## 에러 응답 형식

```json
{
  "code": "ERROR_CODE",
  "message": "에러 설명"
}
```

| 코드 | HTTP | 설명 |
|---|---|---|
| `EMAIL_ALREADY_EXISTS` | 409 | 이미 가입된 이메일 |
| `INVALID_CREDENTIALS` | 401 | 이메일/비밀번호 불일치 또는 탈퇴 계정 |
| `USER_NOT_FOUND` | 404 | 사용자 없음 |
| `QUESTION_NOT_FOUND` | 404 | 질문 없음 |
| `QUESTION_DATE_CONFLICT` | 409 | 해당 날짜에 이미 질문 존재 |
| `ALREADY_REPLIED` | 409 | 이미 답신한 질문 |
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |
| `ALREADY_PURCHASED` | 409 | 이미 구매한 상품 |
| `INSUFFICIENT_COINS` | 400 | 코인 부족 |
| `THEME_NOT_FOUND` | 404 | 테마 없음 |
| `THEME_NOT_UNLOCKED` | 403 | 미구매 테마 |
| `FORBIDDEN` | 403 | 관리자 권한 없음 |

---

## 데이터 모델

```
users ──< streaks
users ──< replies ──> daily_questions
users ──< purchases ──> products
users ── user_themes ──> theme_items
products ──< theme_items
```

상세 스키마는 [document/model.md](document/model.md)를 참고하세요.
