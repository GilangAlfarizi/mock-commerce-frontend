"use client";

import { HIGHLIGHT_PRODUCT_COUNT } from "@/config/catalog";
import { usePublicProducts } from "@/hooks/use-public-products";
import Link from "next/link";
import ProductGrid from "../components/product-grid";

export default function HomeProductHighlights() {
	const { data, isPending, isError, error } = usePublicProducts({
		page: 1,
		pageSize: 3,
		sort: "newest",
	});

	return (
		<section className="space-y-4 border border-black bg-cream p-5 text-cream-foreground md:p-6">
			<div className="flex items-end justify-between gap-4">
				<h2 className="font-mono text-2xl font-semibold tracking-tight">
					Highlighted products
				</h2>
				<Link
					href="/products"
					className="text-sm font-medium underline decoration-black underline-offset-4">
					See all products
				</Link>
			</div>

			{isPending ? (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: HIGHLIGHT_PRODUCT_COUNT }).map((_, i) => (
						<div
							key={i}
							className="h-64 animate-pulse border border-black bg-surface/60"
						/>
					))}
				</div>
			) : null}

			{isError ? (
				<p className="text-sm text-destructive" role="alert">
					{error.message}
				</p>
			) : null}

			{!isPending && !isError && data ? (
				<ProductGrid
					products={data.data.slice(0, HIGHLIGHT_PRODUCT_COUNT)}
				/>
			) : null}
		</section>
	);
}
