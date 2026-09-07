-- ============================================================
-- 002: Matrimony domain tables
-- ============================================================

-- Caste / community master (admin-managed)
CREATE TABLE IF NOT EXISTS castes (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(80) NOT NULL UNIQUE,
  religion   VARCHAR(60) NULL,
  is_active  TINYINT(1)  NOT NULL DEFAULT 1,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Interest / connection requests between members
CREATE TABLE IF NOT EXISTS interest_requests (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  message     VARCHAR(500) NULL,
  status      ENUM('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_interest_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_interest_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_interest_pair (sender_id, receiver_id),
  INDEX idx_interest_receiver (receiver_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Direct messages between members
CREATE TABLE IF NOT EXISTS messages (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sender_id   INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  body        TEXT         NOT NULL,
  read_at     TIMESTAMP    NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_msg_receiver_unread (receiver_id, read_at),
  INDEX idx_msg_pair (sender_id, receiver_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Membership plans (admin-managed pricing)
CREATE TABLE IF NOT EXISTS membership_plans (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(80)  NOT NULL UNIQUE,
  description   VARCHAR(255) NULL,
  price_paise   INT UNSIGNED NOT NULL,
  duration_days INT UNSIGNED NOT NULL,
  features      JSON         NULL,
  is_popular    TINYINT(1)   NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Payments (Cashfree or other gateways)
CREATE TABLE IF NOT EXISTS payments (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED NOT NULL,
  plan_id           INT UNSIGNED NULL,
  provider          ENUM('cashfree','manual','other') NOT NULL DEFAULT 'cashfree',
  provider_order_id VARCHAR(120) NULL UNIQUE,
  amount_paise      INT UNSIGNED NOT NULL,
  currency          CHAR(3)      NOT NULL DEFAULT 'INR',
  status            ENUM('created','paid','failed','refunded') NOT NULL DEFAULT 'created',
  raw_payload       JSON         NULL,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE SET NULL,
  INDEX idx_payment_user (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Active / historical memberships
CREATE TABLE IF NOT EXISTS memberships (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  plan_id     INT UNSIGNED NOT NULL,
  payment_id  INT UNSIGNED NULL,
  starts_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at     TIMESTAMP NOT NULL,
  status      ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_member_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT,
  CONSTRAINT fk_member_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_member_user_active (user_id, status, ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Profile verification (admin-reviewed), doc number encrypted AES-256-GCM
CREATE TABLE IF NOT EXISTS verification_requests (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  doc_type      ENUM('aadhaar','pan','passport','driving_license','other') NOT NULL,
  doc_number_enc VARBINARY(256) NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by   INT UNSIGNED NULL,
  review_note   VARCHAR(255) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_verify_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_verify_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_verify_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Success stories (user-submitted, admin-approved)
CREATE TABLE IF NOT EXISTS success_stories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  partner_name VARCHAR(120) NULL,
  title      VARCHAR(160) NOT NULL,
  story      TEXT         NOT NULL,
  photo_url  VARCHAR(255) NULL,
  status     ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_story_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_story_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Complaints raised by members
CREATE TABLE IF NOT EXISTS complaints (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  subject     VARCHAR(160) NOT NULL,
  description TEXT         NOT NULL,
  status      ENUM('open','in_progress','resolved','dismissed') NOT NULL DEFAULT 'open',
  admin_note  VARCHAR(255) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_complaint_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_complaint_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Reports against other members (misuse / fake profiles)
CREATE TABLE IF NOT EXISTS reports (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id      INT UNSIGNED NOT NULL,
  reported_user_id INT UNSIGNED NOT NULL,
  reason           ENUM('fake_profile','abuse','harassment','spam','other') NOT NULL,
  details          VARCHAR(500) NULL,
  status           ENUM('open','reviewing','action_taken','dismissed') NOT NULL DEFAULT 'open',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_report_reported FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_report_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Horoscope / kundli match requests and AI results
CREATE TABLE IF NOT EXISTS horoscope_requests (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  partner_name VARCHAR(120) NULL,
  partner_dob DATE     NULL,
  user_dob    DATE     NULL,
  result      TEXT     NULL,
  score       TINYINT UNSIGNED NULL,
  status      ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_horoscope_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_horoscope_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- In-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  type       ENUM('interest','message','system','membership','verification') NOT NULL DEFAULT 'system',
  title      VARCHAR(160) NOT NULL,
  body       VARCHAR(500) NULL,
  read_at    TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user_unread (user_id, read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Audit log for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id   INT UNSIGNED NOT NULL,
  action     VARCHAR(120) NOT NULL,
  entity     VARCHAR(60)  NOT NULL,
  entity_id  INT UNSIGNED NULL,
  details    JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_audit_admin (admin_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
