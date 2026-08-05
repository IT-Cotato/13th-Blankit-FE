const OAUTH_STATE_STORAGE_KEY = "oauthState";
const OAUTH_NONCE_STORAGE_KEY = "oauthNonce";

export const createAndStoreOauthState = () => {
    const state = crypto.randomUUID();
    sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);
    return state;
};

export const isValidOauthState = (receivedState: string | null) => {
    const storedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
    sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);

    return Boolean(receivedState) && receivedState === storedState;
};

// 구글 ID Token 요청(response_type=id_token)은 nonce 파라미터가 필수
export const createAndStoreOauthNonce = () => {
    const nonce = crypto.randomUUID();
    sessionStorage.setItem(OAUTH_NONCE_STORAGE_KEY, nonce);
    return nonce;
};

export const consumeStoredOauthNonce = () => {
    const storedNonce = sessionStorage.getItem(OAUTH_NONCE_STORAGE_KEY);
    sessionStorage.removeItem(OAUTH_NONCE_STORAGE_KEY);
    return storedNonce;
};
