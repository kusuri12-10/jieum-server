## API 엔드포인트

1. auth

| Method | Endpoint | 기능 |
|---|---|---|
| POST | /signup | 회원가입 |
| POST | /login | 로그인, JWT 발급 |
| POST | /logout | 로그아웃, 토큰 무효화 |
| DELETE | /withdrawal | 회원탈퇴 (soft delete) |

2. main

| Method | Endpoint | 기능 |
|---|---|---|
| GET | /main | 메인 화면 (코인, 스트릭 현황, 목표일수, 장착 테마) |
| PATCH | /streak | 스트릭 목표 일수 변경 |

3. 우편함

| Method | Endpoint | 기능 |
|---|---|---|
| GET | /mail/today | 오늘의 질문 조회 |
| POST | /mail/today/reply | 오늘의 질문에 답신 제출 |
| GET | /reply-all | 내 전체 답신 목록 조회 |

4. 통계

| Method | Endpoint | 기능 |
|---|---|---|
| GET | /stat | 통계 조회 (최장/최단 답변, 총 답변 수) |

5. 상점

| Method | Endpoint | 기능 |
|---|---|---|
| GET | /products | 상품 목록 조회 (설명 제외) |
| GET | /products/{id} | 상품 상세 조회 |
| POST | /products/{id} | 상품 구매 |

6. 테마

| Method | Endpoint | 기능 |
|---|---|---|
| GET | /theme/bottle | 유리병 테마 전체 조회 |
| GET | /theme/mailbox | 우편함 테마 전체 조회 |
| GET | /theme/mail | 편지 테마 전체 조회 |
| PATCH | /theme/bottle/{id} | 유리병 테마 선택 변경 |
| PATCH | /theme/mailbox/{id} | 우편함 테마 선택 변경 |
| PATCH | /theme/mail/{id} | 편지 테마 선택 변경 |

---

## API 상세 명세

### 1. Auth

**`POST /signup`**
```json
// Request
{ "email": "user@example.com", "password": "string", "nickname": "string" }

// Response 201
{ "userId": 1, "nickname": "string", "email": "user@example.com" }
```

**`POST /login`**
```json
// Request
{ "email": "user@example.com", "password": "string" }

// Response 200
{
  "accessToken": "JWT",
  "refreshToken": "JWT",
  "user": { "userId": 1, "nickname": "string", "coins": 0 }
}
```

**`POST /logout`**
```
// Header: Authorization: Bearer {accessToken}
// Response 204 No Content
```

**`DELETE /withdrawal`**
```
// Header: Authorization: Bearer {accessToken}
// soft delete — deleted_at 기록, 30일 유예 후 하드 삭제
// Response 204 No Content
```

---

### 2. 우편함

**`GET /mail/today`** — 오늘의 질문 조회
```json
// Response 200
{
  "questionId": 42,
  "content": "오늘 가장 인상 깊었던 순간은?",
  "date": "2025-08-01",
  "hasReplied": false
}
```

**`POST /mail/today/reply`** — 오늘의 질문에 답신
```json
// Request
{ "questionId": 42, "content": "오늘 처음으로 혼자 버스를 탔어요..." }

// Response 201
{
  "replyId": 101,
  "content": "오늘 처음으로 혼자 버스를 탔어요...",
  "createdAt": "2025-08-01T21:30:00Z",
  "coinsEarned": 10
}
```
> 답신 완료 시 코인 지급 로직을 서버에서 처리 (`coins += N`)

**`GET /reply-all`** — 전체 답신 목록
```json
// Query: ?page=1&size=20
// Response 200
{
  "totalCount": 87,
  "replies": [
    {
      "replyId": 101,
      "question": "오늘 가장 인상 깊었던 순간은?",
      "content": "오늘 처음으로 혼자 버스를 탔어요...",
      "createdAt": "2025-08-01T21:30:00Z"
    }
  ]
}
```

---

### 3. 통계

**`GET /stat`**
```json
// Response 200
{
  "totalReplies": 87,
  "longestReply": {
    "replyId": 55,
    "content": "...",
    "charCount": 842,
    "date": "2025-07-15"
  },
  "shortestReply": {
    "replyId": 12,
    "content": "좋았다.",
    "charCount": 4,
    "date": "2025-06-10"
  }
}
```

---

### 4. 메인

**`GET /main`** — 메인 화면 데이터
```json
// Response 200
{
  "nickname": "string",
  "coins": 320,
  "streakGoal": 30,
  "streakCurrent": 12,
  "streakHistory": [
    { "date": "2025-08-01", "completed": true },
    { "date": "2025-07-31", "completed": true },
    { "date": "2025-07-30", "completed": false }
  ],
  "theme": {
    "bottleThemeId": 2,
    "mailboxThemeId": 1,
    "mailThemeId": 3
  }
}
```

**`PATCH /streak`** — 스트릭 목표 일수 변경
```json
// Request
{ "streakGoal": 60 }

// Response 200
{ "streakGoal": 60 }
```

---

### 5. 상점

**`GET /products`** — 상품 목록 (내용 제외)
```json
// Query: ?category=BOTTLE&page=1&size=20
// Response 200
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

**`GET /products/{id}`** — 상품 상세
```json
// Response 200
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

**`POST /products/{id}`** — 상품 구매
```json
// Response 200
{
  "productId": 1,
  "remainingCoins": 20
}

// Response 400 - 코인 부족
{ "code": "INSUFFICIENT_COINS", "message": "코인이 부족합니다." }

// Response 409 - 이미 구매
{ "code": "ALREADY_PURCHASED", "message": "이미 구매한 상품입니다." }
```

---

### 6. 테마 설정

**`GET /theme/bottle`** / **`GET /theme/mailbox`** / **`GET /theme/mail`**
```json
// Response 200
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
> `isUnlocked`: 구매 완료 여부 (무료 기본 테마는 항상 `true`)

**`PATCH /theme/bottle/{id}`** / **`PATCH /theme/mailbox/{id}`** / **`PATCH /theme/mail/{id}`**
```json
// Response 200
{ "themeId": 2, "name": "벚꽃 유리병" }

// Response 403 - 미구매 테마 선택 시도
{ "code": "THEME_NOT_UNLOCKED", "message": "구매 후 사용 가능합니다." }
```

---

## 공통

| 항목 | 내용 |
|---|---|
| 인증 | `Authorization: Bearer {accessToken}` 헤더 (로그인 이후 모든 API) |
| 에러 포맷 | `{ "code": "ERROR_CODE", "message": "설명" }` |
| 날짜 형식 | `yyyy-MM-dd HH:mm:SS` — `2025-08-01 21:30:00` |