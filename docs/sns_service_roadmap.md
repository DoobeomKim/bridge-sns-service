# SNS 관리 서비스 구현 로드맵

## 🛠️ 기술 스택 & 아키텍처

```
프론트엔드: React/Next.js + Tailwind + PWA
백엔드: Node.js/Python (FastAPI)
DB: PostgreSQL + Redis (캐싱)
AI: Claude API (우선), Replicate (이미지)
인프라: Vercel + Supabase
PWA: next-pwa, Service Worker, Web App Manifest
```

---

## 🎯 Phase별 구현 계획

### Phase 0: 웹 MVP (4-6개월) - 핵심만

**목표**: 웹 기반 베타 고객 5-10개 확보
**플랫폼**: 웹 브라우저 (데스크톱 + 모바일 웹)
**사용자 구조**:
- 슈퍼 관리자 계정 1개 (우리 회사)
- 베타 고객 계정 5-10개 (수동 생성)
- 멀티테넌시 기본 구조

#### ✅ 구현 항목

**1. 톤앤매너 학습 (가장 중요)**
```python
# 기술 구현 (완전히 합법적 ✅)
# 방법: OAuth 인증 → 사용자 동의 하에 본인 계정 데이터 수집
# - Instagram Graph API로 본인 기존 포스트 조회
# - 사용자가 로그인 후 "데이터 수집 허용" 클릭
# - OpenAI Few-shot learning (MVP)
# - Fine-tuning (Phase 1, 더 정확)
# - 브랜드별 프롬프트 템플릿 저장

# 구현 난이도: 중
# 개발 기간: 2주
# 크롤링 아님! API + OAuth 인증 = 합법적 ✅
```

**2. 포스팅 생성 (텍스트만)**
```python
# API 연동
- Claude API (한글 우수)
- 주제 입력 → 3가지 버전 생성
- 해시태그 자동 추천 (트렌드 키워드 DB)

# 구현 난이도: 하
# 개발 기간: 1주
```

**3. 간단한 스케줄러**
```python
# 기능
- 예약 발행 (날짜/시간 지정)
- Instagram 자동 포스팅 (MVP)
- LinkedIn 자동 포스팅 (Phase 1)
- 기본 타이밍 추천 (업종별 통계 기반)

# 구현 난이도: 중
# 개발 기간: 2주 (Instagram만), 3주 (LinkedIn 포함)
# 필요 API: Meta Graph API (필수), LinkedIn API (Phase 1)
```

**4. 기본 대시보드 (웹)**
```javascript
// 기능
- 포스트 리스트
- 간단한 engagement 통계
- 예약 캘린더 뷰
- 반응형 디자인 (모바일 웹 대응)

// 구현 난이도: 하
// 개발 기간: 1주
```

**5. 사용자 관리 시스템 (간단한 멀티테넌시)**
```typescript
// DB 스키마 (Supabase/PostgreSQL)
// 초기 5-10명 규모에 최적화

// 1. Organizations (고객사)
organizations {
  id: uuid
  name: string
  slug: string  // k-beauty-brand-a
  created_at: timestamp
}

// 2. Users (사용자)
users {
  id: uuid
  email: string
  role: enum ['super_admin', 'org_admin', 'member']
  organization_id: uuid  // FK
  created_at: timestamp
}

// 3. Instagram Accounts (연동된 계정)
instagram_accounts {
  id: uuid
  organization_id: uuid  // FK
  instagram_user_id: string
  username: string
  access_token: encrypted_string
  brand_tone: jsonb  // 학습된 톤앤매너
  created_at: timestamp
}

// 4. Posts (생성된 포스트)
posts {
  id: uuid
  organization_id: uuid  // FK (데이터 격리)
  instagram_account_id: uuid  // FK
  content: text
  status: enum ['draft', 'scheduled', 'published']
  scheduled_at: timestamp
  created_at: timestamp
}

// 권한 구조 (간단하게)
super_admin:
  - 모든 organization 조회/관리
  - 사용자 수동 생성
  - 시스템 설정 변경

org_admin:
  - 자기 organization 데이터만
  - Instagram 계정 연동
  - 포스트 생성/관리

member:
  - Phase 1 이후 (당분간 불필요)
```

**구현 방식 (MVP):**
```typescript
// 슈퍼 관리자 기능
// /admin/organizations - 고객사 리스트
// /admin/organizations/new - 수동으로 고객 추가
// /admin/users - 모든 사용자 조회

// 일반 사용자 기능
// /dashboard - 본인 organization 데이터만
// /posts - 본인 포스트만
// /settings - 본인 설정만

// Supabase Row Level Security (RLS) 활용
// 자동으로 organization_id로 데이터 격리
```

**초기 설정 플로우:**
```bash
1. 슈퍼 관리자 계정 생성 (우리)
2. 베타 고객사 5-10개 수동 추가
3. 각 고객사에 org_admin 계정 생성
4. 초대 이메일 발송 (비밀번호 설정 링크)
5. 고객이 로그인 → Instagram 연동
6. 서비스 시작!
```

**구현 난이도**: ⭐⭐
**개발 기간**: 1주
**참고**: Supabase Auth + RLS로 대부분 자동화

