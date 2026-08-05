export type CategoryIconKey =
  | "alarm"
  | "note"
  | "work"
  | "daily"
  | "calendar"
  | "checklist"
  | "hobby"
  | "study"
  | "book"
  | "exercise"
  | "housework"
  | "goal";

export type CategoryFormMode = "create" | "update";

export interface Category {
  categoryId: number;
  categoryName: string;
  color: string;
  iconKey: CategoryIconKey;
}

export interface CategoryMutationRequest {
  name: string;
  color: string;
  iconKey: CategoryIconKey;
}
