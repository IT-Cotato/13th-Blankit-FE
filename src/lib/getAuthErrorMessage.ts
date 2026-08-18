import {
    isAnotherDeviceLoggedInError,
    isInvalidCredentialsError,
    isRefreshTokenConflictError,
    isValidationError,
} from "@/lib/isUserNotFoundError";

// 로그인/회원가입 흐름에서 발생한 에러를 사용자에게 보여줄 문구로 변환
export function getAuthErrorMessage(error: unknown): string {
    if (isAnotherDeviceLoggedInError(error)) {
        return "다른 기기에서 이미 로그인 중입니다.";
    }

    if (isRefreshTokenConflictError(error)) {
        return "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    if (isInvalidCredentialsError(error)) {
        return "인증 정보가 올바르지 않습니다. 다시 시도해주세요.";
    }

    if (isValidationError(error)) {
        return "요청 정보가 올바르지 않습니다. 다시 시도해주세요.";
    }

    return "로그인에 실패했습니다. 다시 시도해주세요.";
}
