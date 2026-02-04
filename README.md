# SNS 자동화 매니저 🚀

AI 기반 SNS 콘텐츠 자동 생성 및 관리 서비스

## 📋 프로젝트 개요

- **목표**: 5-10명 베타 고객을 위한 SNS 자동화 MVP
- **플랫폼**: PWA (Progressive Web App)
- **핵심 기능**: Instagram + Claude AI + 스케줄러

## 🏗️ 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- **Vercel Postgres** (Database)
- **NextAuth.js v5** (Authentication)
- Claude API (텍스트 생성)
- Instagram Graph API

## 🚀 시작하기

### 필수 요구사항

- Node.js 20.9.0 이상
- npm 10 이상
- **Vercel 계정** (Postgres 사용)
- Claude API 키
- Meta Developer 계정 (Instagram API)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 열어서 실제 값으로 수정

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어서 확인

## 🗄️ 데이터베이스

### 멀티테넌시 구조

```
users (NextAuth.js 사용자)
├─ profiles (권한 정보)
│  ├─ role: super_admin (우리)
│  └─ role: org_admin (고객)
├─ organizations (고객사)
├─ instagram_accounts (연동 계정)
└─ posts (생성된 포스트)
```

### DB 설정 (Vercel Postgres)

1. **Vercel 프로젝트 생성 및 연결**
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link
```

2. **Vercel Postgres 생성**
   - Vercel Dashboard → Storage → Create Database
   - Postgres 선택
   - 자동으로 환경 변수 설정됨

3. **마이그레이션 실행**
```bash
# Vercel CLI로 SQL 실행
vercel postgres -- < db/20260204_initial_schema.sql

# 또는 Vercel Dashboard의 Query Editor에서 직접 실행
```

## 📊 개발 로드맵

- **Phase 0 (현재)**: 웹 MVP 개발 (4-6개월)
- **Phase 0.5**: PWA 전환 (2-3주)
- **Phase 1**: 기능 확장 (3-4개월)
- **Phase 2**: 정식 출시 (6개월)

자세한 내용은 `docs/sns_service_roadmap.md` 참조

## 📚 문서

- [기술 로드맵](docs/sns_service_roadmap.md)
- [비즈니스 기획](docs/sns_service_planning.md)
- [개발 진행 상황](docs/PROGRESS.md)

---

**개발 시작일**: 2026-02-04
**현재 상태**: Week 1 - 기본 설정 완료 ✅
