-- 지음 (Jieum) 더미 데이터
-- 비밀번호: password123 (bcrypt, saltRounds=10)

-- 유저 
INSERT INTO users (email, password_hash, nickname, coins, streak_goal, created_at, deleted_at, is_admin)
VALUES
  ('admin@jieum.com',  '$2b$10$wSCPBK7XtTqlkXlbKqkFUOqTfBbvgd1mfJFBJJomjA6AjnRjLFkMu', '관리자',   500, 30, NOW(), NULL, TRUE),
  ('user@jieum.com',   '$2b$10$wSCPBK7XtTqlkXlbKqkFUOqTfBbvgd1mfJFBJJomjA6AjnRjLFkMu', '사용자',   100, 30, NOW(), NULL, FALSE);

-- 오늘의 질문 (10개, 오늘 날짜) 
INSERT INTO daily_questions (content, question_date)
VALUES
  ('오늘 가장 인상 깊었던 순간은 무엇인가요?',           CURDATE()),
  ('오늘 나에게 고마웠던 사람이 있나요?',                CURDATE()),
  ('오늘 가장 힘들었던 일은 무엇이었나요?',              CURDATE()),
  ('오늘 나를 가장 웃게 만든 것은 무엇인가요?',          CURDATE()),
  ('오늘 새롭게 배운 것이 있다면 무엇인가요?',           CURDATE()),
  ('오늘 하루를 한 문장으로 표현한다면?',                CURDATE()),
  ('오늘 가장 잘한 일은 무엇인가요?',                   CURDATE()),
  ('오늘 아쉬웠던 순간이 있었나요?',                    CURDATE()),
  ('오늘 나에게 가장 필요했던 것은 무엇인가요?',          CURDATE()),
  ('오늘 하루가 끝나는 지금, 기분이 어떤가요?',          CURDATE());

-- 상품 (10개, BOTTLE 4 / MAILBOX 3 / MAIL 3)
INSERT INTO products (name, description, image_url, price, category, is_active)
VALUES
  ('벚꽃 유리병',       '봄의 설렘을 담은 벚꽃 유리병 테마입니다.',         'https://example.com/images/bottle-cherry.png',   300, 'BOTTLE',  TRUE),
  ('바다 유리병',       '파도 소리가 들릴 것 같은 바다 유리병 테마입니다.', 'https://example.com/images/bottle-ocean.png',    250, 'BOTTLE',  TRUE),
  ('달빛 유리병',       '달빛 아래 빛나는 유리병 테마입니다.',              'https://example.com/images/bottle-moon.png',     400, 'BOTTLE',  TRUE),
  ('숲속 유리병',       '초록빛 숲속 분위기의 유리병 테마입니다.',           'https://example.com/images/bottle-forest.png',   200, 'BOTTLE',  TRUE),
  ('빈티지 우편함',     '오래된 골목의 빈티지 우편함 테마입니다.',           'https://example.com/images/mailbox-vintage.png', 350, 'MAILBOX', TRUE),
  ('꽃밭 우편함',       '꽃밭 한가운데 놓인 우편함 테마입니다.',             'https://example.com/images/mailbox-flower.png',  300, 'MAILBOX', TRUE),
  ('겨울 우편함',       '눈 쌓인 겨울 우편함 테마입니다.',                  'https://example.com/images/mailbox-winter.png',  250, 'MAILBOX', TRUE),
  ('손편지 테마',       '따뜻한 손글씨 느낌의 편지 테마입니다.',             'https://example.com/images/mail-handwritten.png',200, 'MAIL',    TRUE),
  ('엽서 테마',         '여행지에서 보내는 엽서 스타일 편지 테마입니다.',    'https://example.com/images/mail-postcard.png',   300, 'MAIL',    TRUE),
  ('꽃편지 테마',       '꽃잎이 흩뿌려진 편지 테마입니다.',                  'https://example.com/images/mail-floral.png',     350, 'MAIL',    TRUE);

-- 테마 아이템 (10개) 
-- 기본 테마 (product_id = NULL, 무료)
-- 유료 테마는 위에서 생성한 products id 1~10 참조
INSERT INTO theme_items (type, name, image_url, product_id)
VALUES
  ('BOTTLE',  '기본 유리병',   'https://example.com/themes/bottle-default.png',      NULL),
  ('BOTTLE',  '벚꽃 유리병',   'https://example.com/themes/bottle-cherry.png',        1),
  ('BOTTLE',  '바다 유리병',   'https://example.com/themes/bottle-ocean.png',         2),
  ('BOTTLE',  '달빛 유리병',   'https://example.com/themes/bottle-moon.png',          3),
  ('MAILBOX', '기본 우편함',   'https://example.com/themes/mailbox-default.png',      NULL),
  ('MAILBOX', '빈티지 우편함', 'https://example.com/themes/mailbox-vintage.png',      5),
  ('MAILBOX', '꽃밭 우편함',   'https://example.com/themes/mailbox-flower.png',       6),
  ('MAIL',    '기본 편지',     'https://example.com/themes/mail-default.png',         NULL),
  ('MAIL',    '손편지 테마',   'https://example.com/themes/mail-handwritten.png',     8),
  ('MAIL',    '엽서 테마',     'https://example.com/themes/mail-postcard.png',        9);

-- 유저 테마 초기값 (기본 테마 장착) 
-- user_id 1 = admin, user_id 2 = 일반 유저
-- theme_items id 1 = 기본 유리병, 5 = 기본 우편함, 8 = 기본 편지
INSERT INTO user_themes (user_id, bottle_theme_id, mailbox_theme_id, mail_theme_id)
VALUES
  (1, 1, 5, 8),
  (2, 1, 5, 8);
