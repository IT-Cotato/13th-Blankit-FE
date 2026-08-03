# 인증(Auth) 시스템 가이드

소셜 로그인 이후 사용자 정보/토큰을 어떻게 저장하고, UI에서 어떻게 꺼내 쓰고, 다른 API와 연결하고, 로그아웃은 어떻게 구현하는지 정리한 문서입니다.

---

## 1. 데이터를 저장하는 방식

로그인/회원가입 관련 상태는 `useAuthStore` (Zustand + `persist` 미들웨어)에서 관리합니다.

```typescript
// store/authStore.ts
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            setAuth: ({ accessToken, refreshToken, user }) => {
                set({ accessToken, refreshToken, user, isAuthenticated: true });
            },
            updateTokens: (accessToken, refreshToken) => {
                set({ accessToken, refreshToken });
            },
            clearAuth: () => {
                set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
            },
        }),
        { name: "auth-storage" },
    ),
);
```

### 핵심 포인트

- **`persist` 미들웨어**가 상태 변경(`set`)이 일어날 때마다 `localStorage`의 `auth-storage` 키에 자동으로 직렬화해서 저장합니다. 개발자가 직접 `localStorage.setItem`을 호출할 필요가 없습니다.
- 저장되는 값은 `accessToken`, `refreshToken`, `user`, `isAuthenticated` 네 가지 상태값이며, 함수(`setAuth`, `updateTokens`, `clearAuth`)는 저장되지 않습니다.
- 로그인/회원가입 성공 시 `setAuth(data)`를 호출하면 저장까지 자동으로 끝납니다. (`hooks/useSocialAuth.ts`에서 `fetchSocialLogin` / `fetchSocialSignup` 응답을 받아 `setAuth`에 넘김)
- 새로고침해도 `persist`가 `localStorage`에서 값을 복원하기 때문에 로그인 상태가 유지됩니다.

### 확인 방법

브라우저 개발자 도구 → Application 탭 → Local Storage → `auth-storage` 키에서 저장된 값을 직접 확인할 수 있습니다.
로그인 정보를 지울 때는 `useAuthStore`의 `clearAuth()`를 호출해 상태를 초기화하면 됩니다. `clearAuth()`는 `persist` 미들웨어가 `auth-storage` 값을 함께 초기화하도록 처리합니다.
개발자 도구에서 `auth-storage` 키를 직접 삭제해 확인하려는 경우, 현재 실행 중인 스토어가 변경된 값을 반영하려면 페이지를 새로고침해야 합니다.

---

## 2. 로그인 시 받아온 정보를 UI에 그리는 방법

`useAuthStore`의 selector를 이용해 필요한 값만 꺼내 쓰면 됩니다. 컴포넌트 전체를 리렌더링하지 않으려면 아래처럼 **필요한 필드만 selector로 구독**하는 걸 권장합니다.

```tsx
import { useAuthStore } from "@/store/authStore";

export const ProfileHeader = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated || !user) {
        return null; // 비로그인 상태 처리
    }

    return (
        <div className="flex items-center gap-2">
            <img
                src={user.profileImageUrl}
                alt={`${user.nickname} 프로필 이미지`}
                className="h-8 w-8 rounded-full"
            />
            <span>{user.nickname}</span>
            <span className="text-xs text-gray-400">{user.socialProvider}</span>
        </div>
    );
};
```

### 주의사항

- `state.user` 하나만 구독하면 `accessToken`이 바뀌어도(예: 토큰 재발급) 이 컴포넌트는 리렌더링되지 않습니다. 원하는 최적화 방향에 맞게 selector를 분리하세요.
- `user`는 로그인 전 `null`일 수 있으므로 항상 null 체크 후 렌더링해야 합니다.
- `user.recommendedDailyTime`은 회원가입 직후 null일 수 있으므로, UI에서 사용할 때 null 처리(예: 기본값 표시 또는 조건부 렌더링)가 필요합니다.
- `AuthUser` 타입(`@/types/auth`)의 `recommendedDailyTime`은 `number | null`로 변경되었으므로, 이 계약을 준수하여 nullable 값을 안전하게 처리하세요.
- `AuthUser` 타입에 정의된 필드(`userId`, `socialProvider`, `email`, `nickname`, `profileImageUrl`, `recommendedDailyTime`)만 사용 가능합니다. 추가 필드가 필요하면 백엔드 응답 구조와 `AuthUser` 타입부터 함께 확장해야 합니다.

---

## 3. 다른 API 연결 시 로그인 데이터를 활용하는 방법
 
인증이 필요한 API를 호출할 때는 `useAuthStore`에서 `accessToken`을 꺼내 요청 헤더에 실어 보내면 됩니다. `apiClient`(`api/client.ts`)에 인터셉터가 이미 등록되어 있어서, **새로 만드는 API 함수는 별도 처리 없이 `apiClient`만 사용하면 자동으로 인증 헤더가 붙습니다.**
 