**웹 MVP 핵심**:
- **"주제 입력 → 브랜드 톤으로 포스트 3개 생성 → 예약 발행"**
- 웹 브라우저에서 완전히 동작
- **5-10개 고객사를 슈퍼 관리자가 관리**
- 이것만 되면 판매 가능

**웹 MVP 제외 항목**:
- PWA 기능 (Phase 0.5)
- 비주얼 생성 (Phase 1)
- 트렌드 감지 (Phase 1)
- 댓글 자동 응답 (Phase 2)
- 경쟁사 분석 (Phase 1)
- 네이버 블로그 (정식 출시 이후 - API 미지원)
- Twitter/X (제외 - API 비용 과다 $5,000/월)

---

### Phase 0.5: PWA 전환 (2-3주)

웹 MVP 검증 후 앱처럼 사용 가능하게

**목표**: 모바일 사용성 대폭 개선 + 설치 가능한 앱

#### ✅ PWA 구현

**1. next-pwa 설치 및 설정**
```bash
# 설치
npm install next-pwa
npm install -D webpack

# next.config.js 설정
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // 기존 Next.js 설정
})
```

**2. Web App Manifest 생성**
```json
// public/manifest.json
{
  "name": "SNS 자동화 매니저",
  "short_name": "SNS Manager",
  "description": "AI 기반 SNS 콘텐츠 자동 생성 및 관리",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**3. 홈 화면 추가 프롬프트**
```javascript
// components/InstallPrompt.tsx
'use client'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    })
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowInstall(false)
      }
    }
  }

  if (!showInstall) return null

  return (
    <div className="install-banner">
      <p>앱으로 설치하여 더 편리하게 사용하세요</p>
      <button onClick={handleInstall}>홈 화면에 추가</button>
    </div>
  )
}
```

**4. Service Worker 기본 설정**
```javascript
// next-pwa가 자동 생성하지만, 커스텀 필요시:
// public/sw.js
self.addEventListener('fetch', (event) => {
  // 오프라인 시 기본 캐시 전략
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

**5. 푸시 알림 준비 (선택)**
```javascript
// 나중에 Phase 1에서 활성화
// 예: "예약된 포스트 발행됨" 알림
```

**PWA 기능:**
- ✅ 홈 화면 아이콘 추가
- ✅ 전체 화면 실행 (브라우저 UI 제거)
- ✅ 오프라인 기본 지원
- ✅ 빠른 로딩 (캐싱)
- ⏳ 푸시 알림 (Phase 1)

**구현 난이도**: ⭐⭐ (next-pwa가 대부분 자동화)
**개발 기간**: 2-3주 (테스트 포함)
**비용 추가**: $0 (인프라 동일)

**왜 PWA인가?**
- 📱 모바일 앱처럼 사용 가능 (앱스토어 불필요)
- 🚀 설치 용량 거의 없음
- 💰 앱스토어 수수료 없음 (30%)
- 🔄 업데이트 즉시 반영
- 🌐 iOS, Android 동시 지원
- 💻 데스크톱도 지원

---

### Phase 1: 기능 확장 (3-4개월)

베타 고객 피드백 받으며 추가

#### ✅ 추가 구현

**5. PWA 푸시 알림**
```javascript
// Service Worker에 푸시 알림 추가
// 기능
- 예약 포스트 발행 알림
- engagement 급상승 알림
- 댓글 알림

// 구현
- Firebase Cloud Messaging (무료)
- 또는 OneSignal (무료 플랜)

// 구현 난이도: 중
// 개발 기간: 1주
```

**6. AI 이미지 생성**
```python
# API 선택지
1. Stable Diffusion (Replicate) - 저렴 (추천!)
2. DALL-E 3 (OpenAI) - 가장 안정적
3. Midjourney (비공식 API) - 품질 최고

# 구현
- 포스트 내용 → 이미지 프롬프트 자동 생성
- 브랜드 컬러/스타일 학습
- 플랫폼별 크롭 (1:1, 16:9, 4:5)

# 구현 난이도: 중상
# 개발 기간: 3주
```

**7. LinkedIn 연동**
```python
# LinkedIn API 활용
- LinkedIn Share API 연동
- 비즈니스 계정 자동 포스팅
- 프로필 최적화 제안

# 구현 난이도: 중
# 개발 기간: 2주
# 주의: LinkedIn Developer Program 신청 필요 (2-4주)
```

**8. 티스토리 블로그 연동**
```python
# 티스토리 Open API
- 블로그 자동 포스팅
- 카테고리 자동 분류
- 한국 시장 타겟

# 구현 난이도: 하
# 개발 기간: 1주
```

**9. 기본 트렌드 감지**
```python
# 데이터 소스
- Google Trends API
- Instagram Hashtag Analytics
- Reddit Trending (공개 데이터)

# 알고리즘
- 브랜드 키워드 매칭
- 연관도 점수 계산
- 초안 자동 생성

# 구현 난이도: 중상
# 개발 기간: 2주
# 참고: Twitter/X는 API 비용 문제로 제외
```

**10. 경쟁사 분석 (기본)**
```python
# 사용자 입력 기반 (크롤링 ❌)
- 경쟁사 URL 입력 → 공개 정보 분석
- 하루 5개 제한
- 기본 인사이트 제공

# 구현 난이도: 중상
# 개발 기간: 2주
```

---

### Phase 2: 정식 출시 (6-12개월)

유료 고객 확보하며 고도화

#### ✅ 추가 구현

**11. 댓글 자동 응답**
```python
# AI 모델
- 댓글 감성 분석 (긍정/부정/중립)
- 브랜드 톤으로 자동 답변 생성
- 승인 워크플로우
- PWA 푸시 알림 연동 (긴급 댓글 알림)

# 구현 난이도: 상
# 개발 기간: 3주
```

**12. 실시간 성과 대시보드**
```javascript
// 기능
- Engagement rate 실시간 추적
- 시간대별 반응 분석
- 급상승/급하락 PWA 푸시 알림

// 데이터 소스
- Meta Graph API
- LinkedIn API
- 자체 DB 분석

// 구현 난이도: 중상
// 개발 기간: 3주
```

**13. 경쟁사 벤치마킹 (고급)**
```python
# Phase 1 기능 확장
- 자동 주간 리포트
- 다수 경쟁사 비교 (최대 10개)
- 트렌드 예측 AI
- 경쟁사 신규 포스트 PWA 알림

# 구현 난이도: 상
# 개발 기간: 3주
```

---

## 🔧 구체적 구현 방법

### 1. 톤앤매너 학습 (핵심!) - OAuth 기반

```python
# 구현 방식 A: Few-shot Learning (빠름, 저렴)
import anthropic

def learn_brand_tone_via_oauth(user_instagram_token):
    """
    OAuth 인증으로 본인 Instagram 포스트 수집
    크롤링 ❌ 합법적 API 사용 ✅
    """
    # 1. Instagram Graph API로 본인 포스트 조회
    # 사용자가 로그인 후 "데이터 수집 허용" 버튼 클릭
    instagram_posts = fetch_user_posts(
        access_token=user_instagram_token,
        fields="caption,timestamp,like_count,comments_count",
        limit=20  # 최근 20개 포스트
    )

    # 2. Claude로 브랜드 톤 분석 (한글 우수)
    claude = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

    analysis_prompt = f"""
    다음은 브랜드의 최근 포스트들입니다:
    {[post['caption'] for post in instagram_posts]}

    이 브랜드의 특징을 분석하세요:
    1. 말투 (반말/존댓말, 이모티콘 사용 등)
    2. 자주 쓰는 표현과 단어
    3. 콘텐츠 톤 (친근함/전문적/유머러스)
    4. 타겟 오디언스
    5. 문장 길이와 구조
    6. 해시태그 스타일
    """

    style_guide = claude.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": analysis_prompt}]
    )

    # 3. 성과 좋은 포스트 별도 저장
    top_performing = sorted(
        instagram_posts,
        key=lambda x: x['like_count'] + x['comments_count'] * 2,
        reverse=True
    )[:5]

    return {
        "style_guide": style_guide.content,
        "top_posts": top_performing,
        "sample_count": len(instagram_posts)
    }

# OAuth 플로우:
# 1. 사용자: "Instagram 연결" 클릭
# 2. Instagram 로그인 페이지로 리다이렉트
# 3. 권한 승인: "○○ 서비스가 내 포스트를 읽을 수 있도록 허용"
# 4. Access Token 발급
# 5. 우리 서비스가 합법적으로 포스트 읽기 ✅

# 구현 방식 B: Fine-tuning (Phase 1)
# - Claude Fine-tuning (2024년 출시)
# - 또는 OpenAI Fine-tuning
# - 최소 50개 이상 포스트 필요
# - 월 $100-300 추가 비용
```

**왜 이건 합법인가?**
- ✅ 본인 계정 데이터 (타인 크롤링 ❌)
- ✅ 사용자의 명시적 동의 (OAuth)
- ✅ 공식 API 사용 (Instagram Graph API)
- ✅ Instagram 약관 준수

**추천**: Phase 0에서는 **Few-shot + OAuth**, Phase 1에서 **Fine-tuning** 추가

---

### 2. 멀티테넌시 구현 (5-10명 고객 관리)

```sql
-- Supabase DB 스키마
-- organizations 테이블
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- users 테이블 (Supabase Auth 확장)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'org_admin')) NOT NULL DEFAULT 'org_admin',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instagram 계정
CREATE TABLE instagram_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  instagram_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL,  -- 암호화 필요
  brand_tone JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, instagram_user_id)
);

-- 포스트
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  instagram_account_id UUID REFERENCES instagram_accounts(id) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published')) DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - 데이터 자동 격리
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- org_admin은 자기 organization 데이터만
CREATE POLICY "Users can view own org posts"
  ON posts FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id
      FROM profiles
      WHERE id = auth.uid()
    )
  );

-- super_admin은 모든 데이터
CREATE POLICY "Super admin can view all posts"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
```

```typescript
// 슈퍼 관리자 대시보드
// app/admin/organizations/page.tsx
export default async function AdminOrganizations() {
  const supabase = createServerClient()

  // 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (profile?.role !== 'super_admin') {
    redirect('/dashboard')
  }

  // 모든 고객사 조회
  const { data: organizations } = await supabase
    .from('organizations')
    .select(`
      *,
      profiles(count),
      instagram_accounts(count),
      posts(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>고객사 관리</h1>
      <button>+ 새 고객사 추가</button>

      <table>
        <thead>
          <tr>
            <th>고객사명</th>
            <th>사용자 수</th>
            <th>Instagram 계정</th>
            <th>포스트 수</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {organizations?.map(org => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>{org.profiles?.[0]?.count || 0}</td>
              <td>{org.instagram_accounts?.[0]?.count || 0}</td>
              <td>{org.posts?.[0]?.count || 0}</td>
              <td>{new Date(org.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

```typescript
// 고객사 추가 폼
// app/admin/organizations/new/page.tsx
export default function NewOrganization() {
  async function createOrganization(formData: FormData) {
    'use server'

    const supabase = createServerClient()
    const name = formData.get('name') as string
    const adminEmail = formData.get('adminEmail') as string

    // 1. Organization 생성
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single()

    if (orgError) throw orgError

    // 2. 관리자 계정 생성 (초대 이메일)
    const { data: user, error: userError } = await supabase.auth.admin.inviteUserByEmail(
      adminEmail,
      {
        data: {
          organization_id: org.id,
          role: 'org_admin'
        }
      }
    )

    // 3. Profile 생성
    await supabase
      .from('profiles')
      .insert({
        id: user?.user?.id,
        email: adminEmail,
        role: 'org_admin',
        organization_id: org.id
      })

    redirect('/admin/organizations')
  }

  return (
    <form action={createOrganization}>
      <input name="name" placeholder="고객사명 (예: K뷰티브랜드A)" required />
      <input name="adminEmail" type="email" placeholder="관리자 이메일" required />
      <button type="submit">고객사 추가 + 초대 이메일 발송</button>
    </form>
  )
}
```

```typescript
// 일반 사용자 대시보드 (자동 데이터 격리)
// app/dashboard/page.tsx
export default async function Dashboard() {
  const supabase = createServerClient()

  // RLS로 자동으로 본인 organization 데이터만 조회됨!
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>내 포스트</h1>
      {/* 자동으로 본인 organization 포스트만 보임 */}
      {posts?.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  )
}
```

**초기 세팅 스크립트:**
```bash
# 1. 슈퍼 관리자 계정 생성
npx supabase-cli exec sql "
INSERT INTO profiles (id, email, role)
VALUES (
  'your-user-id',
  'admin@yourcompany.com',
  'super_admin'
);
"

# 2. 베타 고객사 대량 추가 (CSV 업로드)
# organizations.csv:
# name,admin_email
# K뷰티브랜드A,brand-a@example.com
# K뷰티브랜드B,brand-b@example.com
```

**보안 포인트:**
- ✅ Supabase RLS로 데이터 자동 격리
- ✅ Access Token 암호화 저장 필수
- ✅ 슈퍼 관리자 2FA 권장 (Phase 1)
- ✅ API Rate Limiting (고객별)

**구현 난이도**: ⭐⭐
**개발 기간**: 1주
**이점**:
- 5-10명 고객 관리 완벽
- 확장 가능한 구조 (나중에 100명도 OK)
- Supabase가 대부분 자동 처리

---

### 3. PWA 구현 (웹→앱 전환)

```bash
# Step 1: next-pwa 설치
npm install next-pwa
```

```javascript
// Step 2: next.config.js 설정
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.instagram\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'instagram-api',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
})

module.exports = withPWA({
  reactStrictMode: true,
  // 기존 설정...
})
```

```json
// Step 3: public/manifest.json 생성
{
  "name": "SNS 자동화 매니저",
  "short_name": "SNS Manager",
  "description": "AI 기반 SNS 콘텐츠 자동 생성 및 관리",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

```typescript
// Step 4: app/layout.tsx에 메타데이터 추가
export const metadata: Metadata = {
  title: 'SNS 자동화 매니저',
  description: 'AI 기반 SNS 콘텐츠 자동 생성 및 관리',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SNS Manager'
  },
  formatDetection: {
    telephone: false
  }
}
```

```typescript
// Step 5: 홈 화면 추가 프롬프트 컴포넌트
// components/InstallPrompt.tsx
'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA 설치 완료')
    }

    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const handleDismiss = () => {
    setShowInstall(false)
    // 7일 동안 다시 보지 않기
    localStorage.setItem('installPromptDismissed', Date.now().toString())
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:w-96">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold mb-1">앱으로 설치하기</h3>
          <p className="text-sm text-gray-300 mb-3">
            홈 화면에 추가하여 더 빠르고 편리하게 사용하세요
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
            >
              설치하기
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-300 px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              나중에
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
```

```typescript
// Step 6: iOS Safari용 메타 태그 (app/layout.tsx)
<head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="SNS Manager" />
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
</head>
```

**PWA 테스트 체크리스트:**
- [ ] Chrome DevTools > Application > Manifest 확인
- [ ] Chrome DevTools > Lighthouse > PWA 점수 확인
- [ ] Android Chrome: "홈 화면에 추가" 테스트
- [ ] iOS Safari: 공유 → "홈 화면에 추가" 테스트
- [ ] 오프라인 모드에서 기본 페이지 로드 확인
- [ ] 아이콘이 정상적으로 표시되는지 확인

**예상 결과:**
- ✅ Lighthouse PWA 점수: 90+ (최적화 완료)
- ✅ 설치 프롬프트 자동 표시
- ✅ 홈 화면 아이콘 추가 후 전체 화면 실행
- ✅ iOS/Android 동시 지원

---

### 3. 플랫폼별 자동 포스팅 (Instagram)

```javascript
// Instagram 자동 포스팅
const publishToInstagram = async (content, imageUrl) => {
  // Meta Graph API 사용
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${igUserId}/media`,
    {
      method: 'POST',
      body: JSON.stringify({
        image_url: imageUrl,
        caption: content,
        access_token: userAccessToken
      })
    }
  );
  
  const mediaId = response.id;
  
  // 실제 발행
  await fetch(
    `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
    {
      method: 'POST',
      body: JSON.stringify({
        creation_id: mediaId,
        access_token: userAccessToken
      })
    }
  );
};

// LinkedIn 자동 포스팅
const publishToLinkedIn = async (content) => {
  // LinkedIn Share API
  await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${linkedinToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: 'NONE'
        }
      }
    })
  });
};
```

**필요한 것**:
- Meta Business 계정
- Instagram Business/Creator 계정
- LinkedIn API 접근 권한 (Phase 1)
- OAuth 2.0 인증 구현

**제외된 플랫폼**:
- ❌ Twitter/X: API 비용 과다 (Pro $5,000/월)
- ❌ 네이버 블로그: 공식 쓰기 API 미지원
- ✅ 티스토리: Phase 1에서 네이버 대안으로 추가

---

### 4. 티스토리 블로그 연동 (네이버 대안)

```python
# 티스토리 Open API (공식 지원 ✅)
import requests

