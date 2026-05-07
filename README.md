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

프로젝트 루트에 .env.example 파일을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
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

DDD + 레이어드 아키텍처를 적용하였습니다.

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

[document/feature.md](./document/feature.md) 문서에 API 엔드포인트 관련 내용이 명세되어 있습니다.

## 에러 응답 형식

```json
{
  "code": "ERROR_CODE",
  "message": "에러 설명"
}
```

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
