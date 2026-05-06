export const ErrorCode = {
  // Auth
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: '이미 사용 중인 이메일입니다.',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: '인증이 필요합니다.',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.',
  },

  // Mail
  QUESTION_NOT_FOUND: {
    code: 'QUESTION_NOT_FOUND',
    message: '오늘의 질문이 없습니다.',
  },
  ALREADY_REPLIED: {
    code: 'ALREADY_REPLIED',
    message: '이미 오늘의 질문에 답신했습니다.',
  },
  REPLY_NOT_FOUND: {
    code: 'REPLY_NOT_FOUND',
    message: '답신을 찾을 수 없습니다.',
  },

  // Shop
  PRODUCT_NOT_FOUND: {
    code: 'PRODUCT_NOT_FOUND',
    message: '상품을 찾을 수 없습니다.',
  },
  INSUFFICIENT_COINS: {
    code: 'INSUFFICIENT_COINS',
    message: '코인이 부족합니다.',
  },
  ALREADY_PURCHASED: {
    code: 'ALREADY_PURCHASED',
    message: '이미 구매한 상품입니다.',
  },

  // Admin
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: '관리자 권한이 필요합니다.',
  },
  QUESTION_DATE_CONFLICT: {
    code: 'QUESTION_DATE_CONFLICT',
    message: '해당 날짜에 이미 질문이 존재합니다.',
  },

  // Theme
  THEME_NOT_FOUND: {
    code: 'THEME_NOT_FOUND',
    message: '테마를 찾을 수 없습니다.',
  },
  THEME_NOT_UNLOCKED: {
    code: 'THEME_NOT_UNLOCKED',
    message: '구매 후 사용 가능합니다.',
  },
} as const;

export type ErrorCodeKey = keyof typeof ErrorCode;
export type ErrorCodeValue = (typeof ErrorCode)[ErrorCodeKey];
