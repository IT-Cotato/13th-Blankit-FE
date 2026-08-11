import type {
  CategoryIconKey,
} from "@/types/category";

export type PlaylistSourceMode =
  | "FIRE"
  | "BALANCE"
  | "TASTE"
  | "CLEAR"
  | "PACK30"
  | null;

export interface AddPlaylistItemsRequest {
  taskIds: number[];
  sourceMode: PlaylistSourceMode;
}

export interface PlaylistOrderItemRequest {
  playlistItemId: number;
  sortOrder: number;
}

export interface UpdatePlaylistOrderRequest {
  items: PlaylistOrderItemRequest[];
}

export interface PlaylistItemResponse {
  playlistItemId: number;
  taskId: number;
  title: string;
  memo: string | null;
  categoryName: string;
  categoryColor: string;
  categoryIconKey: CategoryIconKey;
  sortOrder: number;
  sourceMode: PlaylistSourceMode;
  progressRate: number | null;
}

export interface PlaylistResponse {
  playlistId: number;
  totalCount: number;
  items: PlaylistItemResponse[];
}
