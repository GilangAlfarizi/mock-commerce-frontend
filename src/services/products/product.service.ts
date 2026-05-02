import { api } from "@/services/axios";
import type {
	ProductListQueryParams,
	PublicProductDetailResponse,
	PublicProductListResponse,
	PublicSort,
} from "@/types/product";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORT: PublicSort = "newest";

function buildListQueryParams(query: ProductListQueryParams = {}) {
	const page = query.page ?? DEFAULT_PAGE;
	const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
	const sort = query.sort ?? DEFAULT_SORT;

	const params: Record<string, string | number> = {
		page,
		pageSize,
		sort,
	};

	if (query.categorySlugs?.length) {
		params.categorySlugs = query.categorySlugs.join(",");
	}

	return params;
}

export async function listProducts(
	query?: ProductListQueryParams,
): Promise<PublicProductListResponse> {
	const { data } = await api.get<PublicProductListResponse>("/products", {
		params: buildListQueryParams(query),
	});
	return data;
}

export async function getProductBySlug(
	slug: string,
): Promise<PublicProductDetailResponse> {
	const { data } = await api.get<PublicProductDetailResponse>(
		`/products/${encodeURIComponent(slug)}`,
	);
	return data;
}
