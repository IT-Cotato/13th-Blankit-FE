import { apiClient } from "@/api/client";

import type { ApiEnvelope } from "@/types/auth";
import type {
  AddPlaylistItemsRequest,
  PlaylistResponse,
} from "@/types/playlistApi";

export async function getPlaylist():
Promise<PlaylistResponse> {
  const response = await apiClient.get<
    ApiEnvelope<PlaylistResponse>
  >("/api/playlist");

  return response.data.data;
}

export async function addPlaylistItems(
  payload: AddPlaylistItemsRequest,
): Promise<PlaylistResponse> {
  const response = await apiClient.post<
    ApiEnvelope<PlaylistResponse>
  >("/api/playlist/items", payload);

  return response.data.data;
}

export async function deletePlaylistItem(
  playlistItemId: number,
): Promise<void> {
  await apiClient.delete(
    `/api/playlist/items/${playlistItemId}`,
  );
}