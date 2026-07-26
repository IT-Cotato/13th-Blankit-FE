import axios from "axios";

import {
    GOOGLE_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
    GOOGLE_USER_INFO_ENDPOINT,
} from "@/constants/socialAuth";
import { createAndStoreOauthState } from "@/lib/oauthState";
import type { SocialAuthResult } from "@/types/auth";

export const buildGoogleAuthUrl = () => {
    const state = createAndStoreOauthState();

    const searchParameters = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "token",
        scope: "openid email profile",
        state,
    });

    return `${GOOGLE_AUTH_ENDPOINT}?${searchParameters.toString()}`;
};

// 구글 리다이렉트는 access_token을 쿼리스트링(?)이 아니라
// URL 프래그먼트(#)에 담아서 돌려줌
export const parseGoogleAccessTokenFromHash = (hash: string) => {
    const searchParameters = new URLSearchParams(hash.replace(/^#/, ""));
    return searchParameters.get("access_token");
};

export const fetchGoogleSocialAuthResult = async (
    accessToken: string,
): Promise<SocialAuthResult> => {
    const response = await axios.get(GOOGLE_USER_INFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, email, name, picture } = response.data;

    return {
        socialId: sub,
        socialToken: accessToken,
        email,
        nickname: name,
        profileImageUrl: picture,
    };
};