def post_to_tistory_blog(blog_name, title, content, category):
    """
    티스토리 블로그 자동 포스팅
    공식 API 지원으로 안정적
    """
    url = "https://www.tistory.com/apis/post/write"

    data = {
        "access_token": TISTORY_ACCESS_TOKEN,
        "blogName": blog_name,
        "title": title,
        "content": content,
        "category": category,
        "tag": "AI,마케팅,자동화",
        "visibility": "0"  # 0:비공개, 1:보호, 3:발행
    }

    response = requests.post(url, data=data)
    return response.json()
```

**네이버 블로그 현황**:
- ❌ 공식 쓰기 API 미제공 (읽기만 가능)
- 브라우저 자동화(Selenium) 가능하지만 약관 위반 리스크
- **결정**: 정식 출시 이후 검토 (우선순위 낮음)

**티스토리 장점**:
- ✅ 공식 API 완전 지원
- 한국 시장 블로그 2위
- OAuth 2.0 인증 지원

---

### 5. AI 이미지 생성

```python
# DALL-E 3 사용 (추천)
import openai

def generate_image(post_content, brand_style):
    """
    포스트 내용 기반 이미지 자동 생성
    """
    # 포스트 → 이미지 프롬프트 변환
    image_prompt = f"""
    Create a professional social media image for:
    {post_content}
    
    Style: {brand_style}
    - Colors: brand primary colors
    - Mood: modern, clean, engaging
    - Format: Instagram post (1080x1080)
    """
    
    response = openai.images.generate(
        model="dall-e-3",
        prompt=image_prompt,
        size="1024x1024",
        quality="standard",  # 또는 "hd"
        n=1
    )
    
    return response.data[0].url

