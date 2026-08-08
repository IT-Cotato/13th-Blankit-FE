export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

// 구글/카카오 모두 로그인 페이지(/login)로 바로 돌아오도록 통일
// LoginPage가 마운트 시 URL을 검사해 콜백 여부를 스스로 판단함
export const GOOGLE_REDIRECT_URI = `${window.location.origin}/login`;
export const KAKAO_REDIRECT_URI = `${window.location.origin}/login`;

export const GOOGLE_AUTH_ENDPOINT =
    "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_USER_INFO_ENDPOINT =
    "https://www.googleapis.com/oauth2/v3/userinfo";

export const KAKAO_AUTH_ENDPOINT = "https://kauth.kakao.com/oauth/authorize";
export const KAKAO_TOKEN_ENDPOINT = "https://kauth.kakao.com/oauth/token";
export const KAKAO_USER_INFO_ENDPOINT = "https://kapi.kakao.com/v2/user/me";

console.log("[DEBUG] KAKAO_REST_API_KEY:", KAKAO_REST_API_KEY);
console.log("[DEBUG] GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
console.log("[DEBUG] all env:", import.meta.env);
