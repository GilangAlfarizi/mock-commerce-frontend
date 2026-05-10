import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import clsx from "clsx";
import { PublicSort } from "@/types/product";

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

export function ProductsNav({
	page,
	totalPages,
	sort,
	categorySlugs,
}: {
	page: number;
	totalPages: number;
	sort: PublicSort;
	categorySlugs: string[];
}) {
	return (
		<>
			<nav className="flex flex-wrap items-center justify-center gap-2 pt-2">
				{page > 1 ? (
					<Link
						href={`/products?${buildQueryString({
							page: page - 1,
							sort,
							categorySlugs,
						})}`}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-none border-black bg-surface",
						)}>
						Previous
					</Link>
				) : (
					<span
						aria-disabled="true"
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-none border-black bg-surface pointer-events-none opacity-50",
						)}>
						Previous
					</span>
				)}

				{Array.from({ length: totalPages }).map((_, index) => {
					const currentPage = index + 1;
					const isActive = currentPage === page;

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
									: "bg-surface hover:bg-cream",
							)}>
							{currentPage}
						</Link>
					);
				})}

				{page < totalPages ? (
					<Link
						href={`/products?${buildQueryString({
							page: page + 1,
							sort,
							categorySlugs,
						})}`}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-none border-black bg-surface",
						)}>
						Next
					</Link>
				) : (
					<span
						aria-disabled="true"
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"rounded-none border-black bg-surface pointer-events-none opacity-50",
						)}>
						Next
					</span>
				)}
			</nav>
		</>
	);
}
