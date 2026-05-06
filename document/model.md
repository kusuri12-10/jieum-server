## 데이터 모델

### users
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | 사용자 고유 식별자 |
| email | VARCHAR(255) UNIQUE | 이메일 (로그인 ID) |
| password_hash | VARCHAR(255) | bcrypt 해시 비밀번호 |
| nickname | VARCHAR(50) | 닉네임 |
| coins | INT DEFAULT 0 | 보유 코인 |
| streak_goal | INT DEFAULT 30 | 스트릭 목표 일수 |
| created_at | TIMESTAMP | 가입일시 |
| deleted_at | TIMESTAMP NULL | 탈퇴일시 (soft delete) |

### user_themes
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK → users | |
| bottle_theme_id | BIGINT FK → theme_items | 장착 중인 유리병 테마 |
| mailbox_theme_id | BIGINT FK → theme_items | 장착 중인 우편함 테마 |
| mail_theme_id | BIGINT FK → theme_items | 장착 중인 편지 테마 |

### streaks
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK → users | |
| date | DATE | 해당 날짜 |
| completed | BOOLEAN DEFAULT FALSE | 답신 완료 여부 |

### daily_questions
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| content | VARCHAR(500) | 질문 내용 |
| question_date | DATE UNIQUE | 질문 날짜 (하루 1개) |

### replies
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK → users | |
| question_id | BIGINT FK → daily_questions | |
| content | TEXT | 답신 내용 |
| char_count | INT | 글자 수 (통계용 캐싱) |
| created_at | TIMESTAMP | |

### products
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| name | VARCHAR(100) | 상품명 |
| description | TEXT | 상품 상세 설명 |
| image_url | VARCHAR(500) | 상품 이미지 |
| price | INT | 가격 (코인) |
| category | ENUM('BOTTLE', 'MAILBOX', 'MAIL') | 테마 카테고리 |
| is_active | BOOLEAN DEFAULT TRUE | 판매 활성 여부 |

### purchases
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| user_id | BIGINT FK → users | |
| product_id | BIGINT FK → products | |
| purchased_at | TIMESTAMP | 구매일시 |

UNIQUE(user_id, product_id) — 중복 구매 방지

### theme_items
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | BIGINT PK | |
| type | ENUM('BOTTLE', 'MAILBOX', 'MAIL') | 테마 종류 |
| name | VARCHAR(100) | 테마명 |
| image_url | VARCHAR(500) | 미리보기 이미지 |
| product_id | BIGINT FK → products NULL | null이면 무료 기본 테마 |
