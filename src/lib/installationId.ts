const INSTALLATION_ID_STORAGE_KEY = "blankit_installation_id";

// 이 브라우저/기기를 식별하는 고유 ID.
// 최초 1회 생성해서 localStorage에 저장하고, 이후에는 재사용함.
export const getInstallationId = (): string => {
    const stored = window.localStorage.getItem(INSTALLATION_ID_STORAGE_KEY);

    if (stored) {
        return stored;
    }

    const newInstallationId = crypto.randomUUID();
    window.localStorage.setItem(INSTALLATION_ID_STORAGE_KEY, newInstallationId);

    return newInstallationId;
};