# 비용: 이미지 1개당 $0.04 (standard), $0.08 (HD)
```

**대안**:
- **Replicate (Stable Diffusion)**: 더 저렴 (~$0.005/이미지)
- **Midjourney**: 품질 최고, 하지만 공식 API 없음

---

### 6. 트렌드 자동 감지

```python
# Google Trends + Reddit + Instagram 조합
from pytrends.request import TrendReq
import praw  # Reddit API

def detect_trending_topics(brand_keywords):
    """
    브랜드와 연관된 트렌드 감지
    """
    # Google Trends
    pytrends = TrendReq(hl='ko-KR', tz=360)
    pytrends.build_payload(brand_keywords, timeframe='now 7-d')
    trends = pytrends.interest_over_time()

    # Reddit Trending (무료!)
    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent="sns-service-analyzer"
    )
    trending_posts = reddit.subreddit('all').hot(limit=50)

    # Instagram Hashtag Insights (자체 DB)
    # 사용자들의 성과 좋은 해시태그 집계

    # 브랜드 연관성 점수 계산
    relevant_trends = calculate_relevance(trends, brand_keywords)

    return relevant_trends

def auto_generate_draft(trend, brand_tone):
    """
    트렌드 기반 포스트 초안 자동 생성
    """
    prompt = f"""
    트렌드: {trend}
    브랜드 톤: {brand_tone}
    
    이 트렌드를 활용한 포스트를 작성하세요.
    자연스럽게 브랜드와 연결하세요.
    """
    
    draft = openai.chat.completions.create(...)
    return draft
