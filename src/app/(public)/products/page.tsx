import { Button } from "@/components/ui/button";
import {
	PUBLIC_PAGE_SIZE,
	getPublicCategoriesResponse,
	listPublicProductsResponse,
	type PublicSort,
} from "@/features/public/products/mock-public-api";
import clsx from "clsx";
import { SearchCode } from "lucide-react";
import Link from "next/link";

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

function toCurrency(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(price);
}

function buildQueryString(params: {
	page: number;
	sort: PublicSort;
	categorySlugs: string[];
}) {
	const query = new URLSearchParams();
	query.set("page", String(params.page));
	query.set("sort", params.sort);

	if (params.categorySlugs.length > 0) {
		query.set("categorySlugs", params.categorySlugs.join(","));
	}

	return query.toString();
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
	const categoriesResponse = getPublicCategoriesResponse();
	const params = await searchParams;
	const availableSlugs = new Set(categoriesResponse.data.map((item) => item.slug));
	const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
	const sort = sortOptions.some((option) => option.value === params.sort)
		? (params.sort as PublicSort)
		: "newest";
	const categorySlugs = normalizeCategorySlugs(
		params.categorySlugs,
		availableSlugs,
	);

	const productsResponse = listPublicProductsResponse({
		page,
		pageSize: PUBLIC_PAGE_SIZE,
		sort,
		categorySlugs,
	});

	return (
		<div className="space-y-6">
			<section className="border border-black bg-[var(--cream)] p-5 md:p-6">
				<div className="space-y-2">
					<p className="inline-flex border border-black bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
						Catalog mode: ON
					</p>
					<h1 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl">
						Ship your outfit like you ship your sprint
					</h1>
					<p className="max-w-3xl text-sm text-muted-foreground md:text-base">
						Filter by category, sort by budget, and pick your next deploy-day fit.
						All products below are using mock data shaped to the public API contract.
					</p>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-[260px_1fr]">
				<aside className="h-fit space-y-4 border border-black bg-[var(--cream)] p-4">
					<div>
						<h2 className="font-mono text-lg font-semibold">Filters</h2>
						<p className="text-xs text-muted-foreground">
							Select multiple categories (OR logic).
						</p>
					</div>
					<form method="get" className="space-y-4">
						<input type="hidden" name="sort" value={sort} />
						<input type="hidden" name="page" value="1" />
						<div className="space-y-2">
							{categoriesResponse.data.map((category) => (
								<label
									key={category.id}
									className="flex items-center gap-2 border border-black bg-[var(--surface)] px-2 py-1.5 text-sm">
									<input
										type="checkbox"
										name="categorySlugs"
										value={category.slug}
										defaultChecked={categorySlugs.includes(category.slug)}
									/>
									<span>{category.name}</span>
								</label>
							))}
						</div>
						<Button type="submit" className="w-full rounded-none border border-black">
							Apply filter
						</Button>
						<Button
							type="button"
							variant="outline"
							className="w-full rounded-none border-black bg-[var(--surface)]"
							asChild>
							<Link href="/products">Reset filters</Link>
						</Button>
					</form>
				</aside>

				<div className="space-y-4">
					<div className="flex flex-col gap-3 border border-black bg-[var(--cream)] p-4 md:flex-row md:items-center md:justify-between">
						<p className="text-sm text-muted-foreground">
							Showing{" "}
							<span className="font-semibold text-foreground">
								{productsResponse.data.length}
							</span>{" "}
							of{" "}
							<span className="font-semibold text-foreground">
								{productsResponse.metadata.total}
							</span>{" "}
							products
						</p>
						<form method="get" className="flex flex-wrap items-center gap-2">
							{categorySlugs.map((slug) => (
								<input
									key={slug}
									type="hidden"
									name="categorySlugs"
									value={slug}
								/>
							))}
							<input type="hidden" name="page" value="1" />
							<select
								name="sort"
								defaultValue={sort}
								className="h-8 min-w-44 rounded-none border border-black bg-[var(--surface)] px-2 text-xs">
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<Button
								type="submit"
								variant="outline"
								className="rounded-none border-black bg-[var(--surface)]">
								Apply sort
							</Button>
						</form>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{productsResponse.data.map((product) => (
							<article
								key={product.id}
								className="flex h-full flex-col border border-black bg-[var(--surface)] p-3">
								<div className="aspect-[4/5] border border-black bg-secondary" />
								<div className="mt-3 flex flex-1 flex-col space-y-2">
									<p className="inline-flex border border-black bg-[var(--cream)] px-2 py-0.5 text-xs">
										{product.categoryName}
									</p>
									<h3 className="font-mono text-base font-semibold leading-tight">
										{product.name}
									</h3>
									<p className="line-clamp-2 text-xs text-muted-foreground">
										{product.description}
									</p>
									<div className="mt-auto flex items-center justify-between pt-4">
										<p className="text-sm font-semibold">
											{toCurrency(product.price)}
										</p>
										<Button
											variant="outline"
											size="sm"
											className="rounded-none border-black bg-[var(--cream)]"
											asChild>
											<Link href={`/products/${product.slug}`}>
											<SearchCode className="size-4" />
											</Link>
										</Button>
									</div>
								</div>
							</article>
						))}
					</div>

					<nav className="flex flex-wrap items-center justify-center gap-2 pt-2">
						<Button
							variant="outline"
							size="sm"
							className="rounded-none border-black bg-[var(--surface)]"
							disabled={productsResponse.metadata.page <= 1}
							asChild={productsResponse.metadata.page > 1}>
							{productsResponse.metadata.page > 1 ? (
								<Link
									href={`/products?${buildQueryString({
										page: productsResponse.metadata.page - 1,
										sort,
										categorySlugs,
									})}`}>
									Previous
								</Link>
							) : (
								<span>Previous</span>
							)}
						</Button>

						{Array.from({ length: productsResponse.metadata.totalPages }).map(
							(_, index) => {
								const currentPage = index + 1;
								const isActive = currentPage === productsResponse.metadata.page;

								return (
									<Link
										key={currentPage}
										href={`/products?${buildQueryString({
											page: currentPage,
											sort,
											categorySlugs,
										})}`}
										className={clsx(
											"inline-flex h-8 min-w-8 items-center justify-center border border-black px-2 text-xs font-semibold",
											isActive
												? "bg-primary text-primary-foreground"
												: "bg-[var(--surface)] hover:bg-[var(--cream)]",
										)}>
										{currentPage}
									</Link>
								);
							},
						)}

						<Button
							variant="outline"
							size="sm"
							className="rounded-none border-black bg-[var(--surface)]"
							disabled={
								productsResponse.metadata.page >= productsResponse.metadata.totalPages
							}
							asChild={
								productsResponse.metadata.page < productsResponse.metadata.totalPages
							}>
							{productsResponse.metadata.page < productsResponse.metadata.totalPages ? (
								<Link
									href={`/products?${buildQueryString({
										page: productsResponse.metadata.page + 1,
										sort,
										categorySlugs,
									})}`}>
									Next
								</Link>
							) : (
								<span>Next</span>
							)}
						</Button>
					</nav>
				</div>
			</section>
		</div>
	);
}
