export type CategoryIconKey =
  | "ctgy-1"
  | "ctgy-2"
  | "ctgy-3"
  | "ctgy-4"
  | "ctgy-5"
  | "ctgy-6"
  | "ctgy-7"
  | "ctgy-8"
  | "ctgy-9"
  | "ctgy-10"
  | "ctgy-11"
  | "ctgy-12";

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