```

---

### 7. 경쟁사 분석 구현 (크롤링 없이)

```python
# 합법적 경쟁사 분석 시스템
def analyze_competitor(instagram_url, user_id):
    """
    사용자 요청 기반 경쟁사 분석
    크롤링 ❌ 공식 API ✅
    """
    # 1. 일일 제한 확인
    if get_daily_analysis_count(user_id) >= 5:
        return {"error": "일일 분석 한도 초과 (5개)"}

    # 2. 공개 프로필 정보만 조회
    # Instagram Basic Display API 또는 Graph API
    profile_data = fetch_public_profile(instagram_url)

    # 3. 기본 통계 수집
    stats = {
        "follower_count": profile_data.followers,
        "post_count": profile_data.media_count,
        "engagement_rate": calculate_engagement(profile_data),
        "posting_frequency": estimate_frequency(profile_data),
        "top_hashtags": extract_hashtags(profile_data.recent_posts)
    }

    # 4. AI 분석 (Claude)
    analysis = claude.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{
            "role": "user",
            "content": f"""
            경쟁사 분석:
            팔로워: {stats['follower_count']}
            포스트 수: {stats['post_count']}
            참여율: {stats['engagement_rate']}%
            주요 해시태그: {stats['top_hashtags']}

            우리 브랜드와 비교 분석:
            1. 차별화 포인트
            2. 개선 가능 부분
            3. 배울 점
            """
        }]
    )

    # 5. 분석 횟수 기록 (남용 방지)
    increment_analysis_count(user_id)

    return {
        "competitor": instagram_url,
        "stats": stats,
        "insights": analysis.content,
        "next_analysis_available": "7일 후"
    }
