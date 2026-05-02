import { Button } from "@/components/ui/button";
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
				<Button
					variant="outline"
					size="sm"
					className="rounded-none border-black bg-surface"
					disabled={page <= 1}
					asChild={page > 1}>
					{page > 1 ? (
						<Link
							href={`/products?${buildQueryString({
								page: page - 1,
								sort,
								categorySlugs,
							})}`}>
							Previous
						</Link>
					) : (
						<span>Previous</span>
					)}
				</Button>

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

				<Button
					variant="outline"
					size="sm"
					className="rounded-none border-black bg-surface"
					disabled={page >= totalPages}
					asChild={page < totalPages}>
					{page < totalPages ? (
						<Link
							href={`/products?${buildQueryString({
								page: page + 1,
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
		</>
	);
}
