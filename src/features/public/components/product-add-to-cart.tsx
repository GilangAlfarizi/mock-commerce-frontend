"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart/actions";
import { formatIdr } from "@/lib/format-currency";
import type { PublicProductDetail } from "@/types/product";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ProductAddToCartProps = {
	product: PublicProductDetail;
};

export default function ProductAddToCart({ product }: ProductAddToCartProps) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const hasVariants = product.variants.length > 0;
	const [variantId, setVariantId] = useState<string | undefined>(() => {
		if (product.variants.length === 1 && product.variants[0].stock > 0) {
			return product.variants[0].id;
		}
		return undefined;
	});

	function handleAdd() {
		startTransition(async () => {
			await addToCart(
				product.slug,
				1,
				hasVariants ? variantId : undefined,
			);
			router.refresh();
		});
	}

	const canAdd =
		!hasVariants || Boolean(variantId && product.variants.some((v) => v.id === variantId));

	return (
		<div className="space-y-3">
			{hasVariants ? (
				<div className="space-y-1">
					<label
						htmlFor={`variant-${product.slug}`}
						className="text-xs font-semibold uppercase tracking-wide">
						Variant
					</label>
					<select
						id={`variant-${product.slug}`}
						value={variantId ?? ""}
						onChange={(e) => setVariantId(e.target.value || undefined)}
						className="w-full border border-black bg-surface px-3 py-2 text-sm">
						<option value="">Select size & color</option>
						{product.variants.map((v) => (
							<option key={v.id} value={v.id} disabled={v.stock < 1}>
								{v.size} · {v.color} — {formatIdr(product.price + v.price)}
								{v.stock < 1 ? " (out of stock)" : ""}
							</option>
						))}
					</select>
				</div>
			) : null}
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					disabled={pending || !canAdd}
					onClick={handleAdd}
					className="rounded-none border border-black">
					{pending ? "Adding…" : "Add to cart"}
				</Button>
				<Button
					variant="outline"
					className="rounded-none border-black bg-surface"
					asChild>
					<Link href="/products">Continue browsing</Link>
				</Button>
			</div>
		</div>
	);
}