```

**제한 사항 (남용 방지)**:
- 하루 5개 계정까지
- 동일 계정 재분석: 7일 후
- 공개 프로필만 가능

**법적으로 안전한 이유**:
- ✅ 공개된 정보만 활용
- ✅ 사용자의 명시적 요청
- ✅ 자동 크롤링 아님
- ✅ 개인정보 비수집
- ✅ GDPR/한국 개인정보보호법 준수

---

## 💰 비용 추정

### Phase 0 (MVP, 월간) - 5-10명 고객 기준
**실제 사용량 기반 추정:**
```
고객 수: 5-10명
포스트/고객/월: 12개 (주 3회)
총 포스트/월: 60-120개

비용 계산:
- Claude API: $100-200
  └ 포스트 생성 60-120개 × $0.015/생성 = $0.90-1.80
  └ 톤앤매너 학습 10개 × $2 = $20
  └ 여유 80-180 (재생성, 테스트)

- Supabase: $25/월 (Pro 플랜)
  └ 10GB DB, 100GB 대역폭 (충분)

- Vercel: $20/월 (Pro 플랫)
  └ PWA 호스팅, Serverless Functions

- Meta API: $0 (무료)
  └ Instagram Graph API 무료

- 개발/테스트: $50-100
  └ 예상치 못한 비용

**총**: ~$195-345/월
```

### Phase 1 (베타 확장, 고객 10-20명)
```
고객 수: 10-20명
포스트/월: 120-240개
이미지 생성 시작 (50% 포스트에 이미지)

비용:
- Claude API: $200-400
- 이미지 생성: $150-300
  └ Replicate: 60-120개 × $0.005 = $0.30-0.60
  └ 재생성 고려 × 10배 = $3-6
  └ 여유 150-300

- Supabase: $25/월
- Vercel: $20/월
- LinkedIn API: $0 (무료)
- 푸시 알림 (Firebase): $0 (무료)

**총**: ~$395-745/월
```

### Phase 2 (정식 출시, 고객 30-50명)
```
고객 수: 30-50명
포스트/월: 360-600개

비용:
- AI (Claude + 이미지): $600-1,000
- Supabase: $25/월 (여전히 Pro 충분)
- Vercel: $20/월
- 모니터링/보안: $50-100
- 고객 지원 도구: $30/월

**총**: ~$725-1,175/월
```

**손익분기점** (₩100,000/월 = $75 기준):
```
Phase 0: 3-5명 고객 ✅
  └ 5명 × $75 = $375 > $345 비용 ✅

Phase 1: 6-10명 고객 ✅
  └ 10명 × $75 = $750 > $745 비용 ✅

Phase 2: 10-16명 고객 ✅
  └ 16명 × $75 = $1,200 > $1,175 비용 ✅

결론: 초기 5명만 확보해도 흑자! 🎉
```

**실제는 더 저렴:**
- Claude API: 실제 사용량은 추정치의 30-50%
- 이미지 생성: 사용자가 선택적으로 사용
- Supabase/Vercel: 초기엔 무료 플랜도 가능

---

## ⚠️ 핵심 도전 과제

### 1. API 제한 & 승인
```
✅ 포함:
- Instagram: Business 계정 필수, Meta App Review (1-2주)
- LinkedIn: Developer Program 신청 (2-4주)
- 티스토리: 간단한 앱 등록 (즉시)

❌ 제외:
- 네이버 블로그: 쓰기 API 미지원 → 정식 출시 후 재검토
- Twitter/X: API 비용 과다 ($5,000/월) → 제외
```

### 2. 한글 AI 품질
```
✅ 해결책:
- Claude > GPT-4 (한글 우수)
- Few-shot 예시 충분히 제공
- 사후 검수 옵션 제공
```

### 3. 법적 이슈 (경쟁사 분석) - 해결됨 ✅
```
✅ 개선된 접근법:
- 크롤링 ❌ → 사용자 요청 기반 일회성 조회 ✅
- 공개 프로필 정보만 (공개 데이터)
- 하루 3-5개 계정 제한 (남용 방지)
- Instagram Basic Display API 활용
- Meta CrowdTangle 검토

