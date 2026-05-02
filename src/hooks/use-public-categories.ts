import { listCategories } from "@/services/categories";
import type { PublicCategoryListResponse } from "@/types/category";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const publicCategoriesQueryKey = ["public", "categories", "list"] as const;

export function usePublicCategories(): UseQueryResult<
	PublicCategoryListResponse,
	Error
> {
	return useQuery({
		queryKey: publicCategoriesQueryKey,
		queryFn: () => listCategories(),
	});
}
