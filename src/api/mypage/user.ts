import { apiClient } from "@/api/client";
import type { ApiEnvelope, AuthUser } from "@/types/auth";

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<ApiEnvelope<AuthUser>>("/api/users/me");

  return response.data.data;
};
