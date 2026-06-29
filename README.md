# Blankit Frontend

Blankit 프론트엔드 프로젝트입니다.

## 기술 스택

| 카테고리        | 기술          | 버전     | 설명                     |
| ----------- | ----------- | ------ | ---------------------- |
| **프레임워크**   | React       | 19.2.7 | UI 라이브러리               |
| **언어**      | TypeScript  | 6.0.3  | 타입 안정성                 |
| **번들러**     | Vite        | 8.1.0  | 빠른 개발 서버 & 빌드          |
| **상태 관리**   | Zustand     | 5.0.14 | 클라이언트 상태 관리            |
| **스타일링**    | TailwindCSS | 4.3.1  | 유틸리티 기반 CSS            |
| **컴포넌트 도감** | Storybook   | 10.4.6 | UI 컴포넌트 독립 개발 및 협업 문서화 |

## 시작하기

> **Note**: 이 프로젝트는 **npm**을 패키지 매니저로 사용합니다.

### 0. npm 설치 (없는 경우)

```bash
npm install npm
```

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 스토리북 실행 (UI 컴포넌트 도감)

```bash
npm run storybook
```

---

## 프로젝트 구조

```text
13th-Blankit-FE/
├── public/                         
│   ├── icons/                      # 앱 아이콘, 탭 아이콘
│   ├── fonts/                      # Pretendard 등 폰트 파일
│   ├── manifest.webmanifest        # PWA 설정
│   └── service-worker.js           # 서비스 워커
│
├── src/                            
│   ├── assets/                     
│   │
│   ├── pages/                      # 화면 단위 컴포넌트
│   │   ├── onboarding/             # 온보딩 화면
│   │   ├── login/                  # 로그인 화면
│   │   ├── home/                   # 홈 화면
│   │   ├── task/                   # 과업 등록/검색/플레이 화면
│   │   ├── calendar/               # 캘린더/통계 화면
│   │   └── mypage/                 # 마이페이지/설정 화면
│   │
│   ├── components/                 # 여러 화면에서 재사용하는 UI
│   │   ├── common/                 # Button, Modal, Input 등
│   │   ├── layout/                 # 전체 레이아웃, 페이지 틀
│   │   └── navigation/             # BottomTab 같은 네비게이션
│   │
│   ├── hooks/                      # 공통 커스텀 훅
│   │
│   ├── store/                      # Zustand 상태 관리
│   │   ├── useAppStore.ts          # 예제
│   │
│   ├── types/                      # TypeScript 타입 정의
│   │
│   ├── styles/                     # 스타일 폴더
│   │   ├── index.css               # 전역 스타일, 색상 변수
│   │
│   ├── App.tsx                     # 라우터/전체 앱 구조
│   └── main.tsx                    # 앱 진입점
│
├── package.json                    # 의존성, 실행 스크립트
├── vite.config.ts                  # Vite 설정
├── tsconfig.json                   # TypeScript 설정
└── README.md                       # 프로젝트 설명
```

---

## 새 파일 추가 시 위치 가이드

* **새 컴포넌트: src/components/도메인/컴포넌트명.tsx**
  → JSX + UI 담당

* **커스텀 훅: src/hooks/use훅명.ts**
  → React Hook + 상태/이벤트/사이드이펙트

* **유틸리티 함수: src/lib/함수명.ts**
  → React 비의존, 순수 로직 함수

* **타입 정의: src/types/타입명.ts**
  → interface / type / enum

* **상태 관리: src/store/스토어명.ts**
  → Zustand / 전역 상태

* **정적 파일: public/파일명**
  → 이미지, 아이콘, manifest 등

## 파일/폴더 네이밍

- **컴포넌트**: PascalCase (`Button.tsx`, `HomePage.tsx`)
- **훅**: use + camelCase  (`useLogin.ts`, `useAuthQueries.ts`)
- **zustand 스토어**: use + camelCase + Store (`useAuthStore.ts`)
- **타입**: camelCase + .type 접미사 (`auth.type.ts`)
- **유틸**: camelCase (`formatDate.ts`)

## CSS 테마 변수

`styles/index.css`에 정의된 CSS 변수들입니다. Tailwind와 함께 사용하세요.

기본 Tailwind 유틸리티 접두사(bg-, text-, border-)와 함께 피그마 명칭 그대로 조합하여 사용합니다.

Green: bg-green-100 ~ bg-green-900
Lime: text-lime-100 ~ text-lime-900

### Commit 컨벤션

```
[타입] : 커밋 메시지
```

| 타입 | 설명 |
|------|------|
| `[Feat]` | 새로운 기능 추가 |
| `[Fix]` | 버그 수정 |
| `[Refactor]` | 코드 리팩토링 (기능 변경 없음) |
| `[Style]` | 코드 포맷팅, 세미콜론 누락 등 |
| `[Design]` | UI/UX 디자인 변경 |
| `[Chore]` | 빌드, 설정 파일 수정 |
| `[Docs]` | 문서 수정 |
| `[Test]` | 테스트 코드 추가/수정 |

**예시:**
```
[Feat] : 로그인 페이지 구현
[Fix] : 토큰 만료 시 리다이렉트 오류 수정
[Refactor] : API 호출 로직 분리
[Chore] : ESLint 설정 추가
```

## 깃허브 브랜치 설명

> * `main`은 프로덕션 브랜치로 항상 배포 가능한 상태를 유지합니다.
> * `develop`은 개발 서버 브랜치로, 기능 통합 및 1차 테스트 용도로 사용합니다.
> * 모든 기능 개발은 `feature/*` 브랜치에서 진행하며,
>   `feature → develop → main` 순서로 병합합니다.
> * `develop`, `main` 모두 Vercel로 배포합니다.

### 브랜치 역할 정의

### `main`

* **프로덕션 브랜치**
* 항상 “배포 가능한 상태”
* 실제 사용자에게 보여줄 버전
* **Vercel Production 배포**

### `develop`

* **개발 서버 브랜치**
* 기능 통합 + 1차 테스트 + 리팩토링
* QA / 디자이너 확인용
* **Vercel Preview / Develop 배포**

### `feature/*`

* 실제 작업 브랜치
* 기능 단위로 생성
* 예:

  * `feature/login`
  * `feature/onboarding-step`
  * `feature/bottom-tab-ui`
