import {
    GOOGLE_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
} from "@/constants/socialAuth";
import {
    consumeStoredOauthNonce,
    createAndStoreOauthNonce,
    createAndStoreOauthState,
} from "@/lib/oauthState";
import type { SocialAuthResult } from "@/types/auth";

export const buildGoogleAuthUrl = () => {
    const state = createAndStoreOauthState();
    const nonce = createAndStoreOauthNonce();

    const searchParameters = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "id_token",
        scope: "openid email profile",
        state,
        nonce,
    });

    return `${GOOGLE_AUTH_ENDPOINT}?${searchParameters.toString()}`;
};

// 구글 리다이렉트는 id_token, state 등을 URL 프래그먼트(#)에 담아서 돌려줌
export const parseGoogleIdTokenFromHash = (hash: string) => {
    const searchParameters = new URLSearchParams(hash.replace(/^#/, ""));
    return searchParameters.get("id_token");
};

export const parseGoogleStateFromHash = (hash: string) => {
    const searchParameters = new URLSearchParams(hash.replace(/^#/, ""));
    return searchParameters.get("state");
};

// ID Token(JWT)의 payload 부분을 디코딩 — 서명 검증은 백엔드가 수행하므로
// 여기서는 화면 표시용 정보(email, nickname, profileImageUrl)만 꺼내옴
export const decodeGoogleIdTokenPayload = (idToken: string) => {
    const payloadBase64Url = idToken.split(".")[1];
    const payloadBase64 = payloadBase64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const payloadJson = decodeURIComponent(
        atob(payloadBase64)
            .split("")
            .map((character) => {
                return `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`;
            })
            .join(""),
    );

    return JSON.parse(payloadJson);
};

export const fetchGoogleSocialAuthResult = async (
    idToken: string,
): Promise<SocialAuthResult> => {
    const payload = decodeGoogleIdTokenPayload(idToken);
    const storedNonce = consumeStoredOauthNonce();

    if (!storedNonce || payload.nonce !== storedNonce) {
        throw new Error("Invalid Google nonce");
    }

    return {
        socialId: payload.sub,
        socialToken: idToken,
        email: payload.email,
        nickname: payload.name,
        profileImageUrl: payload.picture,
    };
};
