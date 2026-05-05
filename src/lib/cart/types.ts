/**
 * Stored in the cart cookie — matches what public checkout expects after resolving slug → product.
 */
export type CartCookieLine = {
	slug: string;
	variantId?: string;
	quantity: number;
};

export function lineKey(line: Pick<CartCookieLine, "slug" | "variantId">): string {
	return `${line.slug}::${line.variantId ?? ""}`;
}
