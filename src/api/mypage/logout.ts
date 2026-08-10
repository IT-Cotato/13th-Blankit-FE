import { apiClient } from "@/api/client";

export const fetchLogout = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout");
};
