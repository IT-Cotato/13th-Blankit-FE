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
    installationId: string;
}

export interface SocialSignupRequest {
    socialProvider: SocialProvider;
    socialId: string;
    socialToken: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
    recommendedDailyTime: number | null;
    installationId: string;
}

export interface AuthUser {
    userId: number;
    socialProvider: SocialProvider;
    email: string;
    nickname: string;
    profileImageUrl: string;
    recommendedDailyTime: number | null;
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
