import { isAxiosError, type AxiosError } from "axios";

// user 객체 구조
export interface AuthResponseUser {
    userId: number;
    socialProvider: "KAKAO" | "GOOGLE";
    email: string;
    nickname: string;
    profileImageUrl: string;
    recommendedDailyTime: number;
}

// 성공/에러 응답 공통 data 구조
export interface AuthResponseData {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: "Bearer";
    user?: AuthResponseUser;
}

export interface AuthErrorResponseBody {
    code?: string;
    message?: string;
    data?: AuthResponseData;
}

type AuthAxiosError = AxiosError<AuthErrorResponseBody>;

// /api/auth/login에 가입되지 않은 socialId로 요청 시
export const isUserNotFoundError = (
    error: unknown,
): error is AuthAxiosError => {
    if (!isAxiosError<AuthErrorResponseBody>(error)) {
        return false;
    }

    return (
        error.response?.status === 404 &&
        error.response?.data?.code === "SOCIAL_ACCOUNT_NOT_FOUND"
    );
};

// 소셜 토큰 또는 소셜 ID 자체가 유효하지 않아 인증 실패 시
export const isInvalidCredentialsError = (
    error: unknown,
): error is AuthAxiosError => {
    if (!isAxiosError<AuthErrorResponseBody>(error)) {
        return false;
    }

    return (
        error.response?.status === 401 &&
        error.response?.data?.code === "INVALID_CREDENTIALS"
    );
};

// Refresh Token 저장/갱신 시 서버 쪽 충돌(동시 재발급 등)이 발생 시
export const isRefreshTokenConflictError = (
    error: unknown,
): error is AuthAxiosError => {
    if (!isAxiosError<AuthErrorResponseBody>(error)) {
        return false;
    }

    return (
        error.response?.status === 409 &&
        error.response?.data?.code === "REFRESH_TOKEN_CONFLICT"
    );
};

// 요청값 자체의 유효성 오류, 소셜 로그인 파라미터 누락/형식 오류 등.
export const isValidationError = (error: unknown): error is AuthAxiosError => {
    if (!isAxiosError<AuthErrorResponseBody>(error)) {
        return false;
    }

    return error.response?.status === 400;
};
