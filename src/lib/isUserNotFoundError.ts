import { isAxiosError } from "axios";

// /api/auth/login에 가입되지 않은 socialId로 요청 시 확인된 응답:
// 401 상태코드 + { code: "INVALID_CREDENTIALS", message: "..." }
export const isUserNotFoundError = (error: unknown): boolean => {
    if (!isAxiosError(error)) {
        return false;
    }

    return (
        error.response?.status === 401 &&
        error.response?.data?.code === "INVALID_CREDENTIALS"
    );
};
