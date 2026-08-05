export type CategoryIconKey =
  | "alarm"
  | "note"
  | "work"
  | "msg"
  | "pin"
  | "checklist"
  | "hobby"
  | "study"
  | "pen"
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
