"use client";

import { getAdminProduct } from "@/services/admin/products";
import type { ProductResponse } from "@/types/admin/product";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";

export function adminProductQueryKey(id: string) {
	return ["admin", "products", "detail", id] as const;
}

export function useAdminProduct(
	id: string | undefined,
): UseQueryResult<ProductResponse, Error> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: adminProductQueryKey(id ?? ""),
		queryFn: () => getAdminProduct(id!),
		enabled: status === "authenticated" && Boolean(id),
	});
}
