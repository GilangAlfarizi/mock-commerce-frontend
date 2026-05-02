export type PublicSort = "newest" | "price_asc" | "price_desc";

/** List row — matches `dto.PublicProductDTO`. */
export type PublicProductDTO = {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	imageUrl: string;
	categoryName: string;
	categorySlug: string;
};

export type PublicPaginationMetadata = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
};

/** Paginated list — matches `dto.PublicProductListResponse`. */
export type PublicProductListResponse = {
	data: PublicProductDTO[];
	message: string;
	metadata: PublicPaginationMetadata;
};

export type PublicProductVariant = {
	id: string;
	sku: string;
	size: string;
	color: string;
	price: number;
	stock: number;
};

/** Detail payload — matches `dto.PublicProductDetail`. */
export type PublicProductDetail = {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	imageUrl: string;
	categoryName: string;
	categorySlug: string;
	variants: PublicProductVariant[];
};

/** Single product — matches `dto.PublicProductResponse` (detail envelope). */
export type PublicProductDetailResponse = {
	data: PublicProductDetail;
	message: string;
};

/** Query params for `GET /products` (all optional; service applies API defaults). */
export type ProductListQueryParams = {
	page?: number;
	pageSize?: number;
	sort?: PublicSort;
	categorySlugs?: string[];
};

/** Normalized list query (used by mocks and URL parsing). */
export type ProductListQuery = {
	page: number;
	pageSize: number;
	sort: PublicSort;
	categorySlugs?: string[];
};

export type ProductCardProps = {
	id: string;
	slug: string;
	name: string;
	description: string;
	price: number;
	imageUrl: string;
	categoryName: string;
};

export type ProductsSorterProps = {
	lengthData: number;
	totalData: number;
	categorySlugs: string[];
	sortOptions: Array<{ label: string; value: PublicSort }>;
	sort: string;
};
