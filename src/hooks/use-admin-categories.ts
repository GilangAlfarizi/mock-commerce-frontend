"use client";

import { listAdminCategories } from "@/services/admin/categories";
import type { CategoryListResponse } from "@/types/admin/category";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";

export const adminCategoriesQueryKey = ["admin", "categories", "list"] as const;

export function useAdminCategories(): UseQueryResult<CategoryListResponse, Error> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: adminCategoriesQueryKey,
		queryFn: () => listAdminCategories(),
		enabled: status === "authenticated",
	});
}
