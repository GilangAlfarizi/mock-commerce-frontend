import categoriesResponse from "@/mocks/public-categories-response.json";
import productResponses from "@/mocks/public-product-responses.json";
import productsResponse from "@/mocks/public-products-response.json";

export type PublicSort = "newest" | "price_asc" | "price_desc";

export type PublicCategoryDTO = (typeof categoriesResponse.data)[number];
export type PublicProductDTO = (typeof productsResponse.data)[number];
export type PublicProductDetail = (typeof productResponses.responses)[number]["data"];
export type PublicProductResponse = (typeof productResponses.responses)[number];

type ProductListQuery = {
	page: number;
	pageSize: number;
	sort: PublicSort;
	categorySlugs: string[];
};

type PublicProductListResponse = {
	data: PublicProductDTO[];
	message: string;
	metadata: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

export const PUBLIC_PAGE_SIZE = 8;

export function getPublicCategoriesResponse() {
	return categoriesResponse;
}

export function listPublicProductsResponse(query: ProductListQuery): PublicProductListResponse {
	const normalizedCategorySlugs = new Set(query.categorySlugs);
	let items = [...productsResponse.data];

	if (normalizedCategorySlugs.size > 0) {
		items = items.filter((product) =>
			normalizedCategorySlugs.has(product.categorySlug),
		);
	}

	if (query.sort === "price_asc") {
		items = items.sort((a, b) => a.price - b.price);
	}

	if (query.sort === "price_desc") {
		items = items.sort((a, b) => b.price - a.price);
	}

	const total = items.length;
	const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
	const safePage = Math.min(Math.max(query.page, 1), totalPages);
	const start = (safePage - 1) * query.pageSize;
	const data = items.slice(start, start + query.pageSize);

	return {
		data,
		message: productsResponse.message,
		metadata: {
			page: safePage,
			pageSize: query.pageSize,
			total,
			totalPages,
		},
	};
}

export function getPublicProductResponseBySlug(slug: string): PublicProductResponse | null {
	const response =
		productResponses.responses.find((item) => item.data.slug === slug) ?? null;

	return response;
}
