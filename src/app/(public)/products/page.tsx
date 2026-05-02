import { listCategories } from "@/services/categories";
import { listProducts } from "@/services/products";
import ProductGrid from "@/features/public/components/product-grid";
import {
	CategorySidebar,
	ProductHero,
	ProductsNav,
	ProductsSorter,
} from "@/features/public/products";
import { PUBLIC_PAGE_SIZE } from "@/config/catalog";
import { PublicSort } from "@/types/product";

type ProductsPageProps = {
	searchParams: Promise<{
		page?: string;
		sort?: string;
		categorySlugs?: string | string[];
	}>;
};

const sortOptions: Array<{ label: string; value: PublicSort }> = [
	{ label: "Newest commits", value: "newest" },
	{ label: "Price: low to high", value: "price_asc" },
	{ label: "Price: high to low", value: "price_desc" },
];

function normalizeCategorySlugs(
	input: string | string[] | undefined,
	availableSlugs: Set<string>,
) {
	const values = Array.isArray(input) ? input : input ? [input] : [];
	const separated = values.flatMap((value) => value.split(","));

	return separated
		.map((value) => value.trim())
		.filter((value) => value.length > 0 && availableSlugs.has(value));
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	const categoriesResponse = await listCategories();
	const params = await searchParams;
	const availableSlugs = new Set(
		categoriesResponse.data.map((item) => item.slug),
	);
	const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
	const sort = sortOptions.some((option) => option.value === params.sort)
		? (params.sort as PublicSort)
		: "newest";
	const categorySlugs = normalizeCategorySlugs(
		params.categorySlugs,
		availableSlugs,
	);

	const productsResponse = await listProducts({
		page,
		pageSize: PUBLIC_PAGE_SIZE,
		sort,
		categorySlugs: categorySlugs.length ? categorySlugs : undefined,
	});

	return (
		<div className="space-y-6">
			<ProductHero />
			<section className="grid gap-6 lg:grid-cols-[260px_1fr]">
				<CategorySidebar
					sort={sort}
					categorySlugs={categorySlugs}
					categories={categoriesResponse.data}
				/>

				<div className="space-y-4">
					<ProductsSorter
						lengthData={productsResponse.data.length}
						totalData={productsResponse.metadata.total}
						categorySlugs={categorySlugs}
						sortOptions={sortOptions}
						sort={sort}
					/>

					<ProductGrid products={productsResponse.data} />

					<ProductsNav
						page={page}
						totalPages={productsResponse.metadata.totalPages}
						sort={sort}
						categorySlugs={categorySlugs}
					/>
				</div>
			</section>
		</div>
	);
}
