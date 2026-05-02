import { getProductBySlug } from "@/services/products";
import type { PublicProductDetailResponse } from "@/types/product";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function publicProductQueryKey(slug: string) {
	return ["public", "products", "detail", slug] as const;
}

export function usePublicProduct(
	slug: string | undefined,
): UseQueryResult<PublicProductDetailResponse, Error> {
	return useQuery({
		queryKey: publicProductQueryKey(slug ?? ""),
		queryFn: () => getProductBySlug(slug!),
		enabled: Boolean(slug),
	});
}
