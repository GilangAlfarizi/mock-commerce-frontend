"use client";

import { ProductListResponse } from "@/types/admin/product";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";
import { listAdminProducts } from "@/services/admin/products";

export const adminProductsQueryKey = ["admin", "products", "list"] as const;

export function useAdminProducts(): UseQueryResult<ProductListResponse, Error> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: adminProductsQueryKey,
		queryFn: () => listAdminProducts(),
    enabled: status === "authenticated"
	});
}
