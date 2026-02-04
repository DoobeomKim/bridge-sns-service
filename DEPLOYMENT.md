# Vercel 배포 가이드

## 📋 준비사항

- Vercel 계정
- GitHub 계정 (프로젝트를 push 해야 함)
- 환경 변수 값들

## 🚀 배포 단계

### 1. GitHub에 프로젝트 Push

```bash
# Git 초기화 (이미 되어있음)
git add .
git commit -m "Initial commit: SNS Automation MVP"

# GitHub에 새 repository 생성 후
git remote add origin https://github.com/your-username/sns-service.git
git branch -M main
git push -u origin main
```

### 2. Vercel 프로젝트 생성

#### 방법 A: Vercel Dashboard (추천)

1. https://vercel.com 로그인
2. "Add New" → "Project" 클릭
3. GitHub repository 선택 (`sns-service`)
4. Framework Preset: Next.js (자동 감지)
5. Environment Variables 설정:
   ```
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   ```
6. "Deploy" 클릭

#### 방법 B: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3. Vercel Postgres 생성

1. Vercel Dashboard → 프로젝트 선택
2. "Storage" 탭 클릭
3. "Create Database" → "Postgres" 선택
4. Database Name: `sns-automation`
5. Region: 가장 가까운 지역 선택 (예: Singapore)
6. "Create" 클릭

**자동으로 환경 변수가 설정됩니다!**

### 4. 데이터베이스 마이그레이션

#### 방법 A: Vercel Dashboard (추천)

1. Storage → Postgres 클릭
2. "Query" 탭
3. `db/20260204_initial_schema.sql` 파일 내용 복사
4. Query 창에 붙여넣기
5. "Run Query" 클릭

#### 방법 B: Vercel CLI

```bash
vercel postgres -- < db/20260204_initial_schema.sql
```

### 5. 슈퍼 관리자 계정 생성

#### 방법 A: Vercel Dashboard Query

```sql
-- 1. 사용자 생성
INSERT INTO users (email, password_hash, name)
VALUES (
  'admin@yourcompany.com',
  '$2b$10$...',  -- bcrypt 해시 (아래 참조)
  '관리자'
);

-- 2. Organization 생성
INSERT INTO organizations (name, slug)
VALUES ('관리자', 'admin');

-- 3. Profile 생성
INSERT INTO profiles (id, role, organization_id)
SELECT
  u.id,
  'super_admin',
  o.id
FROM users u
CROSS JOIN organizations o
WHERE u.email = 'admin@yourcompany.com'
  AND o.slug = 'admin';
```

**비밀번호 해시 생성:**

```bash
# Node.js에서 실행
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(console.log)"
```

#### 방법 B: API Route 추가 (개발용)

`app/api/setup/route.ts` 생성:

```typescript
import { query } from '@/lib/db/client'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // ⚠️ 프로덕션에서는 이 API를 제거하거나 보호하세요!

  const { email, password, name } = await request.json()

  // 비밀번호 해시
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    // 1. 사용자 생성
    const users = await query<{ id: string }>(`
      INSERT INTO users (email, password_hash, name)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [email, passwordHash, name])

    const userId = users[0].id

    // 2. Organization 생성
    const orgs = await query<{ id: string }>(`
      INSERT INTO organizations (name, slug)
      VALUES ($1, $2)
      RETURNING id
    `, ['관리자', 'admin'])

    const orgId = orgs[0].id

    // 3. Profile 생성
    await query(`
      INSERT INTO profiles (id, role, organization_id)
      VALUES ($1, $2, $3)
    `, [userId, 'super_admin', orgId])

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}
```

사용:
```bash
curl -X POST https://your-app.vercel.app/api/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourcompany.com","password":"your-password","name":"관리자"}'
```

### 6. 배포 확인

1. https://your-project.vercel.app 접속
2. 로그인 페이지로 자동 리다이렉트
3. 생성한 관리자 계정으로 로그인
4. `/admin` 페이지 확인

## 🔐 환경 변수

### 필수 환경 변수

| 변수 | 설명 | 설정 방법 |
|------|------|----------|
| `NEXTAUTH_SECRET` | NextAuth 암호화 키 | 수동 설정 필요 |
| `POSTGRES_*` | DB 연결 정보 | Vercel Postgres 생성 시 자동 |

### 생성 방법

```bash
# NEXTAUTH_SECRET 생성
openssl rand -base64 32
```

Vercel Dashboard → Settings → Environment Variables에 추가

## 🎯 체크리스트

- [ ] GitHub에 코드 push
- [ ] Vercel 프로젝트 생성
- [ ] Vercel Postgres 생성
- [ ] DB 마이그레이션 실행
- [ ] `NEXTAUTH_SECRET` 환경 변수 설정
- [ ] 슈퍼 관리자 계정 생성
- [ ] 로그인 테스트
- [ ] Admin 대시보드 확인

## 🔄 업데이트 배포

코드 변경 후:

```bash
git add .
git commit -m "Update: description"
git push
```

Vercel이 자동으로 감지하고 재배포합니다!

## 🐛 문제 해결

### DB 연결 실패

1. Vercel Dashboard → Storage → Postgres
2. "Settings" 탭에서 환경 변수가 프로젝트에 연결되어 있는지 확인
3. 프로젝트 재배포

### 로그인 안됨

1. `NEXTAUTH_SECRET`이 설정되어 있는지 확인
2. `NEXTAUTH_URL`이 올바른지 확인 (프로덕션에서는 불필요)
3. 슈퍼 관리자 계정이 생성되어 있는지 DB에서 확인

### 환경 변수 확인

```bash
vercel env ls
```

## 📚 참고 문서

- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [NextAuth.js](https://next-auth.js.org/)
