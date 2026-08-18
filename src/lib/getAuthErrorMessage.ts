import axios from "axios";

// /api/auth/login, /api/auth/signup 등 인증 관련 API가 반환하는
// 알려진 에러 코드 → 사용자 안내 문구 매핑
// (SOCIAL_ACCOUNT_NOT_FOUND는 useSocialAuth 내부에서 자동 회원가입으로 처리되므로 여기 없음)
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: "인증 정보가 올바르지 않습니다. 다시 시도해주세요.",
    ANOTHER_DEVICE_ALREADY_LOGGED_IN: "다른 기기에서 이미 로그인 중입니다.",
    REFRESH_TOKEN_CONFLICT:
        "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

const DEFAULT_LOGIN_ERROR_MESSAGE = "로그인에 실패했습니다. 다시 시도해주세요.";

export function getAuthErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const code = error.response?.data?.code as string | undefined;

        if (code && code in AUTH_ERROR_MESSAGES) {
            return AUTH_ERROR_MESSAGES[code];
        }

        // 매핑되지 않은 code(예: 회원가입 관련 에러)라도 서버 message가 있으면 그대로 노출
        const serverMessage = error.response?.data?.message as
            | string
            | undefined;
        if (serverMessage) return serverMessage;
    }

    // 구글 nonce 검증 실패 (fetchGoogleSocialAuthResult에서 던지는 순수 Error)
    if (error instanceof Error && error.message === "Invalid Google nonce") {
        return "구글 로그인 인증에 실패했습니다. 다시 시도해주세요.";
    }

    return DEFAULT_LOGIN_ERROR_MESSAGE;
}
