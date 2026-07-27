import { apiClient } from "@/api/socialAuth/client";
import type {
    ApiEnvelope,
    LoginResponseData,
    NormalizedAuthData,
    ReissueApiResponse,
    SignupResponseData,
    SocialLoginRequest,
    SocialSignupRequest,
} from "@/types/auth";

export const fetchSocialLogin = async (
    payload: SocialLoginRequest,
): Promise<NormalizedAuthData> => {
    const response = await apiClient.post<ApiEnvelope<LoginResponseData>>(
        "/api/auth/login",
        payload,
    );

    const { accessToken, refreshToken, tokenType, user } = response.data.data;

    return { accessToken, refreshToken, tokenType, user };
};

export const fetchSocialSignup = async (
    payload: SocialSignupRequest,
): Promise<NormalizedAuthData> => {
    const response = await apiClient.post<ApiEnvelope<SignupResponseData>>(
        "/api/auth/signup",
        payload,
    );

    const {
        accessToken,
        refreshToken,
        tokenType,
        userId,
        socialProvider,
        email,
        nickname,
        profileImageUrl,
        recommendedDailyTime,
    } = response.data.data;

    return {
        accessToken,
        refreshToken,
        tokenType,
        user: {
            userId,
            socialProvider,
            email,
            nickname,
            profileImageUrl,
            recommendedDailyTime,
        },
    };
};

export const fetchReissueToken = async (refreshToken: string) => {
    const response = await apiClient.post<ReissueApiResponse>(
        "/api/auth/reissue",
        { refreshToken },
    );

    return response.data.data;
};
