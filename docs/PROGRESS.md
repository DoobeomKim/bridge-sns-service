# SNS 자동화 서비스 MVP 개발 진행 상황

## 📅 시작일: 2026-02-04

---

## 🎯 목표
- 웹 MVP (4개월): Instagram + Claude + 스케줄러
- PWA 전환 (2-3주): 앱처럼 사용 가능
- 베타 고객 5-10명 확보

---

## ✅ Week 1-2: 설계 & 환경 구축

### 2026-02-04 (Day 1)

#### 완료 ✅
- [x] 기획 문서 작성 (roadmap, planning)
- [x] 기획 문서 백업 (docs/ 폴더)
- [x] 개발 환경 확인 (Node.js v18.20.8 → v20.20.0)
- [x] Node.js 업그레이드 (v20.20.0)
- [x] Next.js 프로젝트 초기화
  - TypeScript ✅
  - Tailwind CSS ✅
  - App Router ✅
  - ESLint ✅
- [x] Git 저장소 초기화
- [x] **Vercel Postgres로 전환** (Supabase → Vercel)
  - @vercel/postgres 설치
  - NextAuth.js v5 설치
  - DB 스키마 Vercel용으로 수정
- [x] NextAuth.js 설정
  - auth.config.ts ✅
  - auth.ts ✅
  - middleware.ts ✅
  - 타입 정의 ✅

#### 진행 중 🚧
- [ ] Vercel 프로젝트 생성 및 연결
- [ ] Vercel Postgres 생성
- [ ] DB 마이그레이션 실행
- [ ] 로그인 페이지 구현

#### 대기 ⏳
- [ ] Meta Business 계정 생성
- [ ] Meta App Review 신청
- [ ] Claude API 키 발급
- [ ] Vercel 배포 환경 구성

---

## 📝 기술 스택 결정

### 프론트엔드
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- PWA (next-pwa) - Phase 0.5

### 백엔드
- Next.js API Routes
- NextAuth.js v5 (인증)
- Vercel Postgres (데이터베이스)

### 데이터베이스
- PostgreSQL (Vercel Postgres / Neon)
- Application Level 권한 관리

### 외부 API
- Claude API (텍스트 생성)
- Instagram Graph API (포스팅)
- Meta Business API (인증)

### 인프라
- Vercel (호스팅 + DB + 배포)
- Vercel Blob (이미지 저장) - Phase 1

---

## 🗂️ 프로젝트 구조 (예정)

```
sns-service/
├── docs/                          # 기획 문서
│   ├── sns_service_roadmap.md
│   ├── sns_service_planning.md
│   └── PROGRESS.md               # 이 파일
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # 일반 사용자
│   │   ├── dashboard/
│   │   ├── posts/
│   │   └── settings/
│   ├── admin/                    # 슈퍼 관리자
│   │   ├── organizations/
│   │   └── users/
│   └── api/                      # API Routes
│       ├── posts/
│       ├── instagram/
│       └── claude/
├── components/                   # React 컴포넌트
├── lib/                         # 유틸리티
│   ├── supabase/
│   ├── instagram/
│   └── claude/
├── public/                      # 정적 파일
│   ├── icons/                   # PWA 아이콘
│   └── manifest.json            # PWA 매니페스트
└── supabase/                    # Supabase 설정
    └── migrations/              # DB 마이그레이션
```

---

## 🔐 환경 변수

```env
# Vercel Postgres (자동 설정)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Claude API
CLAUDE_API_KEY=

# Instagram/Meta
META_APP_ID=
META_APP_SECRET=
META_CLIENT_TOKEN=
```

---

## 📊 마일스톤

### Phase 0: 웹 MVP (16주)
- Week 1-2: 설계 & 환경 구축 ⏳
- Week 3-8: 핵심 기능 개발
- Week 9-10: PWA 전환
- Week 11-12: 내부 테스트
- Week 13-16: 베타 런칭 (5-10명)

### Phase 0.5: PWA (2-3주)
- PWA 전환 완료
- 홈 화면 추가 기능
- iOS/Android 테스트

### Phase 1: 기능 확장 (3-4개월)
- PWA 푸시 알림
- AI 이미지 생성
- LinkedIn 연동
- 티스토리 블로그

---

## 🐛 이슈 & 해결

### 2026-02-04

**이슈 1**: Node.js v18.20.8, 최신 Next.js는 v20.9.0+ 필요
**해결**: Node.js v20.20.0으로 업그레이드 ✅

**이슈 2**: Supabase vs Vercel 선택
**해결**:
- Vercel Postgres로 전환 결정
- 이유: 배포 간편, 비용 투명, Vercel과 완벽한 통합
- Supabase 패키지 제거 완료
- NextAuth.js v5 + Vercel Postgres 조합 채택 ✅

**변경 사항**:
- ❌ Supabase Auth → ✅ NextAuth.js v5
- ❌ Supabase DB → ✅ Vercel Postgres (Neon)
- ❌ Row Level Security → ✅ Application Level 권한 관리
- DB 스키마 수정: auth.users → users 테이블 직접 관리

---

## 💡 배운 점 & 메모

- 멀티테넌시 구조가 처음부터 필요 (5-10명 고객)
- Supabase RLS로 데이터 자동 격리 가능
- PWA로 앱스토어 없이 앱 배포 가능 (30% 수수료 절감)

---

## 📞 다음 할 일

1. Next.js 프로젝트 초기화
2. Supabase 프로젝트 생성
3. DB 스키마 작성 및 마이그레이션
4. 슈퍼 관리자 계정 생성
5. 기본 인증 시스템 구축
