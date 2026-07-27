export type SocialProvider = "GOOGLE" | "KAKAO";

export interface SocialAuthResult {
    socialId: string;
    socialToken: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
}

export interface SocialLoginRequest {
    socialProvider: SocialProvider;
    socialId: string;
    socialToken: string;
}

export interface SocialSignupRequest {
    socialProvider: SocialProvider;
    socialId: string;
    socialToken: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
    recommendedDailyTime: number | null; // TODO: 백엔드에서 DB 명세 수정 후 수정사항 반영 예정
}

export interface AuthUser {
    userId: number;
    socialProvider: SocialProvider;
    email: string;
    nickname: string;
    profileImageUrl: string;
    recommendedDailyTime: number;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface SignupResponseData extends AuthTokens, AuthUser {}

export interface LoginResponseData extends AuthTokens {
    user: AuthUser;
}

export interface NormalizedAuthData extends AuthTokens {
    user: AuthUser;
}

export interface ApiEnvelope<T> {
    code: string;
    message: string;
    data: T;
}

export interface ReissueTokenData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export type ReissueApiResponse = ApiEnvelope<ReissueTokenData>;
