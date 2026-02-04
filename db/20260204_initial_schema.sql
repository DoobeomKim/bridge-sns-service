-- SNS 자동화 서비스 초기 DB 스키마
-- 멀티테넌시 구조 (5-10명 고객 관리)
-- Vercel Postgres (Neon) + NextAuth.js

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 0. Users (NextAuth.js 기본 테이블)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  image TEXT,
  password_hash TEXT, -- bcrypt 해시
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 1. Organizations (고객사)
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================
-- 2. Profiles (사용자 프로필)
-- ============================================
-- users를 확장하는 프로필 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'org_admin')) NOT NULL DEFAULT 'org_admin',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- 3. Instagram Accounts (연동된 Instagram 계정)
-- ============================================
CREATE TABLE instagram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  instagram_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL, -- TODO: 암호화 필요
  token_expires_at TIMESTAMPTZ,
  brand_tone JSONB, -- 학습된 톤앤매너
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, instagram_user_id)
);

-- 인덱스
CREATE INDEX idx_instagram_accounts_org ON instagram_accounts(organization_id);
CREATE INDEX idx_instagram_accounts_username ON instagram_accounts(username);

-- ============================================
-- 4. Posts (생성된 포스트)
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  instagram_account_id UUID REFERENCES instagram_accounts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  hashtags TEXT[], -- 해시태그 배열
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'failed')) DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  instagram_post_id TEXT, -- Instagram에 발행된 포스트 ID
  error_message TEXT, -- 발행 실패 시 에러 메시지
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_posts_org ON posts(organization_id);
CREATE INDEX idx_posts_account ON posts(instagram_account_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);

-- ============================================
-- 5. 권한 관리 (Application Level)
-- ============================================
-- Vercel Postgres는 RLS를 지원하지 않으므로
-- 애플리케이션 레벨에서 권한을 체크합니다.
--
-- 권한 체크 패턴:
-- 1. Super Admin: 모든 데이터 접근 가능
-- 2. Org Admin: 본인 organization_id 데이터만 접근
--
-- 예시:
-- SELECT * FROM posts
-- WHERE organization_id = (
--   SELECT organization_id FROM profiles WHERE id = $userId
-- );
--
-- 또는 미들웨어에서 체크:
-- if (user.role !== 'super_admin' && post.organization_id !== user.organization_id) {
--   throw new Error('Unauthorized')
-- }

-- ============================================
-- 6. Functions & Triggers
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_accounts_updated_at BEFORE UPDATE ON instagram_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. 초기 데이터 (선택사항)
-- ============================================

-- 슈퍼 관리자 organization (나중에 수동으로 추가)
-- INSERT INTO organizations (name, slug) VALUES ('관리자', 'admin');

COMMENT ON TABLE organizations IS '고객사 테이블';
COMMENT ON TABLE profiles IS '사용자 프로필 (auth.users 확장)';
COMMENT ON TABLE instagram_accounts IS '연동된 Instagram 계정';
COMMENT ON TABLE posts IS '생성된 SNS 포스트';