```typescript
// api/client.ts (실제 구현)
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
 
const REISSUE_ENDPOINT_PATH = "/api/auth/reissue";
 
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
 
// 요청 보낼 때마다 accessToken이 있으면 자동으로 Authorization 헤더에 첨부
apiClient.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;
 
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
 
    return config;
});
 
// accessToken 만료(401) 시 refreshToken으로 자동 재발급 후 원래 요청 재시도
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
 
        const isReissueRequest = originalRequest?.url?.includes(
            REISSUE_ENDPOINT_PATH,
        );
        const isAlreadyRetried = originalRequest?._isRetried;
 
        if (
            error.response?.status !== 401 ||
            isReissueRequest ||
            isAlreadyRetried
        ) {
            return Promise.reject(error);
        }
 
        const { refreshToken, updateTokens, clearAuth } =
            useAuthStore.getState();
 
        if (!refreshToken) {
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(error);
        }
 
        try {
            originalRequest._isRetried = true;
 
            // 순환 참조(client.ts ↔ apis/auth.ts)를 피하기 위해
            // apiClient가 아닌 별도 axios 인스턴스로 직접 요청
            const reissueResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}${REISSUE_ENDPOINT_PATH}`,
                { refreshToken },
            );
            const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            } = reissueResponse.data.data;
 
            updateTokens(newAccessToken, newRefreshToken);
 
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (reissueError) {
            clearAuth();
            window.location.href = "/login";
            return Promise.reject(reissueError);
        }
    },
);
```
 
### 새 API를 추가할 때 해야 할 것 / 하지 말아야 할 것
 
- **해야 할 것**: 인증이 필요한 API는 반드시 `apiClient`를 통해 호출합니다. (`axios` 인스턴스를 새로 만들거나 `fetch`를 직접 쓰면 토큰 자동 첨부·재발급 로직이 적용되지 않습니다.)
- **하지 말아야 할 것**: 개별 API 함수 안에서 `accessToken`을 직접 꺼내 헤더에 수동으로 붙이는 코드는 불필요합니다. (이미 요청 인터셉터가 처리함)
- **재발급(reissue) 요청 자체는 `apiClient`가 아닌 별도 `axios` 인스턴스**로 보냅니다. `api/client.ts`가 `api/auth.ts`를 참조하면 순환 참조가 생기기 때문에 의도적으로 분리된 구조입니다. 이 부분은 그대로 유지해야 합니다.
- 401 응답이 재발급 요청(`/api/auth/reissue`) 자체에서 발생했거나, 이미 한 번 재시도(`_isRetried`)한 요청이면 무한 루프 방지를 위해 재발급을 다시 시도하지 않고 바로 에러를 반환합니다.
- `refreshToken`이 아예 없거나 재발급 자체가 실패하면 `clearAuth()` 후 `/login`으로 강제 이동시킵니다. 즉, 만료된 세션에 대한 로그아웃 처리는 인터셉터 레벨에서 이미 자동으로 이뤄지고 있습니다.
### 핵심 포인트
 
- React 컴포넌트 바깥(axios 인터셉터 등)에서 Zustand 상태를 읽을 땐 훅이 아니라 `useAuthStore.getState()`를 사용합니다. (`useAuthStore((state) => ...)`는 컴포넌트 내부에서만 사용 가능)
- 토큰 재발급/만료 처리는 이미 `api/client.ts`에 전역으로 구현되어 있으므로, 새로운 기능을 개발할 때 이 로직을 각자 다시 구현할 필요가 없습니다.

---

## 4. 로그아웃 구현 방법

로그아웃은 `authStore`의 `clearAuth()`를 호출해 상태(및 `localStorage`)를 초기화하고, 필요하다면 서버에 로그아웃/토큰 무효화 요청을 보내는 순서로 구현합니다.

```tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
// import { fetchLogout } from "@/api/auth"; // 서버에 로그아웃 API가 있다면

export const useLogout = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const logout = async () => {
        try {
            // 서버 측 refreshToken 무효화가 필요하다면 먼저 호출
            // await fetchLogout();
        } catch {
            // 서버 로그아웃 실패해도 클라이언트 상태는 정리
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    return { logout };
};
```

```tsx
// 사용 예시
const { logout } = useLogout();

<button onClick={logout}>로그아웃</button>
```

### 핵심 포인트

- `clearAuth()`만 호출해도 `persist` 미들웨어가 `localStorage`의 `auth-storage` 값도 함께 초기화(덮어쓰기)합니다. 별도로 `localStorage.removeItem`을 호출할 필요는 없습니다.
- 서버에 refreshToken을 무효화하는 API가 있다면(보안상 권장) 클라이언트 상태를 지우기 전에 먼저 호출하는 게 안전합니다. 단, 서버 요청이 실패하더라도 클라이언트 쪽 상태는 정리(`clearAuth`)해서 UI상 로그아웃은 항상 되도록 처리하는 게 일반적입니다.
- 로그아웃 후에는 보호된 라우트에 접근하지 못하도록 `/login`으로 리다이렉트합니다.

---

## 관련 파일 요약

| 역할 | 파일 |
|---|---|
| 인증 상태 저장 (Zustand + persist) | `store/authStore.ts` |
| 소셜 로그인/회원가입 처리 훅 | `hooks/useSocialAuth.ts` |
| 로그인/회원가입/토큰 재발급 API | `api/auth.ts` |
| 인증 관련 타입 정의 | `types/auth.ts` |
| 로그인 페이지 (OAuth 콜백 처리) | `pages/LoginPage.tsx` |
