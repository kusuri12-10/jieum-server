# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Jieum** (지음) is a NestJS backend API for a Korean daily journaling/reflection app. Users answer a single daily question, accumulate coins via a streak system, and spend coins in a shop to unlock themed UI items (bottle, mailbox, letter). The codebase is currently a scaffold — only the NestJS boilerplate exists; the full feature set is pending implementation.

## Commands

```bash
# Development
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start with debugger + hot-reload

# Build & Production
npm run build          # Compile TypeScript → dist/
npm run start:prod     # Run compiled output

# Code quality
npm run lint           # ESLint with auto-fix
npm run format         # Prettier formatting

# Tests
npm test               # Jest unit tests
npm run test:watch     # Jest in watch mode
npm run test:cov       # Jest with coverage
npm run test:e2e       # End-to-end tests (test/jest-e2e.json)
```

## Architecture

### Tech Stack
- **NestJS 11** on Express — standard module/controller/service pattern
- **TypeScript 6** with `nodenext` module resolution, target ES2023
- **Path alias**: `@/*` → `./src/*` (configured in tsconfig.json)
- Decorators and `reflect-metadata` are enabled (required for NestJS DI)

### Planned Module Structure
Based on the API spec, features should be organized into these NestJS modules:

| Module | Responsibilities |
|---|---|
| `auth` | Signup, login (JWT access + refresh tokens), logout (token invalidation), soft-delete withdrawal |
| `main` | Main screen aggregation (coins, streak history, active themes), streak goal updates |
| `mail` | Today's question (`DAILY_QUESTION`), reply submission with coin reward, paginated reply history |
| `stat` | User statistics — total replies, longest/shortest reply by char count |
| `shop` | Product listing (with category filter), product detail, purchase (deduct coins, write `PURCHASE`) |
| `theme` | List themes per category (bottle/mailbox/mail), change active theme (locked check via `PURCHASE`) |

### Data Models (target DB schema)

| Table | Key columns |
|---|---|
| `USER` | id, email (UNIQUE), password_hash, nickname, coins, streak_goal, created_at, deleted_at (soft delete) |
| `USER_THEME` | user_id FK, bottle_theme_id FK, mailbox_theme_id FK, mail_theme_id FK → THEME_ITEM |
| `STREAK` | user_id FK, date (DATE), completed (BOOLEAN) |
| `DAILY_QUESTION` | content, question_date (DATE UNIQUE) |
| `REPLY` | user_id FK, question_id FK, content (TEXT), char_count (cached), created_at |
| `PRODUCT` | name, price (coins), category ENUM('BOTTLE','MAILBOX','MAIL'), is_active |
| `PURCHASE` | user_id FK, product_id FK — UNIQUE(user_id, product_id) |
| `THEME_ITEM` | type ENUM, name, image_url, product_id FK NULL (null = free default) |

### API Conventions
- All authenticated endpoints require `Authorization: Bearer {accessToken}` header
- Error response format: `{ "code": "ERROR_CODE", "message": "설명" }`
- Date format: `yyyy-MM-dd HH:mm:SS`
- Replying to today's question triggers server-side coin credit (`coins += N`) and marks the streak day complete
- Theme selection requires the user to have purchased the corresponding product (`THEME_NOT_UNLOCKED` → 403 if not)
- Product purchase checks coin balance (`INSUFFICIENT_COINS` → 400) and duplicate purchase (`ALREADY_PURCHASED` → 409)
- User withdrawal is a soft delete (sets `deleted_at`); hard delete after 30-day grace period

### commit convention

<type>: <subject> 형식에 맞추어 커밋

type은 feat, refactor, fix, docs, chore, test로 분리

기능 하나 추가, 버그 픽스 한 번 할 때마다 커밋