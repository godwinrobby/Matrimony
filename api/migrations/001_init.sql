-- Users: both members and admins (role column).
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL UNIQUE,
  phone         VARCHAR(20)   NULL,
  password_hash VARCHAR(100)  NOT NULL,          -- bcrypt (12 rounds)
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Refresh tokens: hashed, revocable sessions.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token_hash  CHAR(64)     NOT NULL UNIQUE,      -- sha256 of the token
  expires_at  TIMESTAMP    NOT NULL,
  revoked     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- User profiles for the matrimonial data.
CREATE TABLE IF NOT EXISTS profiles (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  full_name      VARCHAR(120) NOT NULL,
  gender         ENUM('male','female','other') NOT NULL,
  date_of_birth  DATE         NOT NULL,
  height_cm      SMALLINT UNSIGNED NULL,
  religion       VARCHAR(60)  NULL,
  caste          VARCHAR(60)  NULL,
  mother_tongue  VARCHAR(60)  NULL,
  city           VARCHAR(80)  NULL,
  state          VARCHAR(80)  NULL,
  education      VARCHAR(120) NULL,
  profession     VARCHAR(120) NULL,
  income         VARCHAR(40)  NULL,
  marital_status ENUM('never_married','divorced','widowed','awaiting_divorce') NULL DEFAULT 'never_married',
  about_me       TEXT         NULL,
  -- encrypted-at-rest PII (AES-256-GCM), see server/db/crypto.ts
  contact_email  VARBINARY(512) NULL,
  contact_phone  VARBINARY(256) NULL,
  is_premium     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user UNIQUE (user_id),
  CONSTRAINT fk_profiles_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_profiles_gender (gender),
  INDEX idx_profiles_caste (caste)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
