import type { CategoryFormMode } from "@/types/category";

export function getCategoryFormInitialName(
  mode: CategoryFormMode,
  editingName: string | undefined,
  draftName: string,
): string {
  return mode === "update" ? editingName ?? "" : draftName;
}
