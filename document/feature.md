# 기능 명세서

## 목차

1. [인증 (Auth)](#1-인증-auth)
2. [우편함 (Mail)](#2-우편함-mail)
3. [메인화면 (Main Screen)](#3-메인화면-main-screen)
4. [통계 (Stat)](#4-통계-stat)
5. [상점 (Shop)](#5-상점-shop)
6. [테마 (Theme)](#6-테마-theme)
7. [관리자 (Admin)](#7-관리자-admin)

---

## API 엔드포인트 목록

### Auth

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| POST | `/signup` | 불필요 | 회원가입 |
| POST | `/login` | 불필요 | 로그인, JWT 발급 |
| POST | `/logout` | 필요 | 로그아웃, 토큰 무효화 |
| DELETE | `/withdrawal` | 필요 | 회원탈퇴 (soft delete) |

### Main

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| GET | `/main` | 필요 | 메인 화면 (코인, 스트릭 현황, 목표일수, 장착 테마) |
| PATCH | `/streak` | 필요 | 스트릭 목표 일수 변경 |

### Mail

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| GET | `/mail/today` | 필요 | 오늘의 질문 조회 |
| POST | `/mail/today/reply` | 필요 | 오늘의 질문에 답신 제출 |
| GET | `/reply-all` | 필요 | 내 전체 답신 목록 조회 |

### Stat

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| GET | `/stat` | 필요 | 통계 조회 (최장/최단 답변, 총 답변 수) |

### Shop

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| GET | `/products` | 필요 | 상품 목록 조회 (설명 제외) |
| GET | `/products/{id}` | 필요 | 상품 상세 조회 |
| POST | `/products/{id}` | 필요 | 상품 구매 |

### Theme

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| GET | `/theme/bottle` | 필요 | 유리병 테마 전체 조회 |
| GET | `/theme/mailbox` | 필요 | 우편함 테마 전체 조회 |
| GET | `/theme/mail` | 필요 | 편지 테마 전체 조회 |
| PATCH | `/theme/bottle/{id}` | 필요 | 유리병 테마 선택 변경 |
| PATCH | `/theme/mailbox/{id}` | 필요 | 우편함 테마 선택 변경 |
| PATCH | `/theme/mail/{id}` | 필요 | 편지 테마 선택 변경 |

### Admin

| Method | Endpoint | 인증 | 기능 |
|---|---|---|---|
| POST | `/admin/questions` | 관리자 | 오늘의 질문 추가 (날짜 지정 가능) |
| GET | `/admin/questions/{id}/replies` | 관리자 | 특정 질문의 전체 답신 조회 |
| GET | `/admin/users/{id}` | 관리자 | 유저 정보 조회 |
| POST | `/admin/products` | 관리자 | 상품 추가 |
| DELETE | `/admin/products/{id}` | 관리자 | 상품 삭제 |
| DELETE | `/admin/products` | 관리자 | 상품 일괄 삭제 |
| PATCH | `/admin/products/{id}` | 관리자 | 상품 수정 |
| POST | `/admin/theme-items` | 관리자 | 테마 아이템 추가 |
| DELETE | `/admin/theme-items/{id}` | 관리자 | 테마 아이템 삭제 |
| DELETE | `/admin/theme-items` | 관리자 | 테마 아이템 일괄 삭제 |
| PATCH | `/admin/theme-items/{id}` | 관리자 | 테마 아이템 수정 |
| DELETE | `/admin/questions/{id}` | 관리자 | 오늘의 질문 삭제 |

---

## 공통

| 항목 | 내용 |
|---|---|
| 인증 방식 | `Authorization: Bearer {accessToken}` 헤더 |
| 에러 포맷 | `{ "code": "ERROR_CODE", "message": "설명" }` |
| 날짜 형식 | `yyyy-MM-dd` (날짜), `yyyy-MM-ddTHH:mm:ssZ` (일시) |
| 코인 보상 | 답신 1건당 10코인 (`REPLY_COIN_REWARD` 환경변수로 조정) |

---

## 1. 인증 (Auth)

### 1-1. 회원가입

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/signup` |
| 인증 | 불필요 |

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "string (8자 이상)",
  "nickname": "string (1~50자)"
}
```

**Response `201`**
```json
{
  "userId": 1,
  "nickname": "string",
  "email": "user@example.com"
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `EMAIL_ALREADY_EXISTS` | 409 | 이미 가입된 이메일 |

---

### 1-2. 로그인

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/login` |
| 인증 | 불필요 |

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response `200`**
```json
{
  "accessToken": "JWT (15분 만료)",
  "refreshToken": "JWT (7일 만료)",
  "user": {
    "userId": 1,
    "nickname": "string",
    "coins": 320
  }
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | 이메일 없음 / 비밀번호 불일치 / 탈퇴 계정 |

---

### 1-3. 로그아웃

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/logout` |
| 인증 | 필요 |

**Response `204 No Content`**

---

### 1-4. 회원탈퇴

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/withdrawal` |
| 인증 | 필요 |

- `deleted_at` 에 현재 시각을 기록하는 **soft delete**
- 30일 유예 후 하드 삭제 (별도 배치 작업 필요)

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `USER_NOT_FOUND` | 404 | 사용자 없음 |

---

## 2. 우편함 (Mail)

### 2-1. 오늘의 질문 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/mail/today` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "questionId": 42,
  "content": "오늘 가장 인상 깊었던 순간은?",
  "date": "2026-05-06",
  "hasReplied": false
}
```

> `hasReplied`: 로그인 유저가 오늘 이미 답신했는지 여부

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `QUESTION_NOT_FOUND` | 404 | 오늘 날짜에 등록된 질문 없음 |

---

### 2-2. 오늘의 질문 답신 제출

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/mail/today/reply` |
| 인증 | 필요 |

**Request Body**
```json
{
  "questionId": 42,
  "content": "오늘 처음으로 혼자 버스를 탔어요..."
}
```

**Response `201`**
```json
{
  "replyId": 101,
  "content": "오늘 처음으로 혼자 버스를 탔어요...",
  "createdAt": "2026-05-06T21:30:00.000Z",
  "coinsEarned": 10
}
```

**부수 효과**
- 답신 저장 시 `coins += REPLY_COIN_REWARD(10)` 자동 지급

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `QUESTION_NOT_FOUND` | 404 | 해당 질문 없음 |
| `ALREADY_REPLIED` | 409 | 해당 질문에 이미 답신 완료 |

---

### 2-3. 전체 답신 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/reply-all` |
| 인증 | 필요 |

**Query Parameters**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `page` | number | 1 | 페이지 번호 |
| `size` | number | 20 | 페이지 크기 |

**Response `200`**
```json
{
  "totalCount": 87,
  "replies": [
    {
      "replyId": 101,
      "question": "오늘 가장 인상 깊었던 순간은?",
      "content": "오늘 처음으로 혼자 버스를 탔어요...",
      "createdAt": "2026-05-06T21:30:00.000Z"
    }
  ]
}
```

> 최신순 정렬

---

## 3. 메인화면 (Main Screen)

### 3-1. 메인화면 데이터 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/main` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "nickname": "string",
  "coins": 320,
  "streakGoal": 30,
  "streakCurrent": 12,
  "streakHistory": [
    { "date": "2026-05-06", "completed": true },
    { "date": "2026-05-05", "completed": true },
    { "date": "2026-05-04", "completed": false }
  ],
  "theme": {
    "bottleThemeId": 2,
    "mailboxThemeId": 1,
    "mailThemeId": 3
  }
}
```

> `streakHistory`: 최근 30일치 데이터, 최신순 정렬
> `streakCurrent`: 오늘부터 연속으로 완료된 날 수

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `USER_NOT_FOUND` | 404 | 사용자 없음 |

---

### 3-2. 스트릭 목표 일수 변경

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| URL | `/streak` |
| 인증 | 필요 |

**Request Body**
```json
{ "streakGoal": 60 }
```

**Response `200`**
```json
{ "streakGoal": 60 }
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `USER_NOT_FOUND` | 404 | 사용자 없음 |

---

## 4. 통계 (Stat)

### 4-1. 통계 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/stat` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "totalReplies": 87,
  "longestReply": {
    "replyId": 55,
    "content": "...",
    "charCount": 842,
    "date": "2026-04-15"
  },
  "shortestReply": {
    "replyId": 12,
    "content": "좋았다.",
    "charCount": 4,
    "date": "2026-03-10"
  }
}
```

> 답신이 없는 경우 `longestReply`, `shortestReply` 는 `null`

---

## 5. 상점 (Shop)

### 5-1. 상품 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/products` |
| 인증 | 필요 |

**Query Parameters**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `category` | `BOTTLE` \| `MAILBOX` \| `MAIL` | (전체) | 카테고리 필터 |
| `page` | number | 1 | 페이지 번호 |
| `size` | number | 20 | 페이지 크기 |

**Response `200`**
```json
{
  "products": [
    {
      "productId": 1,
      "name": "벚꽃 유리병",
      "imageUrl": "https://...",
      "price": 300,
      "category": "BOTTLE",
      "isPurchased": false
    }
  ]
}
```

> `description` 제외 (목록에서는 노출 안 함)
> `isPurchased`: 로그인 유저의 구매 여부

---

### 5-2. 상품 상세 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/products/{id}` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "productId": 1,
  "name": "벚꽃 유리병",
  "description": "봄 향기를 담은 유리병 테마...",
  "imageUrl": "https://...",
  "price": 300,
  "category": "BOTTLE",
  "isPurchased": true
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 또는 비활성 상품 |

---

### 5-3. 상품 구매

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/products/{id}` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "productId": 1,
  "remainingCoins": 20
}
```

**부수 효과**
- `coins -= product.price` 코인 차감
- `PURCHASE` 레코드 생성

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |
| `ALREADY_PURCHASED` | 409 | 이미 구매한 상품 |
| `INSUFFICIENT_COINS` | 400 | 보유 코인 < 상품 가격 |
| `USER_NOT_FOUND` | 404 | 사용자 없음 |

---

## 6. 테마 (Theme)

### 6-1. 테마 목록 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/theme/bottle` \| `/theme/mailbox` \| `/theme/mail` |
| 인증 | 필요 |

**Response `200`**
```json
{
  "themes": [
    {
      "themeId": 1,
      "name": "기본 유리병",
      "imageUrl": "https://...",
      "isUnlocked": true,
      "isSelected": true
    },
    {
      "themeId": 2,
      "name": "벚꽃 유리병",
      "imageUrl": "https://...",
      "isUnlocked": false,
      "isSelected": false
    }
  ]
}
```

> `isUnlocked`: `product_id IS NULL`(무료 기본 테마) 이거나 해당 상품을 구매한 경우 `true`
> `isSelected`: 현재 장착 중인 테마

---

### 6-2. 테마 변경

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| URL | `/theme/bottle/{id}` \| `/theme/mailbox/{id}` \| `/theme/mail/{id}` |
| 인증 | 필요 |

**Response `200`**
```json
{ "themeId": 2, "name": "벚꽃 유리병" }
```

**부수 효과**
- `USER_THEME` 레코드의 해당 카테고리 테마 ID 업데이트
- `USER_THEME` 레코드가 없는 경우 신규 생성

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `THEME_NOT_FOUND` | 404 | 테마 없음 또는 카테고리 불일치 |
| `THEME_NOT_UNLOCKED` | 403 | 해당 테마의 상품을 구매하지 않음 |

---

## 7. 관리자 (Admin)

> 모든 관리자 엔드포인트는 `Authorization: Bearer {accessToken}` 헤더와 함께 관리자 권한을 검증합니다.
> 관리자 여부는 `users.is_admin` 컬럼(BOOLEAN)으로 구분합니다.

### 7-1. 오늘의 질문 추가

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/admin/questions` |
| 인증 | 관리자 |

**Request Body**
```json
{
  "content": "오늘 가장 감사했던 순간은?",
  "questionDate": "2026-05-10"
}
```

> `questionDate`: `yyyy-MM-dd` 형식. 생략 시 오늘 날짜로 등록

**Response `201`**
```json
{
  "questionId": 43,
  "content": "오늘 가장 감사했던 순간은?",
  "questionDate": "2026-05-10"
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `QUESTION_DATE_CONFLICT` | 409 | 해당 날짜에 이미 질문이 존재함 |

---

### 7-2. 오늘의 질문 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/admin/questions/{id}` |
| 인증 | 관리자 |

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `QUESTION_NOT_FOUND` | 404 | 해당 질문 없음 |

---

### 7-3. 질문별 전체 답신 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/admin/questions/{id}/replies` |
| 인증 | 관리자 |

**Query Parameters**

| 파라미터 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `page` | number | 1 | 페이지 번호 |
| `size` | number | 20 | 페이지 크기 |

**Response `200`**
```json
{
  "questionId": 42,
  "content": "오늘 가장 인상 깊었던 순간은?",
  "totalCount": 134,
  "replies": [
    {
      "replyId": 101,
      "userId": 5,
      "nickname": "string",
      "content": "오늘 처음으로 혼자 버스를 탔어요...",
      "charCount": 120,
      "createdAt": "2026-05-06T21:30:00.000Z"
    }
  ]
}
```

> 최신순 정렬. 유저 구분 없이 해당 질문에 달린 모든 답신 반환

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `QUESTION_NOT_FOUND` | 404 | 해당 질문 없음 |

---

### 7-4. 유저 정보 조회

| 항목 | 내용 |
|---|---|
| Method | `GET` |
| URL | `/admin/users/{id}` |
| 인증 | 관리자 |

**Response `200`**
```json
{
  "userId": 5,
  "email": "user@example.com",
  "nickname": "string",
  "coins": 320,
  "streakGoal": 30,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "deletedAt": null
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `USER_NOT_FOUND` | 404 | 해당 유저 없음 |

---

### 7-5. 상품 추가

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/admin/products` |
| 인증 | 관리자 |

**Request Body**
```json
{
  "name": "벚꽃 유리병",
  "description": "봄 향기를 담은 유리병 테마...",
  "imageUrl": "https://...",
  "price": 300,
  "category": "BOTTLE"
}
```

**Response `201`**
```json
{
  "productId": 10,
  "name": "벚꽃 유리병",
  "category": "BOTTLE",
  "price": 300
}
```

---

### 7-6. 상품 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/admin/products/{id}` |
| 인증 | 관리자 |

- `is_active = false` 로 변경하는 **soft delete** (기존 구매 데이터 보존)

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |

---

### 7-7. 상품 일괄 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/admin/products` |
| 인증 | 관리자 |

- 지정한 ID 목록을 모두 `is_active = false` 로 변경하는 **soft delete**

**Request Body**
```json
{
  "ids": [10, 11, 12]
}
```

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 목록 중 존재하지 않는 상품 ID 포함 |

---

### 7-8. 상품 수정

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| URL | `/admin/products/{id}` |
| 인증 | 관리자 |

**Request Body** (모든 필드 선택적)
```json
{
  "name": "벚꽃 유리병 리뉴얼",
  "description": "업데이트된 설명...",
  "imageUrl": "https://...",
  "price": 250
}
```

> `category` 는 변경 불가

**Response `200`**
```json
{
  "productId": 10,
  "name": "벚꽃 유리병 리뉴얼",
  "description": "업데이트된 설명...",
  "imageUrl": "https://...",
  "price": 250,
  "category": "BOTTLE"
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 상품 없음 |

---

### 7-9. 테마 아이템 추가

| 항목 | 내용 |
|---|---|
| Method | `POST` |
| URL | `/admin/theme-items` |
| 인증 | 관리자 |

**Request Body**
```json
{
  "type": "BOTTLE",
  "name": "벚꽃 유리병",
  "imageUrl": "https://...",
  "productId": 10
}
```

> `productId`: 연결할 상품 ID. `null` 또는 생략 시 무료 기본 테마로 등록

**Response `201`**
```json
{
  "themeItemId": 5,
  "type": "BOTTLE",
  "name": "벚꽃 유리병",
  "imageUrl": "https://...",
  "productId": 10
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `PRODUCT_NOT_FOUND` | 404 | 연결할 상품이 존재하지 않음 |

---

### 7-10. 테마 아이템 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/admin/theme-items/{id}` |
| 인증 | 관리자 |

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `THEME_NOT_FOUND` | 404 | 테마 아이템 없음 |

---

### 7-11. 테마 아이템 일괄 삭제

| 항목 | 내용 |
|---|---|
| Method | `DELETE` |
| URL | `/admin/theme-items` |
| 인증 | 관리자 |

**Request Body**
```json
{
  "ids": [5, 6, 7]
}
```

**Response `204 No Content`**

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `THEME_NOT_FOUND` | 404 | 목록 중 존재하지 않는 테마 아이템 ID 포함 |

---

### 7-12. 테마 아이템 수정

| 항목 | 내용 |
|---|---|
| Method | `PATCH` |
| URL | `/admin/theme-items/{id}` |
| 인증 | 관리자 |

**Request Body** (모든 필드 선택적)
```json
{
  "name": "벚꽃 유리병 리뉴얼",
  "imageUrl": "https://...",
  "productId": 11
}
```

> `type` 은 변경 불가

**Response `200`**
```json
{
  "themeItemId": 5,
  "type": "BOTTLE",
  "name": "벚꽃 유리병 리뉴얼",
  "imageUrl": "https://...",
  "productId": 11
}
```

**에러**

| 코드 | HTTP | 조건 |
|---|---|---|
| `THEME_NOT_FOUND` | 404 | 테마 아이템 없음 |
| `PRODUCT_NOT_FOUND` | 404 | 연결할 상품이 존재하지 않음 |
