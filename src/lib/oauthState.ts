const OAUTH_STATE_STORAGE_KEY = "oauthState";

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
