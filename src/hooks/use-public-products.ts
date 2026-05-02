import { listProducts } from "@/services/products";
import type { ProductListQueryParams, PublicProductListResponse } from "@/types/product";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function publicProductsQueryKey(params: ProductListQueryParams) {
	return ["public", "products", "list", params] as const;
}

export function usePublicProducts(
	params: ProductListQueryParams,
): UseQueryResult<PublicProductListResponse, Error> {
	return useQuery({
		queryKey: publicProductsQueryKey(params),
		queryFn: () => listProducts(params),
	});
}
