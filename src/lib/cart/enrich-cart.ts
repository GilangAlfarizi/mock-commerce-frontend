import type { CartCookieLine } from "@/lib/cart/types";
import type { EnrichedCartLine } from "@/types/cart";
import { getProductBySlug } from "@/services/products/product.service";
import type { PublicProductDetail, PublicProductVariant } from "@/types/product";
import { isAxiosError } from "axios";

export type { EnrichedCartLine } from "@/types/cart";

function variantLabel(v: PublicProductVariant): string {
	return [v.size, v.color].filter(Boolean).join(" · ");
}

async function loadProductBySlug(
	slug: string,
): Promise<PublicProductDetail | null> {
	try {
		const res = await getProductBySlug(slug);
		return res.data;
	} catch (e) {
		if (isAxiosError(e) && e.response?.status === 404) return null;
		throw e;
	}
}

export async function enrichCartLines(
	lines: CartCookieLine[],
): Promise<EnrichedCartLine[]> {
	const uniqueSlugs = [...new Set(lines.map((l) => l.slug))];
	const loaded = new Map<string, PublicProductDetail | null>();
	await Promise.all(
		uniqueSlugs.map(async (slug) => {
			const p = await loadProductBySlug(slug);
			loaded.set(slug, p);
		}),
	);

	const out: EnrichedCartLine[] = [];
	for (const line of lines) {
		const product = loaded.get(line.slug);
		if (!product) {
			out.push({
				...line,
				productId: "",
				name: line.slug,
				imageUrl: "",
				unitPrice: 0,
				lineTotal: 0,
				variantLabel: null,
				valid: false,
				error: "Product no longer available",
			});
			continue;
		}

		let variant: PublicProductVariant | undefined;
		if (product.variants.length > 0) {
			if (!line.variantId) {
				out.push({
					...line,
					productId: product.id,
					name: product.name,
					imageUrl: product.imageUrl,
					unitPrice: 0,
					lineTotal: 0,
					variantLabel: null,
					valid: false,
					error: "Choose a variant for this product",
				});
				continue;
			}
			variant = product.variants.find((v) => v.id === line.variantId);
			if (!variant) {
				out.push({
					...line,
					productId: product.id,
					name: product.name,
					imageUrl: product.imageUrl,
					unitPrice: 0,
					lineTotal: 0,
					variantLabel: null,
					valid: false,
					error: "Variant no longer available",
				});
				continue;
			}
		} else if (line.variantId) {
			out.push({
				...line,
				productId: product.id,
				name: product.name,
				imageUrl: product.imageUrl,
				unitPrice: 0,
				lineTotal: 0,
				variantLabel: null,
				valid: false,
				error: "This product has no variants",
			});
			continue;
		}

		const unitPrice = product.price + (variant?.price ?? 0);
		const lineTotal = unitPrice * line.quantity;
		out.push({
			...line,
			productId: product.id,
			name: product.name,
			imageUrl: product.imageUrl,
			unitPrice,
			lineTotal,
			variantLabel: variant ? variantLabel(variant) : null,
			valid: true,
			error: null,
		});
	}

	return out;
}

export function cartTotals(lines: EnrichedCartLine[]) {
	const valid = lines.filter((l) => l.valid);
	const subtotal = valid.reduce((s, l) => s + l.lineTotal, 0);
	const count = valid.reduce((s, l) => s + l.quantity, 0);
	return { subtotal, count };
}