⚠️ 여전히 주의:
- robots.txt 준수
- 개인정보 비수집
- 독일 GDPR 준수
```

### 4. 브랜드 일관성 유지
```
✅ 해결책:
- 브랜드 가이드라인 UI 제공
- 금지어/필수어 설정
- 승인 워크플로우
- 학습 피드백 루프
```

---

## 🎬 실행 순서

### Week 1-2: 설계 & 환경 구축
- **DB 스키마 설계** (멀티테넌시!)
  - organizations, profiles, instagram_accounts, posts
  - Supabase RLS 정책 설정
- API 키 발급 (Meta, Claude)
- Next.js 프로젝트 세팅
- Vercel + Supabase 연동
- **슈퍼 관리자 계정 생성**

### Week 3-8: 웹 MVP 개발
- **사용자 관리 시스템** (Week 3)
  - 슈퍼 관리자 대시보드
  - 고객사 수동 추가 기능
  - 초대 이메일 시스템
- **OAuth 인증 플로우** (Week 4)
  - Supabase Auth 설정
  - Instagram OAuth 연동
- **톤앤매너 학습** (Week 4-5)
  - Instagram Graph API 연동
  - Claude 분석 엔진
- **포스팅 생성 엔진** (Week 5-6)
  - Claude API 통합
  - 3가지 버전 생성
  - 해시태그 추천
- **스케줄러** (Week 6-7)
  - 예약 발행 시스템
  - Cron Job (Vercel)
- **기본 웹 UI** (Week 7-8)
  - 반응형 디자인
  - 고객사별 대시보드

### Week 9-10: PWA 전환
- next-pwa 설치 및 설정
- manifest.json 작성
- 홈 화면 추가 프롬프트 구현
- Service Worker 기본 캐싱
- iOS/Android 테스트

### Week 11-12: 내부 테스트
- **우리 회사 계정으로 테스트**
  - 슈퍼 관리자 기능 확인
  - 고객사 추가/관리 테스트
- 친구/지인 2-3명 베타
  - 실제 Instagram 연동 테스트
  - 톤앤매너 학습 품질 확인
- 버그 수정
- PWA 설치 플로우 개선

### Week 13-16: 베타 런칭 (5-10명 모집)
- **슈퍼 관리자 대시보드로 고객 관리**
  1. K-뷰티 브랜드 5-10개 선정
  2. 슈퍼 관리자가 고객사 추가
  3. 초대 이메일 발송
  4. 온보딩 지원 (1:1)
- 피드백 수집 (주간 미팅)
- 빠른 iteration
- PWA 사용성 개선
- **사용량 모니터링** (API 비용 추적)

### Week 17-20: Phase 1 준비
- LinkedIn API 신청
- 푸시 알림 구현 (Firebase/OneSignal)
- 이미지 생성 프로토타입

---

## ✅ 실현 가능성 판단 (2024 업데이트)

| 항목 | 난이도 | 구현 가능 | Phase |
|------|--------|-----------|-------|
| 톤앤매너 학습 (OAuth) | ⭐⭐⭐ | ✅ 완전히 합법 | Phase 0 (웹 MVP) |
| 텍스트 생성 (Claude) | ⭐⭐ | ✅ | Phase 0 |
| Instagram 연동 | ⭐⭐⭐ | ✅ | Phase 0 |
| 스케줄링 | ⭐⭐ | ✅ | Phase 0 |
| 반응형 웹 UI | ⭐⭐ | ✅ | Phase 0 |
| **PWA 전환** | ⭐⭐ | ✅ **next-pwa 자동화** | **Phase 0.5** |
| **홈 화면 추가** | ⭐ | ✅ **매우 쉬움** | **Phase 0.5** |
| **오프라인 캐싱** | ⭐⭐ | ✅ **자동** | **Phase 0.5** |
| PWA 푸시 알림 | ⭐⭐⭐ | ✅ | Phase 1 |
| 이미지 생성 (Replicate) | ⭐⭐⭐ | ✅ | Phase 1 |
| LinkedIn 연동 | ⭐⭐⭐ | ✅ | Phase 1 |
| 티스토리 블로그 | ⭐⭐ | ✅ 공식 API | Phase 1 |
| 트렌드 감지 | ⭐⭐⭐ | ✅ | Phase 1 |
| 경쟁사 분석 (기본) | ⭐⭐⭐ | ✅ 합법적 방식 | Phase 1 |
| 댓글 자동 응답 | ⭐⭐⭐⭐ | ⚠️ 품질 이슈 | Phase 2 |
| 네이버 블로그 | ⭐⭐⭐⭐⭐ | ❌ API 미지원 | 정식 출시 이후 |
| Twitter/X | ⭐⭐⭐⭐⭐ | ❌ 비용 과다 | 제외 |

**결론**: **핵심 기능 모두 실현 가능함** ✅

**수정된 개발 계획**:
- **Phase 0 (웹 MVP)**: 4-6개월
  - Instagram + Claude + 스케줄러 + 웹 UI
- **Phase 0.5 (PWA)**: +2-3주
  - next-pwa + manifest + 홈 화면 추가
  - 앱스토어 없이 앱처럼 사용 가능! 🎉
- **Phase 1**: +3-4개월
  - 푸시 알림 + 이미지 생성 + LinkedIn
- 법적 리스크 제거, API 비용 최적화 완료

---

## 📝 다음 단계

1. **Week 1**: 
   - 기술 스택 최종 확정
   - 개발 환경 세팅
   - API 키 발급 시작

2. **Week 2**: 
   - DB 스키마 설계
   - 인증/권한 시스템 구현
   - Instagram API 연동 테스트

3. **Week 3-4**: 
   - 톤앤매너 학습 엔진 개발
   - 첫 번째 프로토타입 완성

4. **Week 5-8**: 
   - 나머지 MVP 기능 개발
   - 내부 테스트 및 디버깅

5. **Week 9-12**:
   - 베타 고객 모집 및 테스트
   - 피드백 기반 개선
   - 공식 런칭 준비

---

## 🔄 2024 업데이트 요약

### ✅ 추가된 것
- **PWA 전환 단계 (Phase 0.5)**: 앱스토어 없이 앱처럼! 🎉
  - next-pwa 자동화 도구 활용
  - 2-3주면 웹→앱 전환 완료
  - iOS/Android 동시 지원
- 티스토리 블로그 연동 (공식 API 지원)
- 합법적 경쟁사 분석 방법 (사용자 입력 기반)
- Reddit 기반 트렌드 감지 (무료)
- Claude API 우선 채택 (한글 우수)

### ❌ 제외된 것
- Twitter/X: API 비용 문제 ($5,000/월)
- 네이버 블로그: 공식 API 미지원 → 정식 출시 이후
- 네이티브 앱 개발: PWA로 충분! (앱스토어 수수료 30% 절감)

### ⚠️ 명확히 한 것
- **개발 순서**: 웹 MVP → PWA 전환 → 기능 확장
- **톤앤매너 학습**: OAuth 인증 방식 (완전히 합법) ✅
- **경쟁사 분석**: 크롤링 ❌ → 공개 데이터 조회 ✅
- **시간 프레임**: 웹 MVP 4-6개월 + PWA 2-3주
- **비용**: 여유 포함하여 1.5배 상향 (PWA는 추가 비용 없음!)

### 🎯 핵심 전략
1. **웹 MVP 먼저**: Instagram + 텍스트 (4-6개월)
2. **PWA 전환**: 앱스토어 없이 앱으로 (+2-3주)
3. **빠른 검증**: 베타 고객 5명
4. **단계적 확장**: 푸시 알림 → LinkedIn → 이미지 생성
5. **법적 리스크 제거**: 모든 기능 공식 API 기반

### 📱 PWA 장점
- 💰 앱스토어 수수료 0% (30% 절감!)
- 🚀 심사 없이 즉시 배포
- 📲 iOS/Android 동시 지원
- 🔄 업데이트 즉시 반영
- 💾 설치 용량 거의 없음

**결론**: 기술적으로 100% 실현 가능, 법적 리스크 없음, PWA로 비용 절감! ✅

---

## ✅ 최종 체크리스트

### 기술적 실현 가능성
- [x] Instagram Graph API: 공식 지원 ✅
- [x] Claude API: 한글 우수 ✅
- [x] LinkedIn API: 공식 지원 ✅
- [x] 티스토리 API: 공식 지원 ✅
- [x] OAuth 인증: 표준 기술 ✅
- [x] 이미지 생성 (Replicate): 저렴하고 안정적 ✅

### 법적 안전성
- [x] 본인 계정 데이터 수집: OAuth 기반 ✅
- [x] 경쟁사 분석: 공개 데이터 + 사용자 요청 ✅
- [x] 크롤링 제거: 모든 불법 요소 제거 ✅
- [x] GDPR 준수: 개인정보 비수집 ✅

### 제외된 위험 요소
- [x] Twitter/X: 비용 문제로 제외 ✅
- [x] 네이버 블로그: API 미지원으로 연기 ✅
- [x] 불법 크롤링: 완전 배제 ✅

### 웹 MVP 개발 준비
- [ ] Meta Business 계정 생성
- [ ] Meta App Review 신청 (1-2주)
- [ ] Claude API 키 발급
- [ ] Supabase 프로젝트 세팅
  - [ ] DB 스키마 생성 (organizations, profiles 등)
  - [ ] RLS 정책 설정
  - [ ] 슈퍼 관리자 계정 생성
- [ ] Vercel 배포 환경 구성
- [ ] Next.js 프로젝트 세팅 (Tailwind)
- [ ] 멀티테넌시 기본 구조
  - [ ] 슈퍼 관리자 대시보드 (/admin)
  - [ ] 고객사 추가 기능
  - [ ] 초대 이메일 시스템
- [ ] OAuth 2.0 인증 구현
  - [ ] Supabase Auth
  - [ ] Instagram OAuth
- [ ] 첫 웹 프로토타입 개발

### PWA 전환 준비 (MVP 완성 후)
- [ ] next-pwa 패키지 설치
- [ ] manifest.json 작성 (앱 이름, 아이콘, 테마)
- [ ] 앱 아이콘 제작 (192x192, 512x512)
- [ ] 홈 화면 추가 UI 구현
- [ ] iOS Safari 테스트
- [ ] Android Chrome 테스트
- [ ] 오프라인 동작 확인

### 시장 진입 전략
- [ ] K-뷰티 브랜드 리스트 작성
- [ ] 베타 테스터 5명 모집
- [ ] 가격 전략 확정 (₩50,000-100,000)
- [ ] 랜딩 페이지 제작
- [ ] 사례 연구 준비

**다음 단계**: Meta Business 계정 생성 및 App Review 신청부터 시작! 🚀
