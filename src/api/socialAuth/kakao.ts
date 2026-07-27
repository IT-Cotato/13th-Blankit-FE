import axios from "axios";

import {
    KAKAO_AUTH_ENDPOINT,
    KAKAO_REDIRECT_URI,
    KAKAO_REST_API_KEY,
    KAKAO_TOKEN_ENDPOINT,
    KAKAO_USER_INFO_ENDPOINT,
} from "@/constants/socialAuth";
import { createAndStoreOauthState } from "@/lib/oauthState";
import type { SocialAuthResult } from "@/types/auth";

export const buildKakaoAuthUrl = () => {
    const state = createAndStoreOauthState();

    const searchParameters = new URLSearchParams({
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        response_type: "code",
        state,
    });

    return `${KAKAO_AUTH_ENDPOINT}?${searchParameters.toString()}`;
};

// TODO: Kakao Developers 콘솔에서 Client Secret이 "사용함"으로 설정되어 있다면,
// 이 토큰 교환 요청은 secret 노출 위험이 있으므로 백엔드 프록시 엔드포인트로 옮겨야 함
const fetchKakaoAccessToken = async (code: string) => {
    const response = await axios.post(
        KAKAO_TOKEN_ENDPOINT,
        new URLSearchParams({
            grant_type: "authorization_code",
            client_id: KAKAO_REST_API_KEY,
            redirect_uri: KAKAO_REDIRECT_URI,
            code,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    );

    return response.data.access_token as string;
};

export const fetchKakaoSocialAuthResult = async (
    code: string,
): Promise<SocialAuthResult> => {
    const accessToken = await fetchKakaoAccessToken(code);

    const response = await axios.get(KAKAO_USER_INFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, kakao_account } = response.data;

    return {
        socialId: String(id),
        socialToken: accessToken,
        email: kakao_account.email,
        nickname: kakao_account.profile.nickname,
        profileImageUrl: kakao_account.profile.profile_image_url,
    };
};
